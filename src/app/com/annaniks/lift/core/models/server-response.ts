
export interface ServerResponse<T> {
    data?: T,
    error?: Error
}
interface Error {
    code: number,
    message: string
}