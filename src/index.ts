import { createServer } from "http"
import { PrismaClient } from "@prisma/client"

const port = Number(process.env.PORT || 8091)

const db = new PrismaClient()

const server = createServer((_, res) => {
    res.statusCode = 200
    res.setHeader("Content-Type", "text/plain")
    res.end("Hello from lunartime's API!")
})

server.listen(port)

console.info(`Server running at http://localhost:${port}/`)
