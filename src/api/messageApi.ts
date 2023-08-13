import axiosClient from "./axiosClient";
import MessageModel from "../model/MessageModel";

const createMessage = (body: Omit<MessageModel, "id" | "created_at" | "mark" | "review">): Promise<MessageModel> => {
    return axiosClient.post("/message", body)
}

export {
    createMessage
}