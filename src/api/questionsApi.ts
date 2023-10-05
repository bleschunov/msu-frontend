import axiosClient from "api/axiosClient"
import QuestionModel, { QuestionGetModel } from "model/QuestionModel"

const getTemplateQuestions = (body: QuestionGetModel): Promise<QuestionModel[]> => {
    return axiosClient.get(`/question/${body.limit}`).then(response => response.data)
}

export {
    getTemplateQuestions
}

