import { useEffect, useState } from "react"
import { HStack, Spinner, Text } from "@chakra-ui/react"

const LoadingMessage = () => {
    const [messageIndex, setMessageIndex] = useState<number>(0)
    const messages = [
        "Укладываем цементные байты...",
        "Строим виртуальные домики...",
        "Замешиваем пиксельный бетон...",
        "Кладём кирпичи из нулей и единиц...",
        "Натягиваем цифровые шнуры...",
        "Собираем пиксельные блоки...",
        "Вкручиваем виртуальные гайки...",
        "Размешиваем пиксельную краску...",
        "Кладем цифровой фундамент...",
        "Заводим строительных роботов...",
        "Выравниваем цифровой грунт...",
        "Строим дома из кода...",
        "Закручиваем виртуальные винты...",
        "Формуем пиксельный ландшафт...",
        "Плетем алгоритмические опоры...",
        "Лепим домики из данных...",
        "Крепим виртуальные арматуры...",
        "Выращиваем цифровые деревья...",
        "Мастерим кодовые каркасы...",
        "Возводим пиксельные стены..."
    ]

    useEffect(() =>{
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => {
                if (prevIndex + 1 === messages.length) {
                    return 0
                }

                return prevIndex + 1
            })
        }, 5000)
        return () => clearInterval(interval)
    }, [messages.length])

    return (
        <HStack>
            <Spinner />
            <Text>{messages[messageIndex]}</Text>
        </HStack>

    )
}

export default LoadingMessage
