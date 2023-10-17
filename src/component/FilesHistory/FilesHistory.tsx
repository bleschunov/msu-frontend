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
import FileRow from './FileRow'

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


    const filesMutation = useMutation(uploadFileApi, {
        onError: (error: AxiosError) => {
            // @ts-ignore
            setErrorMessage(error.response.data.detail)
        },
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
 
    const handleUploadFileButtonClick = () => {
        fileInputRef.current?.click()
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

                    {filesList?.map((file, index) => {
                        const isSelected = currentFileIndex === index

                        const setThisFileIndex = () => {
                            setCurrentFileIndex(index)
                        }

                        return (
                            <FileRow
                                file={file}
                                isSelected={isSelected}
                                setThisFileIndex={setThisFileIndex}
                            />
                        )
                    })}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}

export default FilesHistory
