import type WebSocket from "ws"

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
