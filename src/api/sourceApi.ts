import axiosClient from "api/axiosClient"
import SourceModel from "model/SourceModel"

const getAllSources = (chatId: number): Promise<SourceModel[]> => {
    return axiosClient.get(`/source/${chatId}`).then(response => response.data)
}

const getLastSource = (chatId: number): Promise<SourceModel> => {
    return axiosClient.get(`/source/last/${chatId}`).then(response => response.data)
}

const saveSource = (body: Omit<SourceModel, "id" | "created_at">): Promise<SourceModel> => {
    return axiosClient.post("/source/", body).then(response => response.data)
}

export {
    getAllSources, getLastSource, saveSource
}

