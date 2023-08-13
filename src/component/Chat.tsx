import {useMutation, useQuery, useQueryClient} from 'react-query';
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {getOrCreateChat, getPrediction, insertMessage} from "../api/client";
import {Button, Flex} from "@chakra-ui/react";
import InputGroup from "./InputGroup";
import {getUser} from "../api/supabase";
import {createMessage} from "./Message";
import {getLastN} from "../misc/util";


function Chat() {
    const [lastN, setLastN] = useState<number>(20)
    const messageWindowRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState("")
    const queryClient = useQueryClient()
    const chatRef = useRef<HTMLDivElement>(null)

    const {data: user} = useQuery("user", () => getUser())
    const {data: chat, status} = useQuery("chat", async () => {
        if (!user) {
            return Promise.reject()
        }

        return getOrCreateChat(user.id)
    }, {
        enabled: !!user
    })

    const messageCreateMutation = useMutation(insertMessage, {
        onSuccess: () => {
            queryClient.invalidateQueries("chat")
        }
    })

    const predictionMutation = useMutation(getPrediction, {
        onSuccess: ({data: {answer, sql, table}}, {chat_id}) => {
            messageCreateMutation.mutate({
                chat_id: chat_id,
                answer,
                sql,
                table
            })
        },
        onError: ({response: {data}}) => {
            const exception = typeof data.detail === "object"
                ? JSON.stringify(data.detail)
                : data.detail
            const message = "Произошла ошибка"

            messageCreateMutation.mutate({
                // @ts-ignore
                chat_id: chat.id,
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
            // @ts-ignore
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
            {chat && chat.message.length > lastN
                && <Button colorScheme="blue" onClick={handleShowMore}>Показать больше</Button>}
            <Flex direction="column" gap="5" flexGrow="1" ref={messageWindowRef}>
                {chat && getLastN(lastN, chat.message.map((message: any) => createMessage(message)))}
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