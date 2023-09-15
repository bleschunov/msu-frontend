import { Box, Card, CardBody, Flex, Text, VStack } from "@chakra-ui/react"
import { FC, ReactNode } from "react"
import Avatar from "component/Avatar"
import Callback from "component/Callback"
import Code from "component/Code"
import Markdown from "component/Markdown"
import MessageModel from "model/MessageModel"
import { ReviewModelRead } from "model/ReviewModel"
import MarkModel from "model/MarkModel"
import { formatDate } from "misc/util"

interface MessageProps {
    messageId: number
    src: string
    children: ReactNode
    direction: "incoming" | "outgoing"
    reviewModels?: ReviewModelRead[]
    markModel?: MarkModel
    callback?: boolean
}

// # TODO: Разделить визуальный компонент сообщения и логику с обработкой айди.
//  Это нужно, потому что я не могу отобразить моковое сообщение, потому что у него нет айди.
// # TODO: Сделать на беке в сообщении указание, сообщение от человека или от робота и убрать логику определения этого с фронта.
export const Message: FC<MessageProps> = ({
    messageId,
    src,
    direction,
    children,
    reviewModels,
    markModel,
    callback = true
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

                    {direction === "incoming" && callback &&
                        <>
                            <Box mt="5"><Callback markModel={markModel} messageId={messageId} /></Box>
                            <VStack align="start">
                                {reviewModels && reviewModels.length !== 0 &&
                                    <>
                                        <Text fontWeight="bold" mt="5">Комментарии</Text>
                                        {reviewModels.map(({ commentary, id, created_at }, index) => (
                                            <VStack align="left" mt={index === 0 ? 0 : 4} spacing={0}>
                                                <Text color="gray.500" fontSize="15">{formatDate(created_at)}</Text>
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

export const createMessage = (messageModel: MessageModel, key: number): ReactNode => {
    let messageContent = ""
    let src = ""

    if (messageModel.query) {
        messageContent += messageModel.query
        src = "/image/avatar/user.png"
    }

    if (messageModel.answer || messageModel.sql || messageModel.table) {
        messageContent = messageModel.answer ?? ""
        src = "/image/avatar/bot.png"
    }

    return <Message
        reviewModels={messageModel?.review}
        markModel={messageModel.mark && (messageModel.mark.length === 0 ? undefined : messageModel.mark[0])}
        src={src}
        messageId={messageModel.id}
        direction={messageModel.answer != undefined ? "incoming" : "outgoing"} // eslint-disable-line
        key={key}
    >
        <Markdown>{messageContent}</Markdown>
        { messageModel.sql && <Code>{messageModel.sql}</Code> }
        {<Box
            overflowX="scroll"
            css={{
                "&::-webkit-scrollbar": {
                    display: "none",
                },
            }}
        >
            {messageModel.table && <Text mt="5"><Markdown>{messageModel.table}</Markdown></Text>}
        </Box>}
    </Message>
}