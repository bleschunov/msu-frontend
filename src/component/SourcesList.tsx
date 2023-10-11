import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex, Input,
    Text,
} from "@chakra-ui/react"
import { ChangeEvent, Dispatch, FC, SetStateAction, useContext, useRef } from "react"
import { BsCheck } from "react-icons/bs"
import { FaFileUpload } from "react-icons/fa"
import FileModel from "model/FileModel"
import queryClient from "api/queryClient"
import { ModeContext, ModeContextI } from "context/modeContext"
import { useFiles } from "service/fileService"

interface ISourcesList {
    chat_id: number
    filesList: FileModel[]
    currentFileIndex: number
    setCurrentFileIndex: Dispatch<SetStateAction<number>>
    isOpen: boolean
    onClose: () => void
}

const SourcesList: FC<ISourcesList> = ({
    chat_id,
    filesList,
    currentFileIndex,
    setCurrentFileIndex,
    isOpen,
    onClose
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const {
        setMode,
        isFilesEnabled
    } = useContext<ModeContextI>(ModeContext)

    const filesMutation = useFiles()

    const onUploadFiles = async (files: FileList) => {
        const file = files.item(0)
        setMode("pdf")
        await filesMutation.mutateAsync({
            chat_id: chat_id,
            file: file!
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
        if (isFilesEnabled)
            return filesMutation.isLoading
        return filesMutation.isLoading
    }
    const handleUploadFileButtonClick = () => {
        fileInputRef.current?.click()
    }

    const getShortFileName = (filename: string) => {
        if (filename.length > 30)
            return filename.substring(0, 10) + "..." + filename.substring(filename.length - 10)
        return filename
    }

    return (
        <Drawer onClose={onClose} isOpen={isOpen} size="sm">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Библиотека</DrawerHeader>

                <DrawerBody
                    display="flex"
                    flexDirection="column"
                    paddingBottom={10}
                >
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
                            // ref={index === sourceList.length - 1 ? lastSourceRef : null}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            backgroundColor={index === currentFileIndex ? "gray.100" : "transparent"}
                            padding={3}
                            borderRadius={10}
                        >
                            <Flex direction="column">
                                <Text>
                                    {getShortFileName(file.name_ru)}
                                </Text>
                            </Flex>
                            {index === currentFileIndex ? (
                                <BsCheck size={24}/>
                            ) : (
                                <Button
                                    colorScheme="blue"
                                    variant="link"
                                    size="sm"
                                    onClick={() => setCurrentFileIndex(index)}
                                >
                                    Выбрать
                                </Button>
                            )}
                        </Flex>
                    ))}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}

export default SourcesList
