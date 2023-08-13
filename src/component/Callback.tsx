import React, {ChangeEvent, FC, useContext, useState} from 'react';
import {Button, HStack, Input} from "@chakra-ui/react";
import {useMutation, useQueryClient} from "react-query";
import MarkModel from "../model/MarkModel";
import ReviewModel from "../model/ReviewModel";
import {createMark} from "../api/markApi";
import {UserContext} from "../context/userContext";
import {User} from "@supabase/supabase-js";
import {createReview} from "../api/reviewApi";

interface CallbackProps {
    messageId: number
    markModel?: MarkModel
    reviewModels?: ReviewModel[]
}

const Callback: FC<CallbackProps> = ({
    messageId,
    markModel,
    reviewModels
}) => {
    const [commentary, setCommentary] = useState<string>("")
    const queryClient = useQueryClient()

    const user = useContext<User>(UserContext)
    const createMarkMutation = useMutation(createMark, {
        onSuccess: () => {
            queryClient.invalidateQueries("chat")
        }
    })

    const reviewMutation = useMutation(createReview, {
        onSuccess: () => {
            queryClient.invalidateQueries("chat")
        }
    })

    const handleMarkButton = (mark: number) => {
        createMarkMutation.mutate({mark, created_by: user.id, message_id: messageId})
    }

    const handleChangeCommentary = (event: ChangeEvent<HTMLInputElement>) => {
        setCommentary(event.target.value)
    }

    const handleSubmitCommentary = () => {
        reviewMutation.mutate({commentary, message_id: messageId, created_by: user.id})
    }

    return (
        <HStack>
            <HStack mt="4" gap="3">
                <Button
                    colorScheme="blue"
                    variant={markModel && markModel.mark === 1 ? "solid" : "outline"}
                    onClick={() => handleMarkButton(1)}
                >
                    👍
                </Button>
                <Button
                    colorScheme="blue"
                    variant={markModel && markModel.mark === 0 ? "solid" : "outline"}
                    onClick={() => handleMarkButton(0)}
                >
                    👎
                </Button>
            </HStack>
            <HStack mt="4" gap="3">
                <Input
                    // ref={inputRef}
                    value={commentary}
                    onChange={handleChangeCommentary}
                    placeholder="Комментарий"
                    // disabled={disabled}
                />
                <Button
                    colorScheme="blue"
                    onClick={handleSubmitCommentary}
                    // isLoading={reviewMutation.isLoading}
                >
                    Отправить
                </Button>
            </HStack>
        </HStack>
    );
};

export default Callback;