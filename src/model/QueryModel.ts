interface QueryModel {
    chat_id: number
    query: string
    file: File | null
    tables: string[] | null
}

export default QueryModel