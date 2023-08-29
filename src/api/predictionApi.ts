import axiosClient from "./axiosClient"

const getDatastepPrediction = (body: {query: string, chat_id: number}) => {
    return axiosClient.post("/assistant/prediction", body)
}

const getChatPdfPrediction = (body: {query: string, chat_id: number}) => {
    return axiosClient.post("/chat_pdf/prediction", body)
}

export {
    getDatastepPrediction,
    getChatPdfPrediction
}