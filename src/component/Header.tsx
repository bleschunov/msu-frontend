import { Avatar, Button, Flex, HStack, Menu, MenuButton, MenuGroup, MenuItem, MenuList, useToast, ToastId } from "@chakra-ui/react"
import { signOut } from "api/supabase"
import Logo from "component/Logo"
import { UserContext } from "context/userContext"
import ChatModel from "model/ChatModel"
import React, { useContext, useState } from "react"
import { AiOutlineDown } from "react-icons/ai"
import { useQueryClient } from "react-query"
import { useClearMessage } from "service/messageService"
import { ModeContext } from 'context/modeContext'

const Header = () => {
    const queryClient = useQueryClient()
    const user = useContext(UserContext)
    const { setShownMessageCount } = useContext(ModeContext)

    const handleSignOut = () => {
        signOut()
        queryClient.clear()
    }

    const toast = useToast()
    const toastIdRef = React.useRef<ToastId>()

    const [timerId, setTimerId] = useState<number>()

    function addSuccefullToast() {
        toastIdRef.current = toast({
            title: "Чат успешно очищен",
            description: "Все сообщения из чата удалены",
            status: "success",
            position: "bottom-right",
            isClosable: true
        })
    }

    function addWarningToast() {
        const handleCancellation = () => {
            clearTimeout(timerId)
            setTimerId(undefined)
            queryClient.invalidateQueries("chat")
            if (toastIdRef.current) {
                toast.close(toastIdRef.current)
            }
        }

        toastIdRef.current = toast({
            title: "Очистка чата",
            description:
            <Flex direction="column">
                Вы решили удалить все сообщения из чата
                <Button 
                    onClick={handleCancellation}
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

    const handleClear = async () => {
        // Отправляет запрос на бек, чтобы очистить чат

        // Очищаю чат
        // await clearMessagesMutation.asyncMutate(...)
        // addSuccefullToast()
        // setShownMessageCount(5) Цифру 5 взять в константу, потому что она в компоненте чата фигурирует
    }

    const hideMessages = (chat: ChatModel): ChatModel => {
        chat.message = []
        return chat
    }

    const handleClearButtonClick = () => {
        const previousChat = queryClient.getQueryData<ChatModel>("chat")
        if (previousChat) {
            queryClient.setQueriesData<ChatModel>("chat", hideMessages(previousChat))
        }

        const timerId = window.setTimeout(handleClear, 5000)
        setTimerId(timerId)
        addWarningToast()
        handleClear()
    }


    return (
        <HStack bg="gray.100" h="100px" flexShrink="0" justify="space-between" px="10" py="5" position="sticky" w="100%">
            <Logo />
            <HStack>
                <Button 
                    variant="outline" 
                    colorScheme="blue"
                    onClick={handleClearButtonClick}
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