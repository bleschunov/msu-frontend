import axiosClient from "api/axiosClient"
import { MessageCreateModel, MessageModel } from "model/MessageModel"

const createMessage = (body: MessageCreateModel): Promise<MessageModel> => {
    return axiosClient.post("/message", body).then(response => response.data)
}

const clearMessages = (chat_id: number): Promise<MessageModel[]> => {
    return axiosClient.delete(`/message/${chat_id}`).then((response) => response.data)
}

export {
    clearMessages, createMessage
}
