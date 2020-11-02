import WebSocket from "ws"
import { PrismaClient } from "@prisma/client"

import * as handlers from "./handlers"

import {
    fetchLeaderboard,
    notify,
    ok,
    parseRequest
} from "./utils"

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

    ws.on("message", async message => {
        const request = parseRequest(message.toString())

        const response = await handlers[request.method](
            request,
            ws
        )

        if (response.ok) {
            if (request.method === "pressedButton") {
                const {
                    lastClicked,
                    leaderboard
                } = await fetchLeaderboard()

                wss.clients.forEach(ws => {
                    notify(
                        "leaderboardUpdate",
                        { lastClicked, leaderboard },
                        ws
                    )
                })
            }

            ok(request, response, ws)
        }
    })
})
