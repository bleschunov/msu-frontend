import { Box, Card, CardBody, Flex, Text, VStack } from "@chakra-ui/react"
import { FC, ReactNode } from "react"
import Avatar from "component/Message/Avatar"
import Callback from "component/Message/Callback"
import Code from "component/Code"
import Markdown from "component/Message/Markdown"
import { formatDate } from "misc/util"
import ReactMarkdown from "react-markdown"
import { IMessage } from './types'
import Accordion from 'component/Accordion'
import { MessageModel } from 'model/MessageModel'

// # TODO: Разделить визуальный компонент сообщения и логику с обработкой айди.
//  Это нужно, потому что я не могу отобразить моковое сообщение, потому что у него нет айди.
// # TODO: Сделать на беке в сообщении указание, сообщение от человека или от робота и убрать логику определения этого с фронта.
export const Message: FC<IMessage> = ({
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
                            <Box mt="0"><Callback markModel={markModel} messageId={messageId} /></Box>
                            <VStack align="start">
                                {reviewModels && reviewModels.length !== 0 &&
                                    <>
                                        <Text fontWeight="bold" mt="5">Комментарии</Text>
                                        {reviewModels.map(({ commentary, id, created_at }, index) => (
                                            <VStack align="left" mt={index === 0 ? 0 : 4} spacing={0} key={id}>
                                                <Text color="gray.500" fontSize="15">{formatDate(created_at)}</Text>
                                                <ReactMarkdown>{commentary}</ReactMarkdown>
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

    const titles = []
    const panels = []

    if (messageModel.sql) {
        titles.push("Как получился результат")
        panels.push(<Code>{messageModel.sql}</Code>)
    }

    titles.push("Результат")

    if (messageModel.table) {
        panels.push(<Text mt="5"><Markdown>{messageModel.table}</Markdown></Text>)
    } else {
        panels.push(<Text mt="5">В таблице нет информации для данных фильтров</Text>)
    }

    return <Message
        reviewModels={messageModel?.review}
        markModel={messageModel.mark && (messageModel.mark.length === 0 ? undefined : messageModel.mark[0])}
        src={src}
        messageId={messageModel.id}
        direction={messageModel.answer != undefined ? "incoming" : "outgoing"}
        key={key}
    >
        <Markdown>{messageContent}</Markdown>
        <Box mt="5">
            { messageModel.sql &&
                <Accordion
                    titles={titles}
                    panels={panels}
                    defaultIndex={1}
                />
            }
        </Box>
    </Message>
}