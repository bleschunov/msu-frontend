import React, { FC, useEffect, useState } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { Box, HStack, Progress, Spinner, Text } from "@chakra-ui/react"
import queryClient from "api/queryClient"
import { useMutation } from "react-query"
import { interruptTaskById } from "api/taskApi"
import { CloseIcon } from "@chakra-ui/icons"
import { IFileUploadingProgress } from "component/FilesHistory/types"
import { FileUploadTaskModel } from "model/FileUploadTaskModel"

export const FileUploadingProgress: FC<IFileUploadingProgress> = ({ task }) => {
    const [progress, setProgress] = useState<number>(0)

    const websocket_url = process.env["REACT_APP_WEBSOCKET"]
    const { lastMessage, readyState } = useWebSocket(`${websocket_url}/${task.id}`)

    const interruptTaskMutation = useMutation("interruptTask", interruptTaskById)

    useEffect(() => {
        if (lastMessage !== null) {
            const task: FileUploadTaskModel = JSON.parse(lastMessage.data)
            if (!task.progress || !task.full_work) {
                setProgress(0)
            } else {
                const newProgress = Math.round(task.progress! / task.full_work! * 100)
                setProgress(newProgress)
            }
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