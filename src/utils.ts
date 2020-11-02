import type WebSocket from "ws"

import { db, started } from "."
import type {
    Notification,
    NotificationType,
    Request,
    RequestTypes,
    RequestType,
    ResponseError,
    ResponseSuccess,
    ResponseMessage
} from "./types"

export const notify = <T extends keyof NotificationType>(
    method: T,
    data: NotificationType[T],
    client: WebSocket
) => {
    const notification: Notification<T> = {
        notification: true,
        method,
        data
    }

    client.send(JSON.stringify(notification))
}

export const fetchLeaderboard = async () => {
    const lastEntry = await db.entry.findFirst({
        orderBy: {
            date: "desc"
        },
        select: { date: true }
    })
    const entries = await db.entry.findMany({
        select: { name: true, score: true }
    })

    const { date } = lastEntry ?? {
        date: new Date(started)
    }
    const leaderboard = entries.map(e => [
        e.name,
        e.score
    ]) as [string, number][]

    return { lastClicked: date.getTime(), leaderboard }
}

export const parseRequest = (request: string) => {
    const parsedRequest = JSON.parse(
        request
    ) as RequestTypes

    return parsedRequest
}

export const ok = <T extends keyof RequestType>(
    request: Request<T>,
    response: ResponseSuccess<T>,
    client: WebSocket
) => {
    const { id } = request
    const { ok, data } = response

    const message: ResponseMessage<T> = {
        data,
        id,
        ok,
        request: false
    }

    client.send(JSON.stringify(message))
}

export const error = <T extends keyof RequestType>(
    request: Request<T>,
    response: ResponseError,
    client: WebSocket
) => {
    const { id } = request
    const { ok, errorCode, errorReason } = response

    const message: ResponseMessage<T> = {
        errorCode,
        errorReason,
        id,
        ok,
        request: false
    }

    client.send(JSON.stringify(message))
}
