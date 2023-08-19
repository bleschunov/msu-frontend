import {ReactNode} from "react";
import moment from "moment";

const getBaseUrl = (): string => {
    if (process.env.NODE_ENV === "production") {
        return process.env.REACT_APP_BACKEND_URI ?? "https://msu-backend-dev.fly.dev/api/v1"
    }

    return "http://localhost:8080/api/v1"
}

const getLastN = (n: number, arr: ReactNode[]) => {
    return arr.slice(Math.max(arr.length - n, 0))
}

const formatDate = (date: Date): string => {
    return moment(date).calendar()
}

export {
    getBaseUrl,
    getLastN,
    formatDate
}