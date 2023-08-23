import React, { ChangeEvent, FC, LegacyRef } from 'react'
import { Button, Flex, HStack, Input } from '@chakra-ui/react'
import useKeypress from 'react-use-keypress'

interface IInputGroup {
    inputRef?: LegacyRef<HTMLInputElement>
    value: string
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void
    handleSubmit: () => void
    disabled: boolean
}

const InputGroup: FC<IInputGroup> = ({
    // inputRef,
    value,
    handleChange,
    handleSubmit,
    disabled
}) => {
    useKeypress("Enter", handleSubmit)

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
        </Flex>
    )
}

export default InputGroup