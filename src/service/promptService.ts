import { useMutation } from "react-query"
import { editPrompt } from "api/promptApi"
import queryClient from "api/queryClient"

const usePrompt = () => {
    return useMutation("editPrompt", editPrompt, {
        onSuccess: () => queryClient.invalidateQueries("prompt")
    })
}

export {
    usePrompt
}