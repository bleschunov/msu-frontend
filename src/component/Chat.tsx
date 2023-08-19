import {useMutation, useQuery, useQueryClient} from 'react-query';
import {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import {getPrediction} from "../api/client";
import {Button, Flex} from "@chakra-ui/react";
import InputGroup from "./InputGroup";
import {getLastN} from "../misc/util";
import ChatModel from "../model/ChatModel";
import {createMessage} from "./Message";
import {createMessage as createMessageApi} from "../api/messageApi"
import {getOrCreateChat} from "../api/chatApi";
import {UserContext} from "../context/userContext";


function Chat() {
    const [lastN, setLastN] = useState<number>(20)
    const messageWindowRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState("")
    const queryClient = useQueryClient()
    const chatRef = useRef<HTMLDivElement>(null)
    const user = useContext(UserContext)

    const {data: chat, status} = useQuery<ChatModel>("chat", () => {
        return getOrCreateChat(user.id)
    })

    const messageCreateMutation = useMutation(createMessageApi, {
        onSuccess: () => {
            queryClient.invalidateQueries("chat")
        }
    })

    const predictionMutation = useMutation(getPrediction, {
        onSuccess: ({data: {answer, sql, table}}, {chat_id}) => {
            messageCreateMutation.mutate({
                chat_id,
                answer,
                sql,
                table
            })
        },
        onError: ({response: {data}}, {chat_id}) => {
            const exception = typeof data.detail === "object"
                ? JSON.stringify(data.detail)
                : data.detail
            const message = "Произошла ошибка"

            messageCreateMutation.mutate({
                chat_id,
                exception,
                answer: message
            })
        }
    })

    useEffect(() => {
        window.scroll({ top: chatRef.current?.offsetHeight, behavior: 'smooth' });
    }, [chat])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    }

    const handleSubmit = () => {
        if (query !== "" && chat) {
            messageCreateMutation.mutate({chat_id: chat.id, query})
            predictionMutation.mutate({query, chat_id: chat.id})
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
            {chat && chat.message?.length > lastN
                && <Button colorScheme="blue" onClick={handleShowMore}>Предыдущие сообщения</Button>}
            <Flex direction="column" gap="5" flexGrow="1" ref={messageWindowRef}>
                {chat && getLastN(lastN, chat.message.map((message) => createMessage(message)))}
            </Flex>
            <InputGroup
                disabled={isLoading}
                value={query}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </Flex>
    )
}

export default Chat