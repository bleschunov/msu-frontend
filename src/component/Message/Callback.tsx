import { Button, HStack, Textarea, VStack } from '@chakra-ui/react'
import React, { ChangeEvent, FC, KeyboardEvent, useContext, useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { UserContext } from "context/userContext"
import { createReview } from "api/reviewApi"
import { UserModel } from "model/UserModel"
import { ICallback } from "component/Message/types"


const Callback: FC<ICallback> = ({ messageId }) => {
    const [commentary, setCommentary] = useState<string>("")
    const queryClient = useQueryClient()

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmitCommentary()
        }
    }

    const user = useContext<UserModel>(UserContext)

    const reviewMutation = useMutation(createReview, {
        onSuccess: () => {
            queryClient.invalidateQueries("chat")
        },
    })

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
                </VStack>
            </HStack>
        </VStack>
    )
}

export default Callback