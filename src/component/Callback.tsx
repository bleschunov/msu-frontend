import React, { ChangeEvent, FC, useContext, useState } from "react"
import { Button, HStack, Text, Textarea, VStack } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "react-query"
import MarkModel from "../model/MarkModel"
import { createMark } from "../api/markApi"
import { UserContext } from "../context/userContext"
import { User } from "@supabase/supabase-js"
import { createReview } from "../api/reviewApi"
import ChatModel from "../model/ChatModel"

interface CallbackProps {
  messageId: number;
  markModel?: MarkModel;
}

const updateMarkInChat = (oldChat: ChatModel, messageId: number, newMark: MarkModel) => {
    oldChat.message.forEach((message) => {
        if (message.id === messageId) {
            message.mark = [newMark]
        }
    })
    return oldChat
}

const Callback: FC<CallbackProps> = ({ messageId, markModel }) => {
    const [commentary, setCommentary] = useState<string>("")
    const queryClient = useQueryClient()

    const user = useContext<User>(UserContext)
    const createMarkMutation = useMutation(createMark, {
        onMutate: async (newMark: MarkModel) => {
            await queryClient.cancelQueries("chat")
            const previousChat = queryClient.getQueryData<ChatModel>("chat")
            if (previousChat) {
                queryClient.setQueriesData<ChatModel>("chat", updateMarkInChat(previousChat, messageId, newMark))
            }
            return {
                previousChat,
            }
        },
        onError: (_error, _currentMark, context) => {
            queryClient.setQueriesData("chat", context?.previousChat)
        },
        onSettled: () => {
            queryClient.invalidateQueries("chat")
        },
    })

    const reviewMutation = useMutation(createReview, {
        onSuccess: () => {
            queryClient.invalidateQueries("chat")
        },
    })

    const handleMarkButton = (mark: number) => {
        createMarkMutation.mutate({
            mark,
            created_by: user.id,
            message_id: messageId,
        } as MarkModel)
    }

    const handleChangeCommentary = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setCommentary(event.target.value)
    }

    const handleSubmitCommentary = () => {
        reviewMutation.mutate({
            commentary,
            message_id: messageId,
            created_by: user.id,
        })
        setCommentary("")
    }

    return (
        <VStack align="left" mt="10">
            <Text fontWeight="bold">
        Поставьте оценку и напишите комментарий, что понравилось в ответе, а что
        — нет:
            </Text>
            <HStack gap="3">
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
            <HStack mt="2" gap="3" alignItems="top">
                <Textarea
                    value={commentary}
                    onChange={handleChangeCommentary}
                    placeholder="Ваш комментарий..."
                    disabled={reviewMutation.isLoading}
                />
                <Button
                    colorScheme="blue"
                    onClick={handleSubmitCommentary}
                    isLoading={reviewMutation.isLoading}
                >
          Отправить
                </Button>
            </HStack>
        </VStack>
    )
}

export default Callback
