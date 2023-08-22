import {ReactNode} from "react";
import moment from "moment";
import 'moment/locale/ru'
 

const getBaseUrl = (): string => {
    if (process.env.NODE_ENV === "production") {
        return "https://msu-backend-dev.fly.dev/api/v1"
    }

    return "https://msu-backend-dev.fly.dev/api/v1"
}

const getLastN = (n: number, arr: ReactNode[]) => {
    return arr.slice(Math.max(arr.length - n, 0))
}

const formatDate = (date: Date): string => {
    return moment(date).locale("ru").calendar()
}

export {
    getBaseUrl,
    getLastN,
    formatDate
}