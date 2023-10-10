import { uploadFile as uploadFileApi } from "api/fileApi"
import queryClient from "api/queryClient"
import { useMutation } from "react-query"

const useFiles = () => {
    return useMutation(uploadFileApi, {
        onSuccess: () => {
            queryClient.invalidateQueries("filesList")
            queryClient.invalidateQueries("currentFile")
        },
    })
}

export {
    useFiles
}

