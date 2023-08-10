import React, {ChangeEvent, FC, LegacyRef} from 'react';
import {Button, Flex, HStack, Input, VStack} from "@chakra-ui/react";
import useKeypress from 'react-use-keypress';

interface IInputGroup {
    inputRef?: LegacyRef<HTMLInputElement>
    value: string
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void
    handleSubmit: () => void
    handleContextReset: () => void
    disabled: boolean
}

const InputGroup: FC<IInputGroup> = ({
    // inputRef,
    value,
    handleChange,
    handleSubmit,
    handleContextReset,
    disabled
}) => {
    useKeypress("Enter", handleSubmit)

    return (
        <Flex direction="column" gap="5">
            <HStack>
                <Input
                    // ref={inputRef}
                    value={value}
                    onChange={handleChange}
                    placeholder={"Print your query"}
                    disabled={disabled}
                />
                <Button
                    colorScheme="blue"
                    onClick={handleSubmit}
                    isLoading={disabled}
                    isDisabled={value === ""}
                >
                    Send
                </Button>
            </HStack>
            <VStack align="start">
                <Button
                    colorScheme="blue"
                    onClick={handleContextReset}
                    isDisabled={disabled}
                >
                    Reset Context
                </Button>
            </VStack>
        </Flex>
    );
};

export default InputGroup;