import React, {ChangeEvent, FC, LegacyRef} from 'react';
import {Button, Flex, HStack} from "@chakra-ui/react";
import useKeypress from 'react-use-keypress';
import EditableQuery from "./EditableQuery";

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
                {/*<Input*/}
                {/*    value={value}*/}
                {/*    onChange={handleChange}*/}
                {/*    placeholder="Напишите ваш запрос"*/}
                {/*    disabled={disabled}*/}
                {/*/>*/}
                <EditableQuery />
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
    );
};

export default InputGroup;