import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react"
import { getOrCreateChat } from "api/chatApi"
import queryClient from "api/queryClient"
import { getAllSources, getLastSource } from "api/sourceApi"
import InputGroup from "component/InputGroup"
import { Message, createMessage } from "component/Message"
import SkeletonMessage from "component/SkeletonMessage"
import SourcesList from "component/SourcesList"
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
    const [table, setTable] = useState<string>("платежи")
    const user = useContext(UserContext)
    const {
        mode,
        setMode,
        isFilesEnabled,
        shownMessageCount,
        setShownMessageCount
    } = useContext<ModeContextI>(ModeContext)
    const {
        isOpen: isSourcesHistoryOpen,
        onOpen: openSourcesHistory,
        onClose: closeSourcesHistory
    } = useDisclosure()
    
    const messageCreateMutation = useCreateMessage()
    const predictionMutation = usePrediction()
    const sourceMutation = useSource()
    
    const isFilesMode = mode === "pdf"

    const { data: chat, status: chatQueryStatus } = useQuery<ChatModel>("chat", () => {
        return getOrCreateChat(user.id)
    })

    const { data: sourcesList, status: sourcesListQueryStatus } = useQuery<SourceModel[]>(
        "sourcesList",
        () => getAllSources(chat!.id),
        { enabled: !!chat?.id }
    )

    const { data: currentSource, status: currentSourceQueryStatus } = useQuery<SourceModel>(
        "currentSource",
        () => getLastSource(chat!.id),
        { enabled: !!chat?.id }
    )
    const isSourcesExist = Boolean(currentSource)

    const isLoading = predictionMutation.isLoading
        || messageCreateMutation.isLoading
        // TODO start: move checking queries loading status to func
        || chatQueryStatus === "loading"
        || sourcesListQueryStatus === "loading"
        || currentSourceQueryStatus === "loading"
        // TODO end

    const errorMessage = predictionMutation.isError ? "Произошла ошибка. Попробуйте ещё раз" : undefined

    const isUploadingFile = sourceMutation.isLoading

    useEffect(() => {
        window.scroll({
            top: chatRef.current?.offsetHeight,
            behavior: "smooth",
        })
    }, [chat?.message?.length])

    const handleSubmit = async (finalQuery: string) => {
        if (chat && finalQuery.trim() !== "") {
            const { id: queryMessageId } = await messageCreateMutation.mutateAsync({
                query: finalQuery,
                chat_id: chat.id
            } as MessageModel)
            const { answer, sql, table: markdownTable } = await predictionMutation.mutateAsync({
                query: finalQuery,
                source_id: currentSource?.source_id,
                tables: [table]
            })
            await messageCreateMutation.mutateAsync({
                chat_id: chat.id,
                answer: answer,
                sql: sql,
                table: markdownTable,
                connected_message_id: queryMessageId,
            } as MessageModel)

            queryClient.invalidateQueries("chat")
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
            position="relative"
            direction="column"
            p="10"
            pt="100"
            h="full"
            gap={10}
        >
            {isFilesEnabled && (
                <SourcesList
                    sourceList={sourcesList}
                    currentSource={currentSource}
                    isOpen={isSourcesHistoryOpen}
                    onClose={closeSourcesHistory}
                />
            )}

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
                table={table}
                setTable={setTable}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                onUploadFiles={onUploadFiles}
                multipleFilesEnabled={false}
                isSourcesExist={isSourcesExist}
                isUploadingFile={isUploadingFile}
                errorMessage={errorMessage}
                openSourcesHistory={openSourcesHistory}
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
