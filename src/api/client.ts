import {ReviewModel} from "../model/ReviewModel";
import axiosClient from "./axiosClient";
import {AxiosError} from "axios";

interface IChat {
    id: number
    user_id: number
    created_at: Date
    message: object[]
}

const getPrediction = (body: {query: string, chat_id: number}) => {
    return axiosClient.post("/datastep/prediction", body)
}

const resetContext = () => {
    return axiosClient.get("/datastep/reset_context")
}

const getChat = async (userId: string) => {
    return axiosClient.get<IChat>(`/chat/${userId}`)
}

const createChat = async (body: any) => {
    return axiosClient.post<IChat>("/chat", body)
}

const getOrCreateChat = async (userId: string) => {
    try {
        const {data: chat} = await getChat(userId)
        return chat
    } catch (e) {
        if (e instanceof AxiosError && e.response?.status === 404) {
            const {data: chat} = await createChat({user_id: userId})
            return chat
        }
    }
}

const updateOrCreateReview = (body: ReviewModel) => {
    return axiosClient.post("/review", body)
}

export {
    axiosClient,
    getPrediction,
    resetContext,
    getChat,
    createChat,
    getOrCreateChat,
    createMessage,
    updateOrCreateReview
}