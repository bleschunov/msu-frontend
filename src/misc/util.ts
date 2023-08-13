export const getBaseUrl = (): string => {
    if (process.env.NODE_ENV === "production") {
        return "https://msu-backend.fly.dev"
    }

    return "http://localhost:8080"
}

export const getLastN = (n: number, arr: any[]) => {
    return arr.slice(Math.max(arr.length - n, 0))
}