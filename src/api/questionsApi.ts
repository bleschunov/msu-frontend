import axiosClient from "api/axiosClient"
import QuestionModel, { QuestionGetModel } from "model/QuestionModel"

const getTemplateQuestions = (body: QuestionGetModel): Promise<QuestionModel[]> => {
    return axiosClient.post("/question/", body).then(response => response.data)
}

export {
    getTemplateQuestions
}

