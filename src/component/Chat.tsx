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
import SkeletonMessage from "component/SkeletonMessage"

function Chat() {
    const messageWindowRef = useRef<HTMLDivElement | null>(null)
    const chatRef = useRef<HTMLDivElement | null>(null)
    const [query, setQuery] = useState("")
    const user = useContext(UserContext)
    const { shownMessageCount, setShownMessageCount } = useContext<ModeContextI>(ModeContext)

    const { data: chat, status: chatQueryStatus } = useQuery<ChatModel>("chat", () => {
        return getOrCreateChat(user.id)
    })

    const messageCreateMutation = useCreateMessage()
    const predictionMutation = usePrediction()

    useEffect(() => {
        window.scroll({ top: chatRef.current?.offsetHeight, behavior: "smooth" })
    }, [chat?.message?.length])

    const handleSubmit = async () => {
        if (query.trim() !== "" && chat) {
            setQuery("")
            const { id: queryMessage } = await messageCreateMutation.mutateAsync({ chat_id: chat.id, query } as MessageModel)
            const { answer, sql, table } = await predictionMutation.mutateAsync({ query })
            messageCreateMutation.mutate({
                chat_id: chat.id,
                answer: answer,
                sql: sql,
                table: table,
                connected_message_id: queryMessage
            } as MessageModel)
        }
    }

    const handleShowMore = () => {
        setShownMessageCount(lastN => lastN + 10)
    }

    const isLoading = predictionMutation.isLoading
        || messageCreateMutation.isLoading
        || chatQueryStatus === "loading"

    return (
        <Flex direction="column" p="10" h="full" gap={10} ref={chatRef}>
            {chat && !!chat.message?.length && chat.message.length > shownMessageCount
                && <Button colorScheme="blue" variant="link" onClick={handleShowMore}>Предыдущие сообщения</Button>}
            {chatQueryStatus !== "loading" ?
                <Flex direction="column" gap="5" flexGrow="1" ref={messageWindowRef}>
                    {chat && !!chat.message?.length && getLastN(shownMessageCount, chat.message.map((message, i) => createMessage(message, i)))}
                </Flex> :
                <Flex direction="column" gap="5" flexGrow="1" ref={messageWindowRef}>
                    <SkeletonMessage direction="outgoing" width="35%" height="60px" />
                    <SkeletonMessage direction="incoming" width="65%" height="95px" />
                    <SkeletonMessage direction="outgoing" width="30%" height="55px" />
                    <SkeletonMessage direction="incoming" width="68%" height="75px" />
                    <SkeletonMessage direction="outgoing" width="45%" height="65px" />
                    <SkeletonMessage direction="incoming" width="63%" height="105px" />
                </Flex>
            }
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