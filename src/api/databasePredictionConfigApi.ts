import axiosClient from "api/axiosClient"
import { DatabasePredictionConfigModel } from "model/DatabasePredictionConfigModel"

const getDatabasePredictionConfig = async (): Promise<DatabasePredictionConfigModel> => {
    const { data: config } = await axiosClient.get("/config/database_prediction")
    return config
}

const updateDatabasePredictionConfig = async (body: DatabasePredictionConfigModel): Promise<DatabasePredictionConfigModel> => {
    const { data: config } = await axiosClient.put("/config/database_prediction", body).then(response => response.data)
    return config
}

export {
    getDatabasePredictionConfig,
    updateDatabasePredictionConfig
}