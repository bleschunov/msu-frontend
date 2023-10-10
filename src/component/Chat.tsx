import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react"
import { getOrCreateChat } from "api/chatApi"
import queryClient from "api/queryClient"
import { getAllSources, getLastSource } from "api/sourceApi"
import InputGroup from "component/InputGroup/InputGroup"
import { Message, createMessage } from "component/Message/Message"
import SkeletonMessage from "component/Message/SkeletonMessage"
import SourcesList from "component/SourcesList"
import { ModeContext, ModeContextI } from "context/modeContext"
import { UserContext } from "context/userContext"
import { getLastN } from "misc/util"
import ChatModel from "model/ChatModel"
import SourceModel from "model/SourceModel"
import { useContext, useEffect, useRef, useState } from "react"
import { useQuery } from "react-query"
import { useCreateMessage } from "service/messageService"
import { usePrediction } from "service/predictionService"
import { useSource } from "service/sourceService"
import { UserModel } from "model/UserModel"
import InputGroupContext from './InputGroup/context'
import FileModel from '../model/FileModel'
import { getAllFiles } from '../api/fileApi'
import QueryModel from '../model/QueryModel'

function Chat() {
    const messageWindowRef = useRef<HTMLDivElement | null>(null)
    const chatRef = useRef<HTMLDivElement | null>(null)
    const [table, setTable] = useState<string>("платежи")
    const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1)
    const user = useContext<UserModel>(UserContext)
    const [similarQueries, setSimilarQueries] = useState<string[]>([])
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

    const { data: filesList } = useQuery<FileModel[]>("files_list", getAllFiles)

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
            })

            const body: Omit<QueryModel, "chat_id"> = {
                query: finalQuery
            }

            if (isFilesMode && filesList) {
                body["filename"] = filesList[currentFileIndex].name_en
            } else {
                body["tables"] = [table]
            }

            const { answer, sql, table: markdownTable, similar_queries: similarQueries }
                = await predictionMutation.mutateAsync(body)

            setSimilarQueries(similarQueries)

            await messageCreateMutation.mutateAsync({
                chat_id: chat.id,
                answer: answer,
                sql: sql,
                table: markdownTable,
                connected_message_id: queryMessageId,
            })

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
            justifyContent="flex-end"
            pt="100"
            pb="10"
            h="full"
            gap={10}
        >
            {isFilesEnabled && filesList && (
                <SourcesList
                    filesList={filesList}
                    currentFileIndex={currentFileIndex}
                    setCurrentFileIndex={setCurrentFileIndex}
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

            <InputGroupContext.Provider value={{ handleSubmit, similarQueries }}>
                <InputGroup
                    setTable={setTable}
                    isLoading={isLoading}
                    onUploadFiles={onUploadFiles}
                    multipleFilesEnabled={false}
                    isSourcesExist={isSourcesExist}
                    isUploadingFile={isUploadingFile}
                    errorMessage={errorMessage}
                    openSourcesHistory={openSourcesHistory}
                />
            </InputGroupContext.Provider>

            {isFilesEnabled && (
                isFilesMode ? filesList && currentFileIndex >= 0 ? (
                    <Text color="black">{filesList[currentFileIndex].name_ru}</Text>
                ) : (
                    <Text color="gray" fontStyle="italic">Загрузите файл</Text>
                ) : filesList && currentFileIndex >= 0 && (
                    <Text color="gray">{filesList[currentFileIndex].name_ru}</Text>
                )
            )}
        </Flex>
    )
}

export default Chat
