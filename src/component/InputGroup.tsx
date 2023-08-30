import React, { ChangeEvent, Dispatch, FC, SetStateAction, useContext } from "react"
import { Button, Flex, FormControl, FormLabel, HStack, Input, Switch } from "@chakra-ui/react"
import useKeypress from "react-use-keypress"
import { useQuery } from "misc/util"
import { FF_CHAT_PDF } from "types/FeatureFlags"
import { ModeContext, ModeContextI, ModeT } from "context/modeContext"

interface IInputGroup {
    value: string
    setValue: Dispatch<SetStateAction<string>>
    handleSubmit: () => void
    disabled: boolean,
}

const InputGroup: FC<IInputGroup> = ({
    value,
    setValue,
    handleSubmit,
    disabled,
}) => {
    const query = useQuery()
    useKeypress("Enter", handleSubmit)
    const { setMode } = useContext<ModeContextI>(ModeContext)

    const handleSwitchMode = () => {
        setMode((mode: ModeT) => mode === "datastep" ? "pdf" : "datastep")
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }

    const handleClick = () => {
        setValue(value => value + " Не учитывай NULL.")
    }

    return (
        <Flex direction="column" gap="5">
            <HStack>
                <Input
                    value={value}
                    onChange={handleChange}
                    placeholder="Напишите ваш запрос"
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
            {String(query.get(FF_CHAT_PDF)).toLowerCase() === "true" &&
                <FormControl display='flex' alignItems='center'>
                    <FormLabel htmlFor='email-alerts' mb='0'>
                        Режим работы по документам
                    </FormLabel>
                    <Switch onChange={handleSwitchMode} id='email-alerts' />
                </FormControl>
            }
        </Flex>
    )
}

export default InputGroup