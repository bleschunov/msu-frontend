import { Button, Flex } from "@chakra-ui/react"
import { getOrCreateChat } from "api/chatApi"
import FilesUpload from "component/FilesUpload"
import InputGroup from "component/InputGroup"
import { Message, createMessage } from "component/Message"
import { ModeContext, ModeContextI, ModeT } from "context/modeContext"
import { UserContext } from "context/userContext"
import { getLastN } from "misc/util"
import ChatModel from "model/ChatModel"
import MessageModel from "model/MessageModel"
import { useContext, useEffect, useRef, useState } from "react"
import { useQuery } from "react-query"
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

    const { mode, setMode } = useContext<ModeContextI>(ModeContext)
    
    const handleSwitchMode = () => {
        setMode((mode: ModeT) => mode === "datastep" ? "pdf" : "datastep")
    }

    return (
        <Flex
            ref={chatRef}
            direction="column"
            p="10"
            h="full"
            gap={10}
        >
            {chat && !!chat.message?.length && chat.message.length > shownMessageCount
                && <Button colorScheme="blue" variant="link" onClick={handleShowMore}>Предыдущие сообщения</Button>}
            <Flex
                id="sdfsd"
                ref={messageWindowRef}
                direction="column"
                gap="5"
                flexGrow="1"
            >
                {chat && !!chat.message?.length && getLastN(shownMessageCount, chat.message.map((message) => createMessage(message)))}
            </Flex>

            <FilesUpload disabled={mode === "pdf"} handleSwitchMode={handleSwitchMode} />

            {chat && !chat.message?.length &&
                <Message
                    direction='incoming'
                    messageId={-1}
                    src={"/image/avatar/bot.png"}
                    callback={false}
                >
                    Какой у вас запрос?
                </Message>}

            <InputGroup
                disabled={isLoading}
                value={query}
                setValue={setQuery}
                handleSubmit={handleSubmit}
                handleSwitchMode={handleSwitchMode}
            />
        </Flex>
    )
}

export default Chat