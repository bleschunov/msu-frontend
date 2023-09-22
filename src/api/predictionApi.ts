import axiosClient from "api/axiosClient"
import MessageModel from "model/MessageModel"
import QueryModel from "model/QueryModel"

const getDatastepPrediction = (body: Omit<QueryModel, "chat_id">): Promise<MessageModel> => {
    return axiosClient.post("/assistant/prediction", body).then(response => response.data)
}

const getChatPdfPrediction = (body: Omit<QueryModel, "chat_id">): Promise<MessageModel> => {
    return axiosClient.post("/chat_pdf/prediction", body).then(response => ({ answer: response.data } as MessageModel))
}

export {
    getChatPdfPrediction, getDatastepPrediction
}
