import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    IconButton,
    Input,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react"
import {
    ChangeEvent,
    Dispatch,
    FC,
    SetStateAction,
    useContext,
    useRef,
    useState,
} from "react"
import { BsCheck } from "react-icons/bs"
import { FaTrashAlt } from "react-icons/fa"
import { FaFileUpload } from "react-icons/fa"
import FileModel from "model/FileModel"
import queryClient from "api/queryClient"
import { ModeContext, ModeContextI } from "context/modeContext"
import { useMutation } from "react-query"
import { AxiosError } from "axios"
import { uploadFile as uploadFileApi } from "api/fileApi"
import { removeFile as removeFileApi } from "api/fileApi"

interface IFilesHistory {
  chat_id: number;
  filesList: FileModel[];
  currentFileIndex: number;
  setCurrentFileIndex: Dispatch<SetStateAction<number>>;
  isOpen: boolean;
  onClose: () => void;
}

const FilesHistory: FC<IFilesHistory> = ({
    chat_id,
    filesList,
    currentFileIndex,
    setCurrentFileIndex,
    isOpen,
    onClose,
}) => {
    const [errorMessage, setErrorMessage] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const { setMode, isFilesEnabled } = useContext<ModeContextI>(ModeContext)
    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
    } = useDisclosure()

    const filesMutation = useMutation(uploadFileApi, {
        onError: (error: AxiosError) => {
            // @ts-ignore
            setErrorMessage(error.response.data.detail)
        },
    })

    const deleteFileMutation = useMutation(removeFileApi, {
        onSuccess: () => { 
            queryClient.invalidateQueries("filesList")
        }
    })

    const onUploadFiles = async (files: FileList) => {
        const file = files.item(0)
        setMode("pdf")
        await filesMutation.mutateAsync({
            chat_id: chat_id,
            file: file!,
        })
        await queryClient.invalidateQueries("filesList")
    }

    const onDeleteFile = async (file: FileModel) => {
        await deleteFileMutation.mutateAsync(file)
    }

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            onUploadFiles(files)
        }
    }

    const isUploadFileBtnLoading = () => {
        if (isFilesEnabled) return filesMutation.isLoading
        return filesMutation.isLoading
    }
 
    const isDeletingFileBtnLoading = () => {
        if (isFilesEnabled) return deleteFileMutation.isLoading
        return deleteFileMutation.isLoading
    }

    const handleUploadFileButtonClick = () => {
        fileInputRef.current?.click()
    }

    const getShortFileName = (filename: string) => {
        if (filename.length > 50)
            return (
                filename.substring(0, 25) +
        "..." +
        filename.substring(filename.length - 25)
            )
        return filename
    }

    return (
        <Drawer onClose={onClose} isOpen={isOpen} size="xl">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Библиотека</DrawerHeader>

                <DrawerBody display="flex" flexDirection="column" paddingBottom={10}>
                    <Box alignSelf="flex-end" mb="5">
                        <Button
                            colorScheme="gray"
                            onClick={handleUploadFileButtonClick}
                            isLoading={isUploadFileBtnLoading()}
                            fontWeight="normal"
                            gap={2}
                        >
                            <FaFileUpload />
              Загрузить файл
                        </Button>
                    </Box>
                    {filesMutation.isError && <Text color="red">{errorMessage}</Text>}
                    <Input
                        hidden
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        multiple={false}
                        onChange={handleFileInputChange}
                    />
                    {filesList?.map((file, index) => (
                        <Flex
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            backgroundColor={
                                index === currentFileIndex ? "gray.100" : "transparent"
                            }
                            padding={3}
                            borderRadius={10}
                        >
                            <Flex direction="column">
                                <Text>{getShortFileName(file.name_ru)}</Text>
                            </Flex>
                            {index === currentFileIndex ? (
                                <BsCheck size={24} />
                            ) : (
                                <Flex gap={10}>
                                    <Button
                                        colorScheme="blue"
                                        variant="link"
                                        size="sm"
                                        onClick={() => {
                                            setMode("pdf")
                                            setCurrentFileIndex(index)
                                        }}
                                    >
                                        Выбрать
                                    </Button>
                                    <IconButton
                                        aria-label="close-button"
                                        colorScheme="red"
                                        icon={<FaTrashAlt color="white" />}
                                        isLoading={isDeletingFileBtnLoading()}
                                        onClick={onOpenModal}
                                    />

                                    <Modal
                                        isOpen={isOpenModal}
                                        onClose={onCloseModal}
                                        isCentered
                                    >
                                        <ModalOverlay bg="blackAlpha.100" />
                                        <ModalContent>
                                            <ModalHeader>Удалить файл</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                                Вы уверены, что хотите удалить файл?
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button mr={3} onClick={onCloseModal}>
                                                    Отмена
                                                </Button>
                                                <Button
                                                    colorScheme="red"
                                                    onClick={() => {
                                                        onDeleteFile(file)
                                                        onCloseModal()
                                                    }}
                                                >
                                                        Удалить
                                                </Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                </Flex>
                            )}
                        </Flex>
                    ))}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}

export default FilesHistory
