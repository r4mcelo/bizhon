import "server-only"
import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { decrypt } from "@/lib/jwt"
import { db } from "@/lib/db"

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value
  const session = await decrypt(cookie)

  if (!session?.sessionId) {
    redirect("/login")
  }

  const record = await db.session.findUnique({
    where: { id: session.sessionId },
  })

  if (!record || record.expiresAt < new Date()) {
    redirect("/login")
  }

  return { isAuth: true, userId: record.userId }
})
