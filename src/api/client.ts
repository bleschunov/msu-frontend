import axiosClient from "./axiosClient";

const getPrediction = (body: {query: string, chat_id: number}) => {
    return axiosClient.post("/datastep/prediction", body)
}

export {
    getPrediction,
}