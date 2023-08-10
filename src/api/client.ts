import axios from "axios";
import {QueryClient} from "react-query";

export const queryClient = new QueryClient()

export const axiosClient = axios.create({
    baseURL: 'http://0.0.0.0:8080/'
});

export const getPrediction = async (body: {query: string}) => {
    return await axiosClient.post("/datastep/prediction", body)
}

export const resetContext = async () => {
    return await axiosClient.get("/datastep/reset")
}

