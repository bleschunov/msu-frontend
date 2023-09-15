import { ReactNode, useMemo } from "react"
import moment from "moment"
import "moment/locale/ru"
import { useLocation } from "react-router-dom"

const getBaseUrl = (): string => {
    if (process.env.NODE_ENV === "production") {
        return "https://msu-backend-dev.fly.dev/api"
    }

    return "http://0.0.0.0:8080/api"
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

// Взял этот хук здесь https://v5.reactrouter.com/web/example/query-parameters
const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
}

export {
    getBaseUrl,
    getLastN,
    formatDate,
    sortDate,
    useQuery
}