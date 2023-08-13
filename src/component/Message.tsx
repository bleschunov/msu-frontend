import {Card, CardBody, CardFooter, Flex, Text} from "@chakra-ui/react";
import {FC, ReactNode} from "react";
import Avatar from "./Avatar";
import {ReviewModel} from "../model/ReviewModel";
import Callback from "./Callback";

export interface MessageModel {
    answer?: string
    chat_id: string
    created_at?: string
    exception?: string
    id: number
    note?: string
    query?: string
    sql?: string
    table?: string
    review?: ReviewModel[]
}

interface IMessage {
    messageId: number
    src?: string
    children: ReactNode
    direction: "incoming" | "outgoing"
    review?: ReviewModel[]
}

export const Message: FC<IMessage> = ({ messageId, src, direction, children , review}) => {
    let justify, flexDirection, name = ""

    if (direction === "incoming") {
        justify = "start" as const
        flexDirection = "row" as const
        name = "bot"
        if (!src) {
            src = "/avatar/bot.png"
        }
    }


    if (direction === "outgoing") {
        justify = "end" as const
        flexDirection = "row-reverse" as const
        name = "user"
        if (!src) {
            src = "/avatar/user.png"
        }
    }


    return (
        <Flex
            justify={justify}
            flexDirection={flexDirection}
            gap="10px"
        >
            <Avatar name={name} src={src as string} />
            <Card>
                <CardBody>
                    {children}
                </CardBody>
                {direction === "incoming" &&
                    <CardFooter>
                        <Callback messageId={messageId}/>
                    </CardFooter>}
                {review && review.map(({commentary, mark}) => <Text>{commentary} {mark}</Text>)}
            </Card>
        </Flex>
    )
}

export const createMessage = (messageModel: MessageModel) => {
    let messageContent = messageModel.query

    if (messageModel.answer) {
        messageContent = messageModel.answer
    }

    const result = [
        <Message review={messageModel.review} messageId={messageModel.id} direction={messageModel.answer ? "incoming" : "outgoing"} key={messageModel.id}>
            {messageContent}
        </Message>
    ]

    if (messageModel.review?.length !== 0) {
        messageModel.review?.forEach(review => result.push(
            <Message messageId={messageModel.id} direction="incoming" key={review.id} src="/avatar/admin.png">
                <Text>Оценка: {review.mark}</Text>
                <Text mt={1}>Комментарий:</Text>
                <Text>{review.commentary}</Text>
            </Message>
        ))
    }

    return result
}
