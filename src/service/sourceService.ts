import queryClient from "api/queryClient"
import { saveSource as saveSourceApi } from "api/sourceApi"
import { useMutation } from "react-query"

const useSource = () => {
    return useMutation(saveSourceApi, {
        onSuccess: () => {
            queryClient.invalidateQueries("chat")
        },
    })
}

export {
    useSource
}

