import { useMutation } from "react-query"
import { getChatPdfPrediction, getDatastepPrediction } from "api/predictionApi"

const useDatastepPrediction = () => {
    return useMutation(getDatastepPrediction)
}

const useChatPdfPrediction = () => {
    return useMutation(getChatPdfPrediction)
}

export {
    useDatastepPrediction,
    useChatPdfPrediction
}