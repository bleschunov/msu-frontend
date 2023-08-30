import axiosClient from "./axiosClient"
import { ReviewModelCreate, ReviewModelRead } from "../model/ReviewModel"

const createReview = (body: Omit<ReviewModelCreate, "id" | "created_at">): Promise<ReviewModelRead> => {
    return axiosClient.post("/review", body).then(response => response.data)
}

export {
    createReview
}