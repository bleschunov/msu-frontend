import { Flex, IconButton, Text, Tooltip } from "@chakra-ui/react"
import { FC, useState } from "react"
import { FileUploader } from "react-drag-drop-files"
import { AiFillFileText, AiOutlineClose, AiOutlineQuestionCircle } from "react-icons/ai"
import { MdCloudUpload } from "react-icons/md"

interface IFilesUploadZone {
  multiple?: boolean
  disabled?: boolean
  handleSwitchMode?: () => void
}

const FilesUploadZone: FC<IFilesUploadZone> = (props) => {
    const {
        multiple = false,
        disabled = true,
        handleSwitchMode = () => {}
    } = props

    const fileTypes = ["PDF"]

    // TODO: maybe upload many files
    const [file, setFile] = useState<File>()

    if (disabled) return <></>

    return (
        <>
            {file ? (
                <Flex direction="row" alignItems="center" gap={2}>
                    <AiFillFileText size={18} />
                    <Text>{file.name}</Text>
                    <Tooltip label="Поиск будет происходить по загруженному файлу" placement="right">
                        {/* Add span because we use react-icons */}
                        <span>
                            <AiOutlineQuestionCircle size={18} />
                        </span>
                    </Tooltip>
                </Flex>
            ) : (
                <Flex width="100%" direction="column" position="relative">
                    <FileUploader
                        types={fileTypes}
                        multiple={multiple}
                        handleChange={(file: File) => {
                            setFile(file)
                        }}
                    >
                        <Flex
                            width="100%"
                            direction="column"
                            alignItems="center"
                            borderStyle="dashed"
                            borderRadius={15}
                            borderWidth={3}
                            borderColor="#EDF2F7"
                            padding={100}
                        >
                            <MdCloudUpload size={64} color="#3182CE" />
                            <Text>Перенесите файл сюда</Text>
                            <Text>или нажмите, чтобы выбрать его</Text>
                        </Flex>    
                    </FileUploader>

                    <IconButton
                        position="absolute"
                        top={0}
                        right={0}
                        variant="ghost"
                        borderRadius={15}
                        onClick={handleSwitchMode}
                        icon={<AiOutlineClose size={24} color="#3182CE" />}
                        aria-label="закрыть загрузку файлов"
                    />
                </Flex>
            )}
        </>
    )
}

export default FilesUploadZone