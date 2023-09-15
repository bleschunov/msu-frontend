import React, { ChangeEvent } from "react"
import { Box, Button, Text, Textarea } from "@chakra-ui/react"
import { getPrompt } from "api/promptApi"
import { usePrompt } from "service/promptService"
import queryClient from "api/queryClient"
import PromptModel from "model/PromptModel"
import { useQuery } from "react-query"

const updatePrompt = (promptModel: PromptModel, newPrompt: string) => {
    promptModel.prompt = newPrompt
    return promptModel
}

const EditPromptForm = () => {
    const { data: prompt, status: queryPromptStatus } = useQuery("prompt", getPrompt)
    const promptService = usePrompt()

    const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (prompt?.prompt) {
            queryClient.setQueryData("prompt", updatePrompt(prompt, event.target.value))
        }
    }

    const handleButtonClick = () => {
        if (prompt?.prompt) {
            promptService.mutate({ prompt: prompt.prompt })
        }
    }

    const isLoading = promptService.isLoading || queryPromptStatus === "loading"
    const isError = promptService.isError || queryPromptStatus === "error"

    return (
        <Box p="10">
            <Textarea defaultValue={prompt?.prompt} onChange={handleTextareaChange} isDisabled={isLoading} rows={20} />
            <Button mt="5" onClick={handleButtonClick} isLoading={isLoading} loadingText="Подождите...">Сохранить</Button>
            {isError && <Text color="red">Произошла ошибка</Text>}
        </Box>
    )
}

export default EditPromptForm