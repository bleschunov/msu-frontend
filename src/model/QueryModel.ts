interface QueryModel {
    chat_id: number
    query: string
    filename?: string
    tables?: string[]
}

export default QueryModel
