import {ReactNode} from "react";
import {formatRelative, subDays} from 'date-fns'
import { ru } from 'date-fns/locale'

const getBaseUrl = (): string => {
    if (process.env.NODE_ENV === "production") {
        return "https://msu-backend-dev.fly.dev/api/v1"
    }

    return "http://0.0.0.0:8080/api/v1"
}

const getLastN = (n: number, arr: ReactNode[]) => {
    return arr.slice(Math.max(arr.length - n, 0))
}

const formatRelativeDate = (date: Date): string => {
    return formatRelative(subDays(new Date(), 2), new Date(), { locale: ru })
}

export {
    getBaseUrl,
    getLastN,
    formatRelativeDate
}