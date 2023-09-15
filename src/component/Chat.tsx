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
import { usePrediction } from "service/predictionService"

function Chat() {
    const messageWindowRef = useRef<HTMLDivElement | null>(null)
    const chatRef = useRef<HTMLDivElement | null>(null)
    const [query, setQuery] = useState("")
    const user = useContext(UserContext)
    const { shownMessageCount, setShownMessageCount } = useContext<ModeContextI>(ModeContext)

    const { data: chat, status } = useQuery<ChatModel>("chat", () => {
        return getOrCreateChat(user.id)
    })

    const messageCreateMutation = useCreateMessage()
    const predictionMutation = usePrediction()

    useEffect(() => {
        window.scroll({ top: chatRef.current?.offsetHeight, behavior: "smooth" })
    }, [chat?.message?.length])

    const handleSubmit = async () => {
        if (query !== "" && chat) {
            const { id: queryMessage } = await messageCreateMutation.mutateAsync({ chat_id: chat.id, query } as MessageModel)
            const { answer, sql, table } = await predictionMutation.mutateAsync({ query })
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

    const isLoading = predictionMutation.isLoading
        || messageCreateMutation.isLoading
        || status === "loading"

    return (
        <Flex direction="column" p="10" h="full" gap={10} ref={chatRef}>
            {chat && !!chat.message?.length && chat.message.length > shownMessageCount
                && <Button colorScheme="blue" variant="link" onClick={handleShowMore}>Предыдущие сообщения</Button>}
            <Flex direction="column" gap="5" flexGrow="1" ref={messageWindowRef}>
                {chat && !!chat.message?.length && getLastN(shownMessageCount, chat.message.map((message, i) => createMessage(message, i)))}
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