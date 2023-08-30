import axiosClient from "./axiosClient"
import QueryModel from "../model/QueryModel"
import MessageModel from "../model/MessageModel"
import { AxiosError, AxiosResponse } from 'axios'

const getDatastepPrediction = (body: Omit<QueryModel, "chat_id">): Promise<AxiosResponse<MessageModel>> => {
    return axiosClient.post("/assistant/prediction", body)
}

const getChatPdfPrediction = (body: QueryModel): Promise<AxiosResponse<string>> => {
    return axiosClient.post("/chat_pdf/prediction", body)
}

export {
    getDatastepPrediction,
    getChatPdfPrediction
}