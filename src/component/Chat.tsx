import { useQuery } from "react-query"
import { useContext, useEffect, useRef, useState } from "react"
import { Button, Flex } from "@chakra-ui/react"
import InputGroup from "component/InputGroup"
import { createMessage, Message } from "component/Message"
import { getLastN } from "misc/util"
import ChatModel from "model/ChatModel"
import { getOrCreateChat } from "api/chatApi"
import { UserContext } from "context/userContext"
import MessageModel from "model/MessageModel"
import { ModeContext, ModeContextI } from "context/modeContext"
import { useCreateMessage } from "service/messageService"
import { useChatPdfPrediction, useDatastepPrediction } from "service/predictionService"
import { useQuery as useParamsQuery } from "misc/util"

function Chat() {
    const messageWindowRef = useRef<HTMLDivElement | null>(null)
    const chatRef = useRef<HTMLDivElement | null>(null)
    const [query, setQuery] = useState("")
    const user = useContext(UserContext)
    const { mode } = useContext<ModeContextI>(ModeContext)
    const { shownMessageCount, setShownMessageCount } = useContext<ModeContextI>(ModeContext)
    const queryParams = useParamsQuery()

    const { data: chat, status } = useQuery<ChatModel>("chat", () => {
        return getOrCreateChat(user.id)
    })

    const messageCreateMutation = useCreateMessage()
    const datastepPrediction = useDatastepPrediction()
    const chatPdfPrediction = useChatPdfPrediction()

    useEffect(() => {
        window.scroll({ top: chatRef.current?.offsetHeight, behavior: "smooth" })
    }, [chat?.message?.length])

    const handleSubmit = async () => {
        if (query !== "" && chat) {
            const { id: queryMessage } = await messageCreateMutation.mutateAsync({ chat_id: chat.id, query } as MessageModel)
            const version = queryParams.get("v") ?? "v1"

            let prediction
            if (mode === "datastep") {
                prediction = await datastepPrediction.mutateAsync({ body: { query }, version })
            } else {
                prediction = await chatPdfPrediction.mutateAsync({ query })
            }

            const { answer, sql, table } = prediction

            messageCreateMutation.mutate({
                chat_id: chat.id,
                answer: answer,
                sql: sql,
                table: table,
                connected_message_id: queryMessage
            } as MessageModel)
            setQuery("")
        }
    }

    const handleShowMore = () => {
        setShownMessageCount(lastN => lastN + 10)
    }

    const isLoading = datastepPrediction.isLoading
        || chatPdfPrediction.isLoading
        || messageCreateMutation.isLoading
        || status === "loading"

    return (
        <Flex direction="column" p="10" h="full" gap={10} ref={chatRef}>
            {chat && !!chat.message?.length && chat.message.length > shownMessageCount
                && <Button colorScheme="blue" variant="link" onClick={handleShowMore}>Предыдущие сообщения</Button>}
            <Flex direction="column" gap="5" flexGrow="1" ref={messageWindowRef}>
                {chat && !!chat.message?.length && getLastN(shownMessageCount, chat.message.map((message) => createMessage(message)))}
            </Flex>
            {chat && !chat.message?.length &&
                <Message direction='incoming' messageId={-1} src={"/image/avatar/bot.png"} callback={false}>
                    Какой у вас запрос?
                </Message>}
            <InputGroup
                disabled={isLoading}
                value={query}
                setValue={setQuery}
                handleSubmit={handleSubmit}
            />
        </Flex>
    )
}

export default Chat