interface QuestionModel {
  id: number
  question: string
}

export interface QuestionGetModel {
  tables: string[]
  limit: number
}

export default QuestionModel
