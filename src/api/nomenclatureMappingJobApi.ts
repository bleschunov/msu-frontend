import axiosClient from './axiosClient'
import { NomenclatureMappingJobModel } from '../model/NomenclatureMappingJobModel'

const getNomenclatureMappingJobs = (): Promise<NomenclatureMappingJobModel[]> => {
    return axiosClient.get(`/nomenclature/job`).then(response => response.data)
}

const updateNomenclatureMapping = (body: { id: number, correctness: string}): Promise<NomenclatureMappingJobModel[]> => {
    return axiosClient.put(`/nomenclature`, body).then(response => response.data)
}

export {
    getNomenclatureMappingJobs,
    updateNomenclatureMapping
}