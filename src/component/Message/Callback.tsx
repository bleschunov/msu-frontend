import React, { ChangeEvent, FC, KeyboardEvent, useContext, useState } from "react"
import { Box, Button, HStack, Textarea, VStack } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "react-query"
import MarkModel from "model/MarkModel"
import { createMark } from "api/markApi"
import { UserContext } from "context/userContext"
import { createReview } from "api/reviewApi"
import ChatModel from "model/ChatModel"
import { UserModel } from "model/UserModel"
import { ICallback } from "component/Message/types"

const updateMarkInChat = (oldChat: ChatModel, messageId: number, newMark: MarkModel) => {
    oldChat.message?.forEach((message) => {
        if (message.id === messageId) {
            message.mark = [newMark]
        }
    })
    return oldChat
}

const Callback: FC<ICallback> = ({ messageId, markModel }) => {
    const [commentary, setCommentary] = useState<string>("")
    const queryClient = useQueryClient()

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmitCommentary()
        }
    }

    const user = useContext<UserModel>(UserContext)
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

    const LikeDislike = () => {
        return (
            <HStack gap="3">
                <Button
                    size="xs"
                    colorScheme="blue"
                    variant={markModel && markModel.mark === 1 ? "solid" : "outline"}
                    onClick={() => handleMarkButton(1)}
                >
                    👍
                </Button>
                <Button
                    size="xs"
                    colorScheme="blue"
                    variant={markModel && markModel.mark === 0 ? "solid" : "outline"}
                    onClick={() => handleMarkButton(0)}
                >
                    👎
                </Button>
            </HStack>
        )
    }

    return (
        <VStack align="left" mt="10">
            <HStack mt="2" gap="3" alignItems="top">
                <Textarea
                    value={commentary}
                    onKeyDown={handleKeyDown}
                    onChange={handleChangeCommentary}
                    placeholder="Ваш комментарий..."
                    disabled={reviewMutation.isLoading}
                />
                <VStack justifyContent="space-between">
                    <Button
                        colorScheme="blue"
                        onClick={handleSubmitCommentary}
                        isLoading={reviewMutation.isLoading}
                    >
                        Отправить
                    </Button>
                    <Box alignSelf="end">
                        <LikeDislike />
                    </Box>
                </VStack>
            </HStack>
        </VStack>
    )
}

export default Callback
