interface QueryModel {
    chat_id: number
    query: string
    source_id?: string
    tables: string[] | null
}

export default QueryModel
