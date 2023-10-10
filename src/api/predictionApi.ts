import axiosClient from "api/axiosClient"
import QueryModel from "model/QueryModel"
import { MessageInModel } from '../model/MessageModel'

const getDatastepPrediction = (body: Omit<QueryModel, "chat_id">): Promise<MessageInModel> => {
    return axiosClient.post("/assistant/prediction", body).then(response => response.data)
}

const getChatPdfPrediction = (body: Omit<QueryModel, "chat_id">): Promise<MessageInModel> => {
    return axiosClient.post("/chat_pdf/prediction", body).then(response => response.data)
}

export {
    getChatPdfPrediction, getDatastepPrediction
}
