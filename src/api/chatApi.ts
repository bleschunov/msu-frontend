import { AxiosError } from "axios"
import axiosClient from "api/axiosClient"
import ChatModel from "model/ChatModel"
import { sortDate } from "misc/util"

const getChat = async (userId: string): Promise<ChatModel> => {
    const { data: chatModel } = await axiosClient.get(`/v1/chat/${userId}`)
    return chatModel
}

const createChat = async (body: Omit<ChatModel, "id" | "created_at" | "message">): Promise<ChatModel> => {
    const { data: chatModel } = await axiosClient.post("/v1/chat", body)
    return chatModel
}

const getOrCreateChat = async (userId: string): Promise<ChatModel> => {
    try {
        const chat = await getChat(userId)
        chat.message?.sort(
            (messageA, messageB) => sortDate(messageA.created_at, messageB.created_at, false)
        )
        return chat
    } catch (e) {
        if (e instanceof AxiosError && e.response?.status === 404) {
            return await createChat({ user_id: userId })
        }

        throw e
    }
}

export {
    getChat,
    createChat,
    getOrCreateChat
}