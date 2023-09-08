import { Button, Flex, HStack, IconButton, Input, Tooltip } from "@chakra-ui/react"
import { ChangeEvent, Dispatch, FC, SetStateAction, useRef } from "react"
import { FaFileUpload } from "react-icons/fa"
import useKeypress from "react-use-keypress"

interface IInputGroup {
    value: string
    setValue: Dispatch<SetStateAction<string>>
    handleSubmit: () => void
    disabled: boolean
    uploadFiles?: Dispatch<SetStateAction<FileList | null>>
    multipleFilesEnabled?: boolean
}

const InputGroup: FC<IInputGroup> = ({
    value,
    setValue,
    handleSubmit,
    disabled,
    uploadFiles = () => {},
    multipleFilesEnabled = false
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    useKeypress("Enter", handleSubmit)
    
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }

    const handleClick = () => {
        setValue(value => value + " Не учитывай NULL.")
    }

    return (
        <Flex direction="column" gap="5">
            <HStack>
                <Tooltip label="Загрузить файл">
                    <IconButton
                        colorScheme="gray"
                        onClick={() => fileInputRef.current?.click()}
                        isLoading={disabled}
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
                <Input
                    value={value}
                    onChange={handleChange}
                    placeholder="Напишите ваш запрос или загрузите файл"
                    disabled={disabled}
                />
                <Button
                    colorScheme="blue"
                    onClick={handleSubmit}
                    isLoading={disabled}
                    isDisabled={value === ""}
                >
                    Отправить
                </Button>
            </HStack>
            
            <Button onClick={handleClick}>Не учитывать NULL</Button>
        </Flex>
    )
}

export default InputGroup