import MarkModel from '../../model/MarkModel'
import { ReactNode } from 'react'
import { ReviewModelRead } from '../../model/ReviewModel'

interface IAvatar {
    name: string
    src: string
}

interface ICallback {
    messageId: number;
    markModel?: MarkModel;
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
    ISkeletonMessage
}