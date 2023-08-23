import MarkModel from '../model/MarkModel'
import axiosClient from './axiosClient'

const createMark = (body: Omit<MarkModel, "id" | "created_at">): Promise<MarkModel> => {
    return axiosClient.post("/mark", body)
}

export {
    createMark
}