import type WebSocket from "ws"

import { db, started } from "."
import type {
    Notification,
    NotificationType
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
