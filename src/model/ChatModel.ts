import MessageModel from "model/MessageModel"
import SourceModel from "model/SourceModel"

interface ChatModel {
    id: number
    user_id: string
    message?: MessageModel[]
    created_at: string
    source?: SourceModel[]
}

export default ChatModel