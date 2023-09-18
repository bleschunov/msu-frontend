import { clearMessages as clearMessagesApi, createMessage as createMessageApi } from "api/messageApi"
import queryClient from "api/queryClient"
import { ModeContext, ModeContextI } from "context/modeContext"
import ChatModel from "model/ChatModel"
import MessageModel from "model/MessageModel"
import { useContext } from "react"
import { useMutation } from "react-query"

const updateMessagesInChat = (previousChat: ChatModel, newMessage: MessageModel) => {
    previousChat.message?.push(newMessage)
    return previousChat
}

const useCreateMessage = () => {
    const { setShownMessageCount } = useContext<ModeContextI>(ModeContext)

    return useMutation(createMessageApi, {
        onMutate: async (newMessage: MessageModel) => {
            await queryClient.cancelQueries("message")
            const previousChat = queryClient.getQueryData<ChatModel>("chat")
            if (previousChat) {
                queryClient.setQueriesData<ChatModel>("chat", updateMessagesInChat(previousChat, newMessage))
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
        onMutate: async () => {
            await queryClient.cancelQueries("message")
            const previousChat = queryClient.getQueryData<ChatModel>("chat")
            if (previousChat) {
                previousChat.message = []
                queryClient.setQueriesData<ChatModel>("chat", previousChat)
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
            queryClient.invalidateQueries("chat")
        },
    })
}

export {
    useClearMessages,
    useCreateMessage
}
