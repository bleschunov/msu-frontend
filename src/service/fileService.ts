import { uploadFile as uploadFileApi } from "api/fileApi"
import { useMutation } from "react-query"
import { AxiosError } from "axios"

const useFiles = () => {
    return useMutation(uploadFileApi, {
        onError: (error: AxiosError) => {
            // @ts-ignore
            return error.response.data.detail
        }
    })
}

export {
    useFiles
}

