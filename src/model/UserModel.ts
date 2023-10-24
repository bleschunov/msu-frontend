type ModeT = "wiki" | "databases"

interface UserModel {
    id: string
    email: string
    tenant_id: number
    available_modes: ModeT[]
}

export type {
    UserModel,
    ModeT
}
