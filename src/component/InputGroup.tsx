import React, {ChangeEvent, Dispatch, FC, LegacyRef, SetStateAction} from 'react';
import {Button, Flex, HStack, Input, Text} from "@chakra-ui/react";
import useKeypress from 'react-use-keypress';

interface IInputGroup {
    inputRef?: LegacyRef<HTMLInputElement>
    value: string
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void
    handleSubmit: () => void
    setValue: Dispatch<SetStateAction<string>>
    disabled: boolean
    tips: string[]
}

const InputGroup: FC<IInputGroup> = ({
    // inputRef,
    value,
    setValue,
    handleChange,
    handleSubmit,
    disabled,
    tips
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
            {tips.length !== 0 && <Text>Возможно, вы имели в виду:</Text>}
            {tips.map(tip => <Button onClick={() => setValue((value) => value + " " + tip)}>{tip}</Button>)}
        </Flex>
    );
};

export default InputGroup;