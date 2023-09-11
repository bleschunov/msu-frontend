import axiosClient from "api/axiosClient"
import ChatModel from "model/ChatModel"
import MessageModel from "model/MessageModel"

const createMessage = (body: Omit<MessageModel, "id" | "created_at" | "mark" | "review">): Promise<MessageModel> => {
    return axiosClient.post("/message", body).then(response => response.data)
}

const clearMessages = (body: Omit<ChatModel, "message" | "created_at">): Promise<void> => {
    return axiosClient.post("/clearMessages", body)
}

export {
    createMessage,
    clearMessages
}