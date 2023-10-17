import { removeFile as removeFileApi, uploadFile as uploadFileApi } from 'api/fileApi'
import { useMutation } from "react-query"
import { AxiosError } from "axios"
import queryClient from '../api/queryClient'

const useFiles = () => {
    return useMutation(uploadFileApi, {
        onError: (error: AxiosError) => {
            // @ts-ignore
            return error.response.data.detail
        }
    })
}

const useDeleteFileMutation = () => {
    return useMutation(removeFileApi, {
        onSuccess: () => {
            queryClient.invalidateQueries("filesList")
        }
    })
}

export {
    useFiles,
    useDeleteFileMutation
}

