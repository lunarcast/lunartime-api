import { db, started } from ".."
import type { Handler } from "../types"

export const pressedButton: Handler<"pressedButton"> = async (
    request,
    __
) => {
    const {
        data: { name }
    } = request

    const lastEntry = await db.entry.findFirst({
        orderBy: {
            date: "desc"
        },
        select: { date: true }
    })
    const date = new Date()

    const { date: lastClicked } = lastEntry ?? {
        date: new Date(started)
    }

    const score = Math.floor(
        (Date.now() - lastClicked.getTime()) / 1000
    )

    await db.entry.upsert({
        create: { date, name, score },
        update: { date, score },
        where: { name }
    })

    return { ok: true, data: {} }
}
