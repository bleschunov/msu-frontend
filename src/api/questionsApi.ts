import axiosClient from "api/axiosClient"
import QuestionModel from "model/QuestionModel"

const getTemplateQuestions = (limit: number): Promise<QuestionModel[]> => {
    return axiosClient.get(`/question/${limit}`).then(response => response.data)
}

export {
    getTemplateQuestions
}

