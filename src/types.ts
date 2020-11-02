import type WebSocket from "ws"

export type NotificationType = {
    leaderboardUpdate: {
        lastClicked: number
        leaderboard: [string, number][]
    }
}

export type Notification<
    T extends keyof NotificationType
> = {
    notification: true
    method: T
    data: NotificationType[T]
}

export type RequestType = {
    pressedButton: {
        request: { name: string }
        response: {}
    }
}

export type Request<T extends keyof RequestType> = {
    request: true
    id: number
    method: T
    data: RequestType[T]["request"]
}
export type RequestTypes = {
    [K in keyof RequestType]: Request<K>
}[keyof RequestType]

export type ResponseSuccess<T extends keyof RequestType> = {
    ok: true
    data: RequestType[T]["response"]
}
export type ResponseError = {
    ok: false
    errorCode: number
    errorReason: string
}

type Response<T extends keyof RequestType> =
    | ResponseSuccess<T>
    | ResponseError
export type ResponseMessage<T extends keyof RequestType> = {
    request: false
    id: number
} & Response<T>

type Awaitable<T> = T | Promise<T>

export type Handler<T extends keyof RequestType> = (
    request: Request<T>,
    client: WebSocket
) => Awaitable<Response<T>>
