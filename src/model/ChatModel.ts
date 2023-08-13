import MessageModel from "./MessageModel";

interface ChatModel {
    id: number
    user_id: string
    message: MessageModel[]
    created_at: Date
}