import { Button, Flex, HStack, IconButton, Input } from "@chakra-ui/react"
import { ChangeEvent, Dispatch, FC, SetStateAction } from "react"
import { FaFileUpload } from "react-icons/fa"
import useKeypress from "react-use-keypress"

interface IInputGroup {
    value: string
    setValue: Dispatch<SetStateAction<string>>
    handleSubmit: () => void
    disabled: boolean
    handleSwitchMode?: () => void
}

const InputGroup: FC<IInputGroup> = ({
    value,
    setValue,
    handleSubmit,
    disabled,
    handleSwitchMode
}) => {
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
                <IconButton
                    colorScheme="gray"
                    onClick={handleSwitchMode}
                    isLoading={disabled}
                    icon={<FaFileUpload />}
                    aria-label="загрузить файл"
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