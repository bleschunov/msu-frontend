import { Avatar, Button, Flex, HStack, Menu, MenuButton, MenuGroup, MenuItem, MenuList, useToast } from "@chakra-ui/react"
import { User } from "@supabase/supabase-js"
import { getOrCreateChat } from "api/chatApi"
import { getUser, signOut } from "api/supabase"
import Logo from "component/Logo"
import { UserContext } from "context/userContext"
import ChatModel from "model/ChatModel"
import React, { useContext, useEffect, useState } from "react"
import { AiOutlineDown } from "react-icons/ai"
import { useQuery, useQueryClient } from "react-query"
import { useClearMessage } from "service/messageService"

const Header = () => {
    const queryClient = useQueryClient()
    const user = useContext(UserContext)

    const handleSignOut = () => {
        signOut()
        queryClient.clear()
    }

    const toast = useToast()
    const toastIdRef = React.useRef<string | number | undefined>()
    const [seconds, setSeconds] = useState<number>(0)
    const [isTimerActive, setTimerActive] = useState(false)

    function addSuccefullToast() {
        toastIdRef.current = toast({
            title: "Чат успешно очищен",
            description: "Все сообщения из чата удалены",
            status: "success",
            position: "bottom-right",
            isClosable: true
        })
    }

    useEffect(() => {
        if (!seconds) {
            if (isTimerActive) {
                addSuccefullToast()
                setTimerActive(false)
            }
            return
        }

        const intervalId = setInterval(() => {
            setSeconds(seconds - 1)
        }, 1000)

        return () => clearInterval(intervalId)
    }, [seconds, addSuccefullToast])

    function addWarningToast() {
        toastIdRef.current = toast({ 
            title: "Очистка чата",
            description:
            <Flex direction="column">
                Вы решили удалить все сообщения из чата
                <Button 
                    onClick={() => {
                        setSeconds(0)
                        setTimerActive(false)
                        toast.close(toastIdRef.current!)
                    }}
                    alignSelf="flex-end"
                    style={{
                        marginLeft: 150
                    }}
                    type="button" 
                    variant="link"
                    colorScheme="black"
                >
                    Отменить
                </Button>
            </Flex>,
            status: "warning",
            position: "bottom-right",
            isClosable: false,
            duration: 5000, })
    }

    const clearMessagesMutation = useClearMessage()
    const { data: chat } = useQuery<ChatModel>("chat", () => {
        return getOrCreateChat(user.id)
    })

    const handleClear = async () => {
        if (chat) {
            clearMessagesMutation.mutate({
                id: chat.id,
                user_id: chat.user_id,
            } as ChatModel)
        }
    }


    return (
        <HStack bg="gray.100" h="100px" flexShrink="0" justify="space-between" px="10" py="5" position="sticky" w="100%">
            <Logo />
            <HStack>
                <Button 
                    variant="outline" 
                    colorScheme="blue"
                    onClick={() => {
                        addWarningToast()
                        setTimerActive(true)
                        setSeconds(5)
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