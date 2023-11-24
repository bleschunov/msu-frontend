import { ReactNode } from "react"
import MarkModel from "model/MarkModel"
import { ReviewModelRead } from "model/ReviewModel"
import { FavoriteMessageModel } from "model/MessageModel"

interface IAvatar {
    name: string
    src: string
}

interface ICallback {
    messageId: number;
}

interface IMarkdown {
    children: string
}

interface IMessage {
    messageId: number
    src: string
    children: ReactNode
    direction: "incoming" | "outgoing"
    reviewModels?: ReviewModelRead[]
    markModel?: MarkModel
    callback?: boolean
    query?: string
}

interface IFavoriteMessage {
    favoriteMessage: FavoriteMessageModel
}

interface ISkeletonMessage {
    direction: "incoming" | "outgoing"
    width: string
    height: string
}

export type {
    IAvatar,
    ICallback,
    IMarkdown,
    IMessage,
    ISkeletonMessage,
    IFavoriteMessage
}