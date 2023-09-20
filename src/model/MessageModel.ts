import { ReviewModelRead } from "model/ReviewModel"
import MarkModel from "model/MarkModel"

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
    created_at: string
    connected_message_id?: number
    is_deleted: boolean
}

export default MessageModel