import { useMutation, useQuery, useQueryClient } from "react-query"
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react"
import { Button, Flex } from "@chakra-ui/react"
import InputGroup from "./InputGroup"
import { createMessage, Message } from "./Message"
import { getChatPdfPrediction, getDatastepPrediction } from "../api/predictionApi"
import { getLastN } from "../misc/util"
import ChatModel from "../model/ChatModel"
import { createMessage as createMessageApi } from "../api/messageApi"
import { getOrCreateChat } from "../api/chatApi"
import { UserContext } from "../context/userContext"
import MessageModel from "../model/MessageModel"

const updateMessagesInChat = (previousChat: ChatModel, newMessage: MessageModel) => {
    previousChat.message?.push(newMessage)
    return previousChat
}

function Chat() {
    const [mode, setMode] = useState<string>("datastep")
    const [lastN, setLastN] = useState<number>(2)
    const messageWindowRef = useRef<HTMLDivElement>(null)
    const [query, setQuery] = useState("")
    const queryClient = useQueryClient()
    const chatRef = useRef<HTMLDivElement>(null)
    const user = useContext(UserContext)

    const { data: chat, status } = useQuery<ChatModel>("chat", () => {
        return getOrCreateChat(user.id)
    })

    // TODO: Как сделать, что тип аргументов createMessageApi подтягивался в useMutation?
    const messageCreateMutation = useMutation(createMessageApi, {
        onMutate: async (newMessage: MessageModel) => {
            await queryClient.cancelQueries("message")
            const previousChat = queryClient.getQueryData<ChatModel>("chat")
            if (previousChat) {
                queryClient.setQueriesData<ChatModel>("chat", updateMessagesInChat(previousChat, newMessage))
            }
            return {
                previousChat,
            }
        },
        onError: (_error, _currentMark, context) => {
            queryClient.setQueriesData("chat", context?.previousChat)
        },
        onSettled: () => {
            setLastN(lastN => lastN + 1)
            queryClient.invalidateQueries("chat")
        },
    })

    const predictionFunc = mode === "datastep" ? getDatastepPrediction : getChatPdfPrediction

    const predictionMutation = useMutation(predictionFunc, {
        onSuccess: ({ data }, { chat_id }) => {
            if (mode === "datastep") {
                messageCreateMutation.mutate({
                    chat_id,
                    answer: data.answer,
                    sql: data.sql,
                    table: data.table
                } as MessageModel)
            } else {
                messageCreateMutation.mutate({
                    chat_id,
                    answer: data
                } as MessageModel)
            }
        },
        onError: ({ response: { data } }, { chat_id }) => {
            const exception = typeof data.detail === "object"
                ? JSON.stringify(data.detail)
                : data.detail
            const message = "Произошла ошибка. Попробуйте другой запрос."

            messageCreateMutation.mutate({
                chat_id,
                exception,
                answer: message
            } as MessageModel)
        }
    })

    useEffect(() => {
        window.scroll({ top: chatRef.current?.offsetHeight, behavior: "smooth" })
    }, [chat?.message?.length])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    }

    const handleSubmit = () => {
        if (query !== "" && chat) {
            messageCreateMutation.mutate({ chat_id: chat.id, query } as MessageModel)
            predictionMutation.mutate({ query, chat_id: chat.id })
            setQuery("")
        }
    }

    const handleShowMore = () => {
        setLastN(lastN => lastN + 10)
    }

    const isLoading = predictionMutation.isLoading
        || messageCreateMutation.isLoading
        || status === "loading"

    return (
        <Flex direction="column" p="10" h="full" gap={10} ref={chatRef}>
            {chat && !!chat.message?.length && chat.message.length > lastN
                && <Button colorScheme="blue" variant="link" onClick={handleShowMore}>Предыдущие сообщения</Button>}
            <Flex direction="column" gap="5" flexGrow="1" ref={messageWindowRef}>
                {chat && !!chat.message?.length && getLastN(lastN, chat.message.map((message) => createMessage(message)))}
            </Flex>
            {chat && !chat.message?.length &&
                <Message direction='incoming' messageId={-1} src={"/image/avatar/bot.png"} callback={false}>
                    Какой у вас запрос?
                </Message>}
            <InputGroup
                disabled={isLoading}
                value={query}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                setMode={setMode}
            />
        </Flex>
    )
}

export default Chat