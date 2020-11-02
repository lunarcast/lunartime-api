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
