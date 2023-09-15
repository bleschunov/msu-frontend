import axiosClient from "api/axiosClient"
import { ReviewModelCreate, ReviewModelRead } from "model/ReviewModel"

const createReview = (body: Omit<ReviewModelCreate, "id" | "created_at">): Promise<ReviewModelRead> => {
    return axiosClient.post("/v1/review", body).then(response => response.data)
}

export {
    createReview
}