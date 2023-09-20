import { Button, Flex, IconButton, Text, Tooltip } from "@chakra-ui/react"
import { getOrCreateChat } from "api/chatApi"
import InputGroup from "component/InputGroup"
import { Message, createMessage } from "component/Message"
import { ModeContext, ModeContextI } from "context/modeContext"
import { UserContext } from "context/userContext"
import { getLastN } from "misc/util"
import ChatModel from "model/ChatModel"
import MessageModel from "model/MessageModel"
import { useContext, useEffect, useRef, useState } from "react"
import { AiOutlineClose, AiOutlineQuestionCircle } from "react-icons/ai"
import { useQuery } from "react-query"
import { useCreateMessage } from "service/messageService"
import { usePrediction } from "service/predictionService"
import SkeletonMessage from "component/SkeletonMessage"

function Chat() {
    const messageWindowRef = useRef<HTMLDivElement | null>(null)
    const chatRef = useRef<HTMLDivElement | null>(null)
    const [query, setQuery] = useState("")
    const user = useContext(UserContext)
    const { shownMessageCount, setShownMessageCount } = useContext<ModeContextI>(ModeContext)
    const [files, setFiles] = useState<FileList | null>(null)

    const { data: chat, status: chatQueryStatus } = useQuery<ChatModel>("chat", () => {
        return getOrCreateChat(user.id)
    })

    const messageCreateMutation = useCreateMessage()
    const predictionMutation = usePrediction()

    useEffect(() => {
        window.scroll({
            top: chatRef.current?.offsetHeight,
            behavior: "smooth",
        })
    }, [chat?.message?.length])

    const handleSubmit = async () => {
        if (query.trim() !== "" && chat) {
            setQuery("")
            const { id: queryMessage } = await messageCreateMutation.mutateAsync({ chat_id: chat.id, query } as MessageModel)
            const { answer, sql, table } = await predictionMutation.mutateAsync({ query, file: files ? files.item(0) : null })

            messageCreateMutation.mutate({
                chat_id: chat.id,
                answer: answer,
                sql: sql,
                table: table,
                connected_message_id: queryMessage,
            } as MessageModel)
        }
    }

    const handleShowMore = () => {
        setShownMessageCount((lastN) => lastN + 10)
    }

    const isLoading = predictionMutation.isLoading
        || messageCreateMutation.isLoading
        || chatQueryStatus === "loading"

    const { setMode } = useContext<ModeContextI>(ModeContext)

    useEffect(() => {
        if (files !== null) {
            setMode("pdf")
        } else {
            setMode("datastep")
        }
    }, [files, setMode])

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

            {/* TODO: add drag&drop zone when dragging file into chat */}

            {files && (
                <Flex direction="column">
                    <Flex direction="row" alignItems="center" gap={2}>
                        <IconButton
                            variant="link"
                            minWidth="fit-content"
                            aria-label="удалить загруженный файл"
                            icon={<AiOutlineClose size={16} />}
                            onClick={() => setFiles(null)}
                        />
                        <Text>{files?.item(0)?.name}</Text>
                        <Tooltip label="Поиск будет происходить по загруженному файлу" placement="right">
                            {/* Add span because we use react-icons */}
                            <span>
                                <AiOutlineQuestionCircle size={18} />
                            </span>
                        </Tooltip>
                    </Flex>
                </Flex>
            )}

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
                isLoading={isLoading}
                value={query}
                setValue={setQuery}
                handleSubmit={handleSubmit}
                uploadFiles={setFiles}
                multipleFilesEnabled={false}
            />
        </Flex>
    )
}

export default Chat
