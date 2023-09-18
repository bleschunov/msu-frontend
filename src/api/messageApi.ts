import axiosClient from "api/axiosClient"
import MessageModel from "model/MessageModel"

const createMessage = (body: Omit<MessageModel, "id" | "created_at" | "mark" | "review">): Promise<MessageModel> => {
    return axiosClient.post("/message", body).then(response => response.data)
}

const clearMessages = (chat_id: number): Promise<MessageModel[]> => {
    return axiosClient.post(`/message/${chat_id}`).then((response) => response.data)
}

export {
    clearMessages, createMessage
}
