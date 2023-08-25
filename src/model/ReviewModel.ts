interface ReviewModelBase {
    id: number
    message_id: number
    commentary: string
    created_at: string
}

interface ReviewModelCreate extends ReviewModelBase {
    created_by: string
}

// оставил пока так, потому что скорее всего в будущем сюда будет приходить юзер с именем, аватаркой и почтой...
interface ReviewModelRead extends ReviewModelBase {
    created_by: string
}

export type {
    ReviewModelCreate,
    ReviewModelRead
}