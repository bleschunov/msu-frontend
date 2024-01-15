import { ModeModel } from './ModeModel'

interface TenantModel {
    id: number
    name: string
    logo: string
    is_last: boolean
    modes: ModeModel[]
}

export type {
    TenantModel
}