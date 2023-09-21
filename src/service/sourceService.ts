import queryClient from "api/queryClient"
import { uploadSource as uploadSourceApi } from "api/sourceApi"
import { useMutation } from "react-query"

const useSource = () => {
    return useMutation(uploadSourceApi, {
        onSuccess: () => {
            queryClient.invalidateQueries("currentSource")
        },
    })
}

export {
    useSource
}

