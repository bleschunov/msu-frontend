import { useMutation } from "react-query"
import { useContext } from "react"
import { useCreateMessage } from "./messageService"
import MessageModel from "../model/MessageModel"
import { ModeContext, ModeContextI } from "../context/modeContext"
import { getChatPdfPrediction, getDatastepPrediction } from "../api/predictionApi"
import { AxiosError, AxiosResponse } from 'axios'

const usePrediction = () => {
    const { mode } = useContext<ModeContextI>(ModeContext)
    const messageCreateMutation = useCreateMessage()

    // const predictionFunc = mode === "datastep" ? getDatastepPrediction : getChatPdfPrediction
    const predictionFunc = getDatastepPrediction

    return useMutation(predictionFunc, {
        onSuccess: (data, something) => {
            let messageBody
            if (mode === "datastep") {
                messageBody = {
                    chat_id,
                    answer: data.answer,
                    sql: data.sql,
                    table: data.table
                }
            } else {
                messageBody = {
                    chat_id,
                    answer: data
                }
            }

            messageCreateMutation.mutate(messageBody as MessageModel)
        },
        onError: (axiosError, { chat_id }) => {
            const message = "Произошла ошибка. Попробуйте другой запрос."

            messageCreateMutation.mutate({
                chat_id,
                answer: message
            } as MessageModel)
        }
    })
}

export {
    usePrediction
}