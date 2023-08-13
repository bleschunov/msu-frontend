import React, {ChangeEvent, FC, useState} from 'react';
import {Button, HStack, Input} from "@chakra-ui/react";
import {useMutation, useQueryClient} from "react-query";
import {updateOrCreateReview} from "../api/client";

type StageType = "mark" | "commentary" | "finish"

interface ICallback {
    messageId: number
}

const Callback: FC<ICallback> = ({messageId}) => {
    const [commentary, setCommentary] = useState<string>("")
    const queryClient = useQueryClient()

    const reviewMutation = useMutation(updateOrCreateReview, {
        onSuccess: () => {
            queryClient.invalidateQueries("chat")
        }
    })

    const handleMarkButton = (mark: number) => {
        // setReview(review => ({...review, mark}))
        // setStage("commentary")
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCommentary(event.target.value)
    }

    const handleSubmit = () => {
        // reviewMutation.mutate(review)
    }

    return (
        <HStack>
            <HStack mt="4" gap="3">
                <Button colorScheme="blue" onClick={() => handleMarkButton(1)}>👍</Button>
                <Button colorScheme="blue" onClick={() => handleMarkButton(0)}>👎</Button>
            </HStack>
            <HStack mt="4" gap="3">
                <Input
                    // ref={inputRef}
                    value={commentary}
                    onChange={handleChange}
                    placeholder="Комментарий"
                    // disabled={disabled}
                />
                <Button
                    colorScheme="blue"
                    onClick={handleSubmit}
                    // isLoading={reviewMutation.isLoading}
                >
                    Отправить
                </Button>
            </HStack>
        </HStack>
    );
};

export default Callback;