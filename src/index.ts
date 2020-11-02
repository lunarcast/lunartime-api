import WebSocket from "ws"
import { PrismaClient } from "@prisma/client"

const port = Number(process.env.PORT || 8091)

export const db = new PrismaClient()

const wss = new WebSocket.Server({ port }, () => {
    console.log(
        `WebSockets server started and running at ws://localhost:${port}/`
    )
})

wss.on("connection", async ws => {
    ws.send("Hello from lunartime's API!")
})
