import axiosClient from "api/axiosClient"
import QueryModel from "model/QueryModel"
import MessageModel from "model/MessageModel"

interface GetDatastepPredictionI{
    body: Omit<QueryModel, "chat_id">;
    version: string;
}

const getDatastepPrediction = ({ body, version = "v1" }: GetDatastepPredictionI): Promise<MessageModel> => {
    return axiosClient.post(`${version}/assistant/prediction`, body).then(response => response.data)
}

const getChatPdfPrediction = (body: Omit<QueryModel, "chat_id">, version: string = "v1"): Promise<MessageModel> => {
    return axiosClient.post(`${version}/chat_pdf/prediction`, body)
        .then(response => ({ answer: response.data } as MessageModel))
}

export {
    getDatastepPrediction,
    getChatPdfPrediction
}