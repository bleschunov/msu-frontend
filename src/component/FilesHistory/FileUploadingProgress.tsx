import React, { FC, useEffect, useState } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { Box, HStack, Progress, Spinner, Text } from "@chakra-ui/react"
import queryClient from "api/queryClient"
import { useMutation } from "react-query"
import { interruptTaskById } from "api/taskApi"
import { CloseIcon } from "@chakra-ui/icons"
import { IFileUploadingProgress } from "component/FilesHistory/types"

export const FileUploadingProgress: FC<IFileUploadingProgress> = ({ task }) => {
    const [progress, setProgress] = useState<number>(0)

    const { lastMessage, readyState } = useWebSocket(`ws://localhost:8080/task/ws/${task.id}`)

    const interruptTaskMutation = useMutation("interruptTask", interruptTaskById)

    useEffect(() => {
        if (lastMessage !== null) {
            const task = JSON.parse(lastMessage.data)
            const newProgress = Math.round(task.progress / task.full_work * 100)
            setProgress(newProgress)
        }
    }, [lastMessage, setProgress])

    useEffect(() => {
        if (readyState === ReadyState.CLOSED) {
            queryClient.invalidateQueries("activeFileUploadTasks")
            queryClient.invalidateQueries("filesList")
        }
    }, [readyState])

    const handleInterrupt = () => {
        interruptTaskMutation.mutate(task.id)
        queryClient.invalidateQueries("activeFileUploadTasks")
    }

    return (
        <Box>
            <Text>{progress}%</Text>
            <HStack gap={5}>
                {readyState === ReadyState.OPEN && <Box flexGrow={1}><Progress hasStripe value={progress} /></Box>}
                {interruptTaskMutation.isLoading
                    ? <Spinner />
                    : <CloseIcon cursor="pointer" onClick={handleInterrupt}>Interrupt</CloseIcon>
                }
            </HStack>
        </Box>
    )

}