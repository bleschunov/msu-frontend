import React, { ChangeEvent, useContext } from "react"
import { Box, Button, Text, Textarea } from "@chakra-ui/react"
import { getActivePrompt } from "api/promptApi"
import { usePrompt } from "service/promptService"
import queryClient from "api/queryClient"
import { PromptModel } from "model/PromptModel"
import { useQuery } from "react-query"
import { UserContext } from "context/userContext"

const updatePrompt = (promptModel: PromptModel, newPrompt: string) => {
    promptModel.prompt = newPrompt
    return promptModel
}

const EditPromptForm = () => {
    const user = useContext(UserContext)
    const { data: prompt, status: queryPromptStatus } =
        useQuery<PromptModel>("prompt", () => getActivePrompt(user.tenants[0].id))
    const promptService = usePrompt()

    const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (prompt?.prompt) {
            queryClient.setQueryData("prompt", updatePrompt(prompt, event.target.value))
        }
    }

    const handleButtonClick = () => {
        if (prompt?.prompt) {
            promptService.mutate({
                prompt_id: prompt.id,
                body: {
                    prompt: prompt.prompt,
                    name: "",
                    description: "",
                    is_active: prompt.is_active,
                    updated_by: user.id
                }
            })
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