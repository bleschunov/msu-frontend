import { ReviewModelRead } from "./ReviewModel"
import MarkModel from "./MarkModel"

interface MessageModel {
    id: number
    chat_id: number
    query?: string
    answer?: string
    sql?: string
    table?: string
    exception?: string
    review?: ReviewModelRead[]
    mark?: MarkModel[]
    created_at: Date
}

export default MessageModel