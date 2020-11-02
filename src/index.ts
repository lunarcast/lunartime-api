import WebSocket from "ws"
import { PrismaClient } from "@prisma/client"

import { fetchLeaderboard, notify } from "./utils"

const port = Number(process.env.PORT || 8091)

export const db = new PrismaClient()
export const started = Date.now()

const wss = new WebSocket.Server({ port }, () => {
    console.log(
        `WebSockets server started and running at ws://localhost:${port}/`
    )
})

wss.on("connection", async ws => {
    const {
        lastClicked,
        leaderboard
    } = await fetchLeaderboard()
    notify(
        "leaderboardUpdate",
        { lastClicked, leaderboard },
        ws
    )
})
