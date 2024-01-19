import {
    Avatar,
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Menu,
    MenuButton,
    MenuGroup,
    MenuItem,
    MenuList,
    Switch,
    UseToastOptions,
    useDisclosure,
    useToast,
} from "@chakra-ui/react"
import { getFavoriteMessages } from "api/messageApi"
import { AdminModal } from "component/AdminModal"
import Logo from "component/Logo"
import { FavoriteMessageContext, IFavoriteMessageContext } from "context/favoriteMessageContext"
import { ModeContext, ModeContextI } from "context/modeContext"
import { UserContext } from "context/userContext"
import ChatModel from "model/ChatModel"
import { FavoriteMessageModel } from "model/MessageModel"
import React, { useContext, useEffect, useState } from "react"
import { AiOutlineDown } from "react-icons/ai"
import { useQuery, useQueryClient } from "react-query"
import { useClearMessages } from "service/messageService"
import { FavoriteMessage } from "component/FavoriteMessage"
import { signOut } from '../api/authApi'

const Header = () => {
    const queryClient = useQueryClient()
    const user = useContext(UserContext)
    const { currentMode, setMode, isFilesEnabled, isDatabaseEnabled, chatID } = useContext<ModeContextI>(ModeContext)
    const clearMessagesMutation = useClearMessages()
    const adminModalFunctions = useDisclosure()
    const { isFavoriteListEnabled } = useContext<IFavoriteMessageContext>(FavoriteMessageContext)

    const toast = useToast()
    const toastIdRef = React.useRef<string | number | undefined>()
    const [isTimerActive, setTimerActive] = useState<boolean>(false)
    const [warningToastCountdown, setWarningToastCountdown] = useState<number>(5)

    const { data: favoritesList } = useQuery<FavoriteMessageModel[]>("favoritesList", () => {
        return getFavoriteMessages(user.id)
    })

    const wikiFavoriteList = favoritesList?.filter((query) => query.mode === "wiki")

    const databasesFavoriteList = favoritesList?.filter((query) => query.mode === "databases")

    const handleSignOut = () => {
        signOut()
        queryClient.clear()
    }

    const handleSwitchMode = () => {
        setMode((prevMode) => prevMode === "databases" ? "wiki" : "databases")
    }

    const handleChatClear = () => {
        setTimerActive(true)
        decreaseCountdownInToast()
        const previousChat = queryClient.getQueryData<ChatModel>("chat")
        if (previousChat) {
            previousChat.messages = []
            queryClient.setQueriesData<ChatModel>("chat", previousChat)
        }
    }

    const handleCancel = () => {
        clearIntervalAndToast()
        queryClient.invalidateQueries("chat")
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
                    onClick={handleCancel}
                    alignSelf="flex-end"
                    style={{
                        marginLeft: 150
                    }}
                    type="button"
                    variant="link"
                    colorScheme="black"
                >
                    {warningToastCountdown} Отменить
                </Button>
            </Flex>
    }

    const showSuccefullToast = () => {
        toast({
            title: "Чат успешно очищен",
            description: "Все сообщения из чата удалены",
            status: "success",
            position: "bottom-right",
            isClosable: true
        })
    }

    const showWarningToast = () => {
        if (toastIdRef.current) {
            toast.update(toastIdRef.current, warningToastOptions)
        }
        else toastIdRef.current = toast(warningToastOptions)
    }

    const clearIntervalAndToast = () => {
        setTimerActive(false)
        toast.close(toastIdRef.current!)
        toastIdRef.current = undefined
        setWarningToastCountdown(5)
    }

    const decreaseCountdownInToast = () => {
        setWarningToastCountdown((countdown) => countdown - 1)
        showWarningToast()
    }

    useEffect(() => {
        if (isTimerActive)
            if (warningToastCountdown < 0) {
                clearIntervalAndToast()
                showSuccefullToast()
                clearMessagesMutation.mutate(chatID!)
            } else {
                const interval = setInterval(decreaseCountdownInToast, 1000)
                return () => clearInterval(interval)
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [warningToastCountdown, isTimerActive])

    return (
        <HStack bg="gray.100" h="48px" flexShrink="0" justify="space-between" px="165" py="10" position="fixed" w="100%" zIndex={100}>
            <Logo />
            <HStack>
                {isFavoriteListEnabled && (
                    <Menu>
                        <MenuButton as={Button} variant="ghost" w={230}>
                            Избранное ⭐️
                        </MenuButton>
                        <MenuList>
                            <MenuGroup title="Платежи">
                                {databasesFavoriteList?.map((item, index: number) => (
                                    <FavoriteMessage
                                        favoriteMessage={item}
                                        key={index}
                                    />
                                ))}
                            </MenuGroup>
                            <MenuGroup title="Файлы">
                                {wikiFavoriteList?.map((item, index: number) => (
                                    <FavoriteMessage
                                        favoriteMessage={item}
                                        key={index}
                                    />
                                ))}
                            </MenuGroup>
                        </MenuList>
                    </Menu>
                )}
                {isFilesEnabled && isDatabaseEnabled && (
                    <FormControl display='flex' alignItems='center'>
                        <FormLabel mb="0">
                            Базы данных
                        </FormLabel>
                        <Switch
                            isChecked={currentMode === "wiki"}
                            onChange={handleSwitchMode}
                        />
                        <FormLabel mb="0" ml="4">
                            Файлы
                        </FormLabel>
                    </FormControl>
                )}
                <Box>
                    <Button
                        variant="outline"
                        colorScheme="blue"
                        onClick={handleChatClear}
                    >
                        Очистить чат
                    </Button>
                </Box>
                <Menu>
                    <MenuButton as={Button} rightIcon={<AiOutlineDown />} variant="link">
                        <Avatar></Avatar>
                    </MenuButton>
                    <MenuList>
                        <MenuGroup title={user.username}>
                            {user.database_prediction_config && <MenuItem onClick={adminModalFunctions.onOpen}>Админка</MenuItem>}
                            <MenuItem onClick={handleSignOut}>Выйти</MenuItem>
                        </MenuGroup>
                    </MenuList>
                </Menu>

                { adminModalFunctions.isOpen &&
                    <AdminModal
                        adminModalFunctions={adminModalFunctions}
                        databasePredictionConfig={user.database_prediction_config}
                    />
                }
            </HStack>
        </HStack>
    )
}

export default Header
