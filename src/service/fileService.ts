import { removeFile as removeFileApi } from "api/fileApi"
import { useMutation } from "react-query"
import queryClient from "api/queryClient"

const useDeleteFileMutation = () => {
    return useMutation(removeFileApi, {
        onSuccess: () => {
            queryClient.invalidateQueries("filesList")
        }
    })
}

export {
    useDeleteFileMutation
}

