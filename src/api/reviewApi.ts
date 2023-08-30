import axiosClient from "api/axiosClient"
import { ReviewModelCreate } from "model/ReviewModel"

const createReview = (body: Omit<ReviewModelCreate, "id" | "created_at">): Promise<ReviewModelCreate> => {
    return axiosClient.post("/review", body)
}

export {
    createReview
}