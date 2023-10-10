import { ReviewModelRead } from "model/ReviewModel"
import MarkModel from "model/MarkModel"

interface MessageBaseModel {
    answer?: string
    sql?: string
    table?: string
}

interface MessageCreateModel extends MessageBaseModel {
    query?: string
    connected_message_id?: number
    exception?: string
    chat_id: number
}

interface MessageInModel extends MessageBaseModel {
    similar_queries: string[]
}

interface MessageModel extends MessageInModel, MessageCreateModel {
    id: number
    review?: ReviewModelRead[]
    mark?: MarkModel[]
    created_at: string
    is_deleted: boolean
}


export type {
    MessageBaseModel,
    MessageCreateModel,
    MessageInModel,
    MessageModel
}