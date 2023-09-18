import { Avatar, Button, Flex, HStack, Menu, MenuButton, MenuGroup, MenuItem, MenuList, UseToastOptions, useToast } from "@chakra-ui/react"
import { signOut } from "api/supabase"
import Logo from "component/Logo"
import { UserContext } from "context/userContext"
import ChatModel from "model/ChatModel"
import React, { useContext, useEffect, useState } from "react"
import { AiOutlineDown } from "react-icons/ai"
import { useQueryClient } from "react-query"
import { useClearMessages } from "service/messageService"

const Header = () => {
    const queryClient = useQueryClient()
    const user = useContext(UserContext)
    const clearMessagesMutation = useClearMessages()

    const handleSignOut = () => {
        signOut()
        queryClient.clear()
    }

    const toast = useToast()
    const toastIdRef = React.useRef<string | number | undefined>()
    const [isTimerActive, setTimerActive] = useState(false)
    const [seconds, setSeconds] = useState<number>(5)

    const handleClear = async () => {  
        await queryClient.cancelQueries("message")
        const previousChat = queryClient.getQueryData<ChatModel>("chat")
        if (previousChat) {
            previousChat.message = []
            queryClient.setQueriesData<ChatModel>("chat", previousChat)
        }
    }

    const handleCancel = () => {
        queryClient.invalidateQueries("chat")
        toastIdRef.current = undefined
        setSeconds(5)
    }

    const warningToastOptions: UseToastOptions = { 
        title: "Очистка чата",
        status: "warning",
        position: "bottom-right",
        isClosable: false,
        duration: 8000,
        description:
            <Flex direction="column">
                Вы решили удалить все сообщения из чата
                <Button 
                    onClick={() => {
                        setTimerActive(false)
                        toast.close(toastIdRef.current!)
                        handleCancel()
                        
                    }}
                    alignSelf="flex-end"
                    style={{
                        marginLeft: 150
                    }}
                    type="button" 
                    variant="link"
                    colorScheme="black"
                >
                    {seconds} Отменить
                </Button>
            </Flex>
    }

    useEffect(() => {
        if (isTimerActive) {
            if (seconds < 0) {
                toast.close(toastIdRef.current!)
                showSuccefullToast()
                setTimerActive(false)
                toastIdRef.current = undefined
                setSeconds(5)
                const chat = queryClient.getQueryData<ChatModel>("chat")
                clearMessagesMutation.mutateAsync(chat!.id)
            }
            const intervalId = setInterval(() => {
                setSeconds(seconds - 1)
                showWarningToast()
            }, 1000)

            return () => clearInterval(intervalId) 
        }}, [seconds, showSuccefullToast, isTimerActive, showWarningToast, toast, queryClient])

    function showSuccefullToast() {
        toastIdRef.current = toast({
            title: "Чат успешно очищен",
            description: "Все сообщения из чата удалены",
            status: "success",
            position: "bottom-right",
            isClosable: true
        })
    }  

    function showWarningToast() {
        if (toastIdRef.current) {
            toast.update(toastIdRef.current, warningToastOptions)
        }
        else toastIdRef.current = toast(warningToastOptions)
    } 

    return (
        <HStack bg="gray.100" h="100px" flexShrink="0" justify="space-between" px="10" py="5" position="sticky" w="100%">
            <Logo />
            <HStack>
                <Button 
                    variant="outline" 
                    colorScheme="blue"
                    onClick={() => {
                        setTimerActive(true)
                        showWarningToast()
                        handleClear()
                    }}
                >
                    Очистить чат
                </Button>
                <Menu>
                    <MenuButton as={Button} rightIcon={<AiOutlineDown/>} variant="link">
                        <Avatar></Avatar>
                    </MenuButton>
                    <MenuList>
                        <MenuGroup title={user.email}>
                            <MenuItem onClick={handleSignOut}>Log out</MenuItem>
                        </MenuGroup>
                    </MenuList>
                </Menu>
            </HStack>
        </HStack>
    )
}

export default Header
