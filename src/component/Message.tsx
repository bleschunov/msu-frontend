import {Card, CardBody, CardFooter, Flex, Text, VStack} from "@chakra-ui/react";
import {FC, ReactNode} from "react";
import Avatar from "./Avatar";
import Callback from "./Callback";
import MessageModel from "../model/MessageModel";
import ReviewModel from "../model/ReviewModel";
import MarkModel from "../model/MarkModel";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


interface MessageProps {
    messageId: number
    src: string
    children: ReactNode
    direction: "incoming" | "outgoing"
    reviewModels: ReviewModel[]
    markModel?: MarkModel
}

export const Message: FC<MessageProps> = ({
    messageId,
    src,
    direction,
    children,
    reviewModels,
    markModel
}) => {
    let justify, flexDirection, name = ""

    if (direction === "incoming") {
        justify = "start" as const
        flexDirection = "row" as const
        name = "bot"
    }


    if (direction === "outgoing") {
        justify = "end" as const
        flexDirection = "row-reverse" as const
        name = "user"
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
                        <VStack align="start">
                            <Callback markModel={markModel} messageId={messageId} />
                            {reviewModels.length !== 0 && reviewModels.map(({commentary, id}) => <Text key={id}>{commentary}</Text>)}
                        </VStack>
                    </CardFooter>}
            </Card>
        </Flex>
    )
}

export const createMessage = (messageModel: MessageModel): ReactNode => {
    let messageContent = ""
    let src = ""

    if (messageModel.query) {
        messageContent += messageModel.query
        src = "/avatar/user.png"
    }

    if (messageModel.answer) {
        messageContent = messageModel.answer
        src = "/avatar/bot.png"
    }

    return <Message
        reviewModels={messageModel.review}
        markModel={messageModel.mark.length === 0 ? undefined : messageModel.mark[0]}
        src={src}
        messageId={messageModel.id}
        direction={messageModel.answer ? "incoming" : "outgoing"}
        key={messageModel.id}
    >
        <Text>{messageContent}</Text>
        {messageModel.sql && <Text mt="5"><ReactMarkdown>{messageModel.sql}</ReactMarkdown></Text>}
        {messageModel.table && <Text mt="5"><ReactMarkdown remarkPlugins={[remarkGfm]}>{messageModel.table}</ReactMarkdown></Text>}
    </Message>
}