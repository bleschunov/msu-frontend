interface QueryModel {
    chat_id: number
    query: string
    filename?: string
    tables?: string[]
    limit?: number
}

export default QueryModel
