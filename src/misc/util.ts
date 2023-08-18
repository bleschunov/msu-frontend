import {ReactNode} from "react";

export const getBaseUrl = (): string => {
    if (process.env.NODE_ENV === "production") {
        return "https://msu-backend-master.fly.dev"
    }

    return "http://localhost:8080/api/v1"
}

export const getLastN = (n: number, arr: ReactNode[]) => {
    return arr.slice(Math.max(arr.length - n, 0))
}