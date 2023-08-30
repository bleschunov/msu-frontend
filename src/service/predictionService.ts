import { useMutation } from "react-query"
import { useContext } from "react"
import { ModeContext, ModeContextI } from "context/modeContext"
import { getChatPdfPrediction, getDatastepPrediction } from "api/predictionApi"

const usePrediction = () => {
    const { mode } = useContext<ModeContextI>(ModeContext)
    const predictionFunc = mode === "datastep" ? getDatastepPrediction : getChatPdfPrediction
    return useMutation(predictionFunc)
}

export {
    usePrediction
}