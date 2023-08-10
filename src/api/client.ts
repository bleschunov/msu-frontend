import axios from "axios";
import {QueryClient} from "react-query";

export const queryClient = new QueryClient()

export const axiosClient = axios.create({
    baseURL: 'https://msu-backend.fly.dev'
});

export const getPrediction = async (body: {query: string}) => {
    return await axiosClient.post("/datastep/prediction", body)
}

export const resetContext = async () => {
    return await axiosClient.get("/datastep/reset")
}

