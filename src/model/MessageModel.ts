import { ReviewModelRead } from "model/ReviewModel"
import MarkModel from "model/MarkModel"
import { ModeT } from "model/UserModel"

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
    page: number
}

interface MessageModel extends MessageInModel, MessageCreateModel {
    id: number
    review?: ReviewModelRead[]
    mark?: MarkModel[]
    created_at: string
    is_deleted: boolean
}

interface FavoriteMessageModel {
    id: number
    user_id: string
    mode: ModeT
    query: string
}

export type {
    MessageBaseModel,
    MessageCreateModel,
    MessageInModel,
    MessageModel,
    FavoriteMessageModel
}