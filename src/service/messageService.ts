import { useMutation } from "react-query"
import { useContext } from "react"
import { createMessage as createMessageApi } from "api/messageApi"
import MessageModel from "model/MessageModel"
import ChatModel from "model/ChatModel"
import queryClient from "api/queryClient"
import { ModeContext, ModeContextI } from "context/modeContext"

const updateMessagesInChat = (previousChat: ChatModel, newMessage: MessageModel) => {
    previousChat.message?.push(newMessage)
    return previousChat
}

const useCreateMessage = () => {
    const { setShownMessageCount } = useContext<ModeContextI>(ModeContext)

    // TODO: Как сделать, что тип аргументов createMessageApi подтягивался в useMutation?
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
            queryClient.invalidateQueries("chat")
        },
    })
}

export {
    useCreateMessage
}