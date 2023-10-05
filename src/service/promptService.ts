import { useMutation } from "react-query"
import { editActivePrompt } from "api/promptApi"
import queryClient from "api/queryClient"
import { PromptEditModel } from "model/PromptModel"

interface IEditFunc {
    prompt_id: number,
    body: PromptEditModel
}

const usePrompt = () => {
    const func = ({ prompt_id, body }: IEditFunc) =>
        editActivePrompt(prompt_id, body)

    const options = {
        onSuccess: () => queryClient.invalidateQueries("prompt")
    }

    return useMutation("editPrompt", func, options)
}

export {
    usePrompt
}