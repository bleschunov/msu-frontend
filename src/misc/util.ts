import { ReactNode } from "react"
import moment from "moment"
import "moment/locale/ru"

const getBaseUrl = (): string => {
    if (process.env.NODE_ENV === "production") {
        return "https://msu-backend-dev.fly.dev/api/v1"
    }

    return "http://0.0.0.0:8080/api/v1"
}

const getLastN = (n: number, arr: ReactNode[]) => {
    return arr.slice(Math.max(arr.length - n, 0))
}

const formatDate = (date: string): string => {
    return moment(date).locale("ru").calendar()
}

const sortDate = (dateA: string, dateB: string, descending: boolean) => {
    const result = +(new Date(dateA)) - +(new Date(dateB))
    return descending ? -result : result
}

export {
    getBaseUrl,
    getLastN,
    formatDate,
    sortDate
}