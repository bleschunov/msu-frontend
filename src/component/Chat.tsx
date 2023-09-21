import { Button, Flex, Text } from "@chakra-ui/react"
import { getOrCreateChat } from "api/chatApi"
import { getLastSource } from "api/sourceApi"
import InputGroup from "component/InputGroup"
import { Message, createMessage } from "component/Message"
import SkeletonMessage from "component/SkeletonMessage"
import { ModeContext, ModeContextI } from "context/modeContext"
import { UserContext } from "context/userContext"
import { getLastN } from "misc/util"
import ChatModel from "model/ChatModel"
import MessageModel from "model/MessageModel"
import SourceModel from "model/SourceModel"
import { useContext, useEffect, useRef, useState } from "react"
import { useQuery } from "react-query"
import { useCreateMessage } from "service/messageService"
import { usePrediction } from "service/predictionService"
import { useSource } from "service/sourceService"

function Chat() {
    const messageWindowRef = useRef<HTMLDivElement | null>(null)
    const chatRef = useRef<HTMLDivElement | null>(null)
    const [query, setQuery] = useState("")
    const user = useContext(UserContext)
    const { shownMessageCount, setShownMessageCount } = useContext<ModeContextI>(ModeContext)
    const { mode, setMode, isFilesEnabled } = useContext<ModeContextI>(ModeContext)
    
    const messageCreateMutation = useCreateMessage()
    const predictionMutation = usePrediction()
    const sourceMutation = useSource()
    
    const isFilesMode = mode === "pdf"

    const { data: chat, status: chatQueryStatus } = useQuery<ChatModel>("chat", () => {
        return getOrCreateChat(user.id)
    })

    const { data: currentSource, status: currentSourceQueryStatus } = useQuery<SourceModel>(
        "currentSource",
        () => { return getLastSource(chat!.id) },
        { enabled: !!chat?.id }
    )
    const isSourcesExist = Boolean(currentSource)

    const isLoading = predictionMutation.isLoading
        || messageCreateMutation.isLoading
        // TODO start: move checking queries loading status to func
        || chatQueryStatus === "loading"
        || currentSourceQueryStatus === "loading"
        // TODO end

    const isUploadingFile = sourceMutation.isLoading

    useEffect(() => {
        window.scroll({
            top: chatRef.current?.offsetHeight,
            behavior: "smooth",
        })
    }, [chat?.message?.length])

    const handleSubmit = async () => {
        if (query.trim() !== "" && chat) {
            setQuery("")
            const { id: queryMessageId } = await messageCreateMutation.mutateAsync({
                query,
                chat_id: chat.id
            } as MessageModel)
            const { answer, sql, table } = await predictionMutation.mutateAsync({
                query,
                source_id: currentSource?.source_id
            })
            messageCreateMutation.mutate({
                chat_id: chat.id,
                answer: answer,
                sql: sql,
                table: table,
                connected_message_id: queryMessageId,
            } as MessageModel)
        }
    }

    const handleShowMore = () => {
        setShownMessageCount((lastN) => lastN + 10)
    }
    
    const onUploadFiles = (files: FileList) => {
        const file = files.item(0)
        setMode("pdf")
        sourceMutation.mutateAsync({
            chat_id: chat!.id,
            file: file!
        })
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
                isUploadingFile={isUploadingFile}
                value={query}
                setValue={setQuery}
                handleSubmit={handleSubmit}
                onUploadFiles={onUploadFiles}
                multipleFilesEnabled={false}
                isSourcesExist={isSourcesExist}
            />

            {isFilesEnabled && (
                isFilesMode ? isSourcesExist ? (
                    <Text color="black">{currentSource?.file_name}</Text>
                ) : (
                    <Text color="gray" fontStyle="italic">Загрузите файл</Text>
                ) : isSourcesExist && (
                    <Text color="gray">{currentSource?.file_name}</Text>
                )
            )}
        </Flex>
    )
}

export default Chat
