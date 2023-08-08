import {useMutation} from 'react-query';
import {ChangeEvent, useState} from "react";
import {getPrediction} from "../api/client";
import {Message} from "./Message";
import {Flex, HStack, Input} from "@chakra-ui/react";

function Chat() {
    const [query, setQuery] = useState("")
    const [messages, setMessages] = useState([
        <Message direction={"incoming"}>What do you want to know about?</Message>
    ])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    }

    const mutation = useMutation(getPrediction, {
        onSuccess: async (response) => {
            setMessages((messages) => [
                ...messages,
                <Message direction={"incoming"}>{response.data.answer}</Message>
            ])
        }
    })

    const handleSubmit = () => {
        setMessages((messages) => [
            ...messages,
            <Message direction={"outgoing"}>{query}</Message>
        ])
        setQuery("")
        mutation.mutate({query})
    }

    return (
        <Flex direction={"column"}>
            {messages}
            <HStack>
                <Input
                    value={query}
                    onChange={handleChange}
                    placeholder={"Print your query"}
                />
                <button onClick={handleSubmit}>Send</button>
            </HStack>
        </Flex>
    )
}

export default Chat