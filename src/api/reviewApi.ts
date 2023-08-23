import { ReviewModelCreate } from '../model/ReviewModel'
import axiosClient from './axiosClient'

const createReview = (body: Omit<ReviewModelCreate, "id" | "created_at">): Promise<ReviewModelCreate> => {
    return axiosClient.post("/review", body)
}

export {
    createReview
}