import { ReviewModelCreate, ReviewModelRead } from '../model/ReviewModel'
import axiosClient from './axiosClient'
import ChatModel from '../model/ChatModel'
import { DatabasePredictionConfigModel } from '../model/DatabasePredictionConfigModel'


const getDatabasePredictionConfig = async (): Promise<DatabasePredictionConfigModel> => {
    // const { data: chatModel } = await axiosClient.get(`/config/database_prediction`)
    return Promise.resolve({
        is_sql_description: false,
        is_check_data: true,
        is_alternative_questions: true
    })
}

const updateDatabasePredictionConfig = (body: DatabasePredictionConfigModel): Promise<DatabasePredictionConfigModel> => {
    console.log(body)
    return Promise.resolve({
        is_sql_description: false,
        is_check_data: true,
        is_alternative_questions: true
    })
    // return axiosClient.put("/config/database_prediction", body).then(response => response.data)
}

export {
    getDatabasePredictionConfig,
    updateDatabasePredictionConfig
}