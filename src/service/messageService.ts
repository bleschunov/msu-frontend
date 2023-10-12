import { clearMessages as clearMessagesApi, createMessage as createMessageApi } from "api/messageApi"
import queryClient from "api/queryClient"
import { INITIAL_MESSAGE_COUNT } from "constant/chatMessages"
import { ModeContext, ModeContextI } from "context/modeContext"
import ChatModel from "model/ChatModel"
import { MessageCreateModel, MessageModel } from "model/MessageModel"
import { useContext } from "react"
import { useMutation } from "react-query"

const updateMessagesInChat = (previousChat: ChatModel, newMessage: MessageModel) => {
    previousChat.message?.push(newMessage)
    return previousChat
}

const useCreateMessage = () => {
    const { setShownMessageCount } = useContext<ModeContextI>(ModeContext)

    return useMutation(createMessageApi, {
        onMutate: async (newMessage: MessageCreateModel) => {
            await queryClient.cancelQueries("message")
            const previousChat = queryClient.getQueryData<ChatModel>("chat")
            if (previousChat) {
                queryClient.setQueriesData<ChatModel>("chat", updateMessagesInChat(previousChat, newMessage as MessageModel))
            }
            return {
                previousChat,
            }
        },
        onError: (_error, _currentMark, context) => {
            queryClient.setQueriesData("chat", context?.previousChat)
        },
        onSettled: () => {
            setShownMessageCount((lastN: number) => lastN + 1)
        }
    })
}

const useClearMessages = () => {
    const { setShownMessageCount } = useContext<ModeContextI>(ModeContext)

    return useMutation(clearMessagesApi, {
        onError: () => {
            queryClient.invalidateQueries("chat")
        },
        onSettled: () => {
            setShownMessageCount(INITIAL_MESSAGE_COUNT)
        },
    })
}

export {
    useClearMessages,
    useCreateMessage
}
