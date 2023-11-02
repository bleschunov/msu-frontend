import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Input,
    Text,
} from "@chakra-ui/react"
import {
    ChangeEvent,
    Dispatch,
    FC,
    SetStateAction,
    useContext, useEffect,
    useRef,
    useState,
} from "react"
import { FaFileUpload } from "react-icons/fa"
import FileModel from "model/FileModel"
import queryClient from "api/queryClient"
import { ModeContext, ModeContextI } from "context/modeContext"
import { useMutation, useQuery } from "react-query"
import { AxiosError } from "axios"
import { uploadFile as uploadFileApi } from "api/fileApi"
import FileRow from "component/FilesHistory/FileRow"
import { FileUploadingProgress } from "component/FilesHistory/FileUploadingProgress"
import { getActiveFileUploadTasks } from "api/taskApi"
import { useSearchQuery } from "misc/util"

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
    const [isLoadingFilesEnabled, setIsLoadingFilesEnabled] = useState<boolean>(false)
    const query = useSearchQuery()

    useEffect(() => {
        setIsLoadingFilesEnabled(query.get("FF_LOADING_FILES")?.toLowerCase() === "true")
    }, [query])

    const filesMutation = useMutation(uploadFileApi, {
        onError: (error: AxiosError) => {
            // @ts-ignore
            setErrorMessage(error.response.data.detail)
        },
    })

    const { data: activeFileUploadTasks } = useQuery("activeFileUploadTasks", getActiveFileUploadTasks)

    const onUploadFiles = async (files: FileList) => {
        const file = files.item(0)
        setMode("wiki")
        await filesMutation.mutateAsync({
            chat_id: chat_id,
            file: file!,
        })
        await queryClient.invalidateQueries("filesList")
        await queryClient.invalidateQueries("activeFileUploadTasks")
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
                    {activeFileUploadTasks && activeFileUploadTasks.length !== 0
                        ? <Box mb="5"><FileUploadingProgress task={activeFileUploadTasks[0]} /></Box>
                        : isLoadingFilesEnabled && <Box alignSelf="flex-end" mb="5">
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
                        </Box>

                    }
                    {filesMutation.isError && <Text color="red">{errorMessage}</Text>}
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
