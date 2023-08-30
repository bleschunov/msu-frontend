import axiosClient from "api/axiosClient"
import MarkModel from "model/MarkModel"

const createMark = (body: Omit<MarkModel, "id" | "created_at">): Promise<MarkModel> => {
    return axiosClient.post("/mark", body).then(response => response.data)
}

export {
    createMark
}