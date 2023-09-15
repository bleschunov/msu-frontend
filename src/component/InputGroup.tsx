import React, { ChangeEvent, Dispatch, FC, SetStateAction, useContext, KeyboardEvent } from "react"
import { Button, Flex, FormControl, FormLabel, HStack, Switch, Textarea } from "@chakra-ui/react"
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
    const { setMode } = useContext<ModeContextI>(ModeContext)

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit()
        }
    }

    const handleSwitchMode = () => {
        setMode((mode: ModeT) => mode === "datastep" ? "pdf" : "datastep")
    }

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value)
    }

    const handleClick = () => {
        setValue(value => value + " Не учитывай NULL.")
    }

    return (
        <Flex direction="column" gap="5">
            <HStack alignItems="start">
                <Textarea
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Напишите ваш запрос"
                    disabled={disabled}
                />
                <Button
                    colorScheme="blue"
                    onClick={handleSubmit}
                    isLoading={disabled}
                    isDisabled={value.trim() === ""}
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