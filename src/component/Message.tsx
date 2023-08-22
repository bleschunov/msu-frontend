import {Box, Card, CardBody, Flex, Text, VStack} from "@chakra-ui/react";
import {FC, ReactNode} from "react";
import Avatar from "./Avatar";
import Callback from "./Callback";
import MessageModel from "../model/MessageModel";
import {ReviewModelRead} from "../model/ReviewModel";
import MarkModel from "../model/MarkModel";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {formatRelativeDate} from "../misc/util";


interface MessageProps {
    messageId: number
    src: string
    children: ReactNode
    direction: "incoming" | "outgoing"
    reviewModels: ReviewModelRead[]
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

                    {direction === "incoming" &&
                        <>
                            <Box mt="5"><Callback markModel={markModel} messageId={messageId} /></Box>
                            <VStack align="start">
                                {reviewModels.length !== 0 &&
                                    <>
                                        <Text fontWeight="bold" mt="5">Комментарии</Text>
                                        {reviewModels.map(({commentary, id, created_at}, index) => (
                                            <VStack align="left" mt={index === 0 ? 0 : 4} spacing={0}>
                                                <Text color="gray.500" fontSize="15">{formatRelativeDate(created_at)}</Text>
                                                <Text key={id}>{commentary}</Text>
                                            </VStack>
                                        ))}
                                    </>
                                }
                            </VStack>
                        </>
                    }
                </CardBody>
            </Card>
        </Flex>
    )
}

export const createMessage = (messageModel: MessageModel): ReactNode => {
    let messageContent = ""
    let src = ""

    if (messageModel.query) {
        messageContent += messageModel.query
        src = "/image/avatar/user.png"
    }

    if (messageModel.answer) {
        messageContent = messageModel.answer
        src = "/image/avatar/bot.png"
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
        { messageModel.sql &&
        <Box
            mt="5"
            bg="blue.900"
            color="blue.300"
            borderRadius="5"
            padding="5"
            fontWeight="bold"
            overflowX="scroll"
            css={{
                '&::-webkit-scrollbar': {
                    display: "none",
                },
            }}
        >
            <Text><ReactMarkdown>{messageModel.sql}</ReactMarkdown></Text>
        </Box>}
        {messageModel.table && <Text mt="5"><ReactMarkdown remarkPlugins={[remarkGfm]}>{messageModel.table}</ReactMarkdown></Text>}
    </Message>
}