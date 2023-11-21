import axiosClient from "api/axiosClient"
import { MessageCreateModel, MessageModel, FavoriteMessageModel } from "model/MessageModel"

const createMessage = (body: MessageCreateModel): Promise<MessageModel> => {
    return axiosClient.post("/message", body).then(response => response.data)
}

const clearMessages = (chat_id: number): Promise<MessageModel[]> => {
    return axiosClient.delete(`/message/${chat_id}`).then((response) => response.data)
}

const addFavoriteMessage = (body: Omit<FavoriteMessageModel, "id">): Promise<FavoriteMessageModel> => {
    return axiosClient.post("/message/favorite", body).then(response => response.data)
}

const getFavoriteMessages = async (userId: string): Promise<FavoriteMessageModel[]> => {
    return axiosClient.get(`/message/favorite/${userId}`).then(response => response.data)
}

const removeFavoriteMessage = (favorite_message_id: number): Promise<FavoriteMessageModel> => {
    return axiosClient.delete(`/message/favorite/${favorite_message_id}`).then((response) => response.data)
}

export {
    clearMessages, createMessage, addFavoriteMessage, getFavoriteMessages, removeFavoriteMessage
}
