interface PromptEditModel {
    prompt: string
    name: string
    description: string
    is_active: boolean
    updated_by: string | null
}

interface PromptModel extends PromptEditModel {
    id: number
    tenant_id: number
    created_at: string
    updated_at: string
    created_by: string | null
}

export type {
    PromptModel,
    PromptEditModel
}