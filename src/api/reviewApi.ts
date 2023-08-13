import ReviewModel from "../model/ReviewModel";
import axiosClient from "./axiosClient";

const createReview = (body: Omit<ReviewModel, "id" | "created_at">): Promise<ReviewModel> => {
    return axiosClient.post("/review", body)
}

export {
    createReview
}