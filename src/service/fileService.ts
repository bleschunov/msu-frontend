import { uploadFile as uploadFileApi } from "api/fileApi"
import { useMutation } from "react-query"

const useFiles = () => {
    return useMutation(uploadFileApi)
}

export {
    useFiles
}

