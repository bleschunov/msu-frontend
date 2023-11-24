import { MessageModel } from "model/MessageModel"

interface ChatModel {
    id: number
    user_id: string
    message?: MessageModel[]
    created_at: string
}

export default ChatModel