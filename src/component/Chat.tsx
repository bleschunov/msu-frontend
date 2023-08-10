import {useMutation, useQuery, useQueryClient} from 'react-query';
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {getPrediction, resetContext} from "../api/client";
import {createMessage} from "./Message";
import {Flex} from "@chakra-ui/react";
import InputGroup from "./InputGroup";
import {getMessagesByChatId, getOrCreateChat, getUser, insertMessage} from "../api/supabase";
import Callback from "./Callback";

function Chat() {
    const [clean, setClean] = useState<boolean>(true)
    const messageWindowRef = useRef<HTMLDivElement>(null);
    // const inputRef = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState("")
    const queryClient = useQueryClient()

    const chat = useQuery("chat", async () => {
        const user = await getUser()
        // @ts-ignore
        const id = user.id

        const chat = await getOrCreateChat(id)
        // @ts-ignore
        return chat.data[0]
    })
    const messages = useQuery(
        "messages",
        async () => await getMessagesByChatId(chat.data.id),
        {
            enabled: !!chat.data?.id,
        }
    )

    useEffect(() => {
        if (messageWindowRef) {
            messageWindowRef.current?.addEventListener('DOMNodeInserted', event => {
                const target = event.currentTarget as HTMLDivElement
                window.scroll({ top: target.scrollHeight, behavior: 'smooth' });
            });
        }
    }, [])

    const messageMutation = useMutation(insertMessage, {
        onSuccess: async (response) => {
            await queryClient.invalidateQueries("messages")
            setQuery("")
        }
    })

    const predictionMutation = useMutation(getPrediction, {
        onSuccess: async (response) => {
            messageMutation.mutate({chat_id: chat.data.id, answer: response.data.answer})
            await queryClient.invalidateQueries("messages")
        }
    })

    const contextResetMutation = useMutation(resetContext, {
        onSuccess: async () => {
            messageMutation.mutate({chat_id: chat.data.id, answer: "Контекст сброшен"})
            await queryClient.invalidateQueries("messages")
        },
        onError: async () => {
            messageMutation.mutate({chat_id: chat.data.id, answer: "Контекст не сброшен из–за ошибки"})
            await queryClient.invalidateQueries("messages")
        }
    })

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    }

    const handleSubmit = () => {
        if (query === "") {
            return;
        }
        messageMutation.mutate({chat_id: chat.data.id, query})
        predictionMutation.mutate({query})
        setClean(false)
        // inputRef.current?.focus()
    }

    const handleContextReset = () => {
        contextResetMutation.mutate()
        // inputRef.current?.focus()
    }

    const isLoading = predictionMutation.isLoading
        || contextResetMutation.isLoading
        || messageMutation.isLoading
        || messages.isLoading

    const newCallback = messages.data && <Callback messageId={messages.data[messages.data.length - 1].id} />

    return (
        <Flex direction="column" p="10" h="full" gap={10}>
            <Flex direction="column" gap="5" flexGrow="1" ref={messageWindowRef}>
                {messages.data?.map(messageModel => createMessage(messageModel))}
                {!clean && !isLoading && newCallback}
            </Flex>
            <InputGroup
                disabled={isLoading}
                value={query}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleContextReset={handleContextReset}
                // inputRef={inputRef}
            />
        </Flex>
    )
}

export default Chat