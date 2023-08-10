import React, {ChangeEvent, FC, useState} from 'react';
import {Button, HStack, Input, Text} from "@chakra-ui/react";
import {Message} from "./Message";
import {ReviewModel} from "../model/ReviewModel";
import {useMutation, useQueryClient} from "react-query";
import {insertReview} from "../api/supabase";

type StageType = "mark" | "commentary" | "finish"

interface ICallback {
    messageId: string
}

const Callback: FC<ICallback> = ({ messageId }) => {
    const [stage, setStage] = useState<StageType>("mark")
    const [review, setReview] = useState<ReviewModel>({message_id: messageId})
    const [commentary, setCommentary] = useState<string>("")
    const queryClient = useQueryClient()

    const reviewMutation = useMutation(insertReview, {
        onSuccess: () => {
            setStage("finish")
            queryClient.invalidateQueries("messages")
        }
    })

    const handleMarkButton = (mark: number) => {
        setReview(review => ({...review, mark}))
        setStage("commentary")
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setReview(review => ({...review, commentary: event.target.value}))
        setCommentary(event.target.value)
    }

    const handleSubmit = () => {
        reviewMutation.mutate(review)
    }

    return (
        <Message direction="incoming" src="/avatar/admin.png">

            {stage === "mark" &&
                <>
                    <Text>Оцените, насколько правильно ответил ассистент:</Text>
                    <HStack mt="4" gap="3">
                        <Button colorScheme="blue" onClick={() => handleMarkButton(1)}>1</Button>
                        <Button colorScheme="blue" onClick={() => handleMarkButton(2)}>2</Button>
                        <Button colorScheme="blue" onClick={() => handleMarkButton(3)}>3</Button>
                        <Button colorScheme="blue" onClick={() => handleMarkButton(4)}>4</Button>
                        <Button colorScheme="blue" onClick={() => handleMarkButton(5)}>5</Button>
                    </HStack>
                </>
            }

            {stage === "commentary" &&
                <>
                    <Text>Напишите комментарий:</Text>
                    <HStack mt="4" gap="3">
                        <Input
                            // ref={inputRef}
                            value={commentary}
                            onChange={handleChange}
                            placeholder={"Print your query"}
                            // disabled={disabled}
                        />
                        <Button
                            colorScheme="blue"
                            onClick={handleSubmit}
                            isLoading={reviewMutation.isLoading}
                        >
                            Отправить
                        </Button>
                    </HStack>
                </>
            }

            {stage === "finish" && <Text>Спасибо!</Text>}
        </Message>
    );
};

export default Callback;