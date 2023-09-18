import { Button, Flex, HStack, IconButton, Input, Textarea, Tooltip } from "@chakra-ui/react"
import { useQuery } from "misc/util"
import { ChangeEvent, Dispatch, FC, KeyboardEvent, SetStateAction, useRef } from "react"
import { FaFileUpload } from "react-icons/fa"
import useKeypress from "react-use-keypress"
import { FF_CHAT_PDF } from "types/FeatureFlags"

interface IInputGroup {
    value: string
    setValue: Dispatch<SetStateAction<string>>
    handleSubmit: () => void
    isLoading: boolean
    uploadFiles?: Dispatch<SetStateAction<FileList | null>>
    multipleFilesEnabled?: boolean
}

const InputGroup: FC<IInputGroup> = ({
    value,
    setValue,
    handleSubmit,
    isLoading,
    uploadFiles = () => {},
    multipleFilesEnabled = false,
}) => {
    const query = useQuery()
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    useKeypress("Enter", handleSubmit)
    
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit()
        }
    }

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value)
    }

    const handleClick = () => {
        setValue(value => value + " Не учитывай NULL.")
    }

    const filesEnabled = String(query.get(FF_CHAT_PDF)).toLowerCase() === "true"

    return (
        <Flex direction="column" gap="5">
            <HStack alignItems="flex-start">
                {filesEnabled && (
                    <>
                        <Tooltip label="Загрузить файл">
                            <IconButton
                                colorScheme="gray"
                                onClick={() => fileInputRef.current?.click()}
                                isLoading={isLoading}
                                icon={<FaFileUpload />}
                                aria-label="загрузить файл"
                            >
                            </IconButton>
                        </Tooltip>
                        <Input
                            hidden
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            multiple={multipleFilesEnabled}
                            onChange={(e) => uploadFiles(e.target.files)}
                        />
                    </>
                )}
                <Textarea
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Напишите ваш запрос"
                    disabled={isLoading}
                />
                <Button
                    colorScheme="blue"
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    isDisabled={value.trim() === ""}
                >
                    Отправить
                </Button>
            </HStack>
            
            <Button onClick={handleClick}>Не учитывать NULL</Button>
        </Flex>
    )
}

export default InputGroup