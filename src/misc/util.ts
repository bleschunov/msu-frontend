import moment from "moment"
import "moment/locale/ru"
import { ReactNode, useMemo } from "react"
import { useLocation } from "react-router-dom"

const getBaseUrl = (): string => {
    const backend_url = process.env["REACT_APP_BACKEND_URL"]
    if (!backend_url) {
        throw Error("REACT_APP_BACKEND_URL must be passed in .env.development or .env.production")
    }
    return backend_url
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
const useSearchQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
}

export {
    formatDate, getBaseUrl,
    getLastN, sortDate,
    useSearchQuery
}
