import axiosClient from "api/axiosClient"

const uploadFile = (file: File): Promise<string> => {
    return axiosClient.postForm(
        "/file",
        { file },
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    ).then(response => response.data)
}

export {
    uploadFile
}

