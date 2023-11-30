import { BlockMapType } from "react-notion"
import axios from "axios"
import axiosClient from "api/axiosClient"
import { InstructionModel } from "model/InstructionModel"

const getInstruction = async (tenant_id: number): Promise<BlockMapType> => {
    const instruction = await axiosClient.get<InstructionModel>(`/tenant/${tenant_id}/instruction`)
        .then(response => response.data)
    return await axios.get(`https://notion-api.splitbee.io/v1/page/${instruction.notion_page_id}`)
        .then(response => response.data)
}

export {
    getInstruction
}