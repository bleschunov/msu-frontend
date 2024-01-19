import { TenantModel } from "model/TenantModel"
import { DatabasePredictionConfigModel } from "model/DatabasePredictionConfigModel"

type ModeT = "wiki" | "databases"

interface UserModel {
    id: string
    username: string
    tenants: TenantModel[]
    database_prediction_config: DatabasePredictionConfigModel
}

export type {
    UserModel,
    ModeT
}
