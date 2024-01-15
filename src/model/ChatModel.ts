import { MessageModel } from "model/MessageModel"

interface ChatModel {
    id: number
    user_id: string
    messages: MessageModel[]
}

export default ChatModel