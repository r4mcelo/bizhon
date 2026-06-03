import "server-only"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { encrypt, decrypt } from "@/lib/jwt"

export type { SessionPayload } from "@/lib/jwt"

const EXPIRES_IN = 7 * 24 * 60 * 60 * 1000 // 7 days
const EXPIRES_IN_STR = "7d"

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + EXPIRES_IN)

  const session = await db.session.create({
    data: { userId, token: crypto.randomUUID(), expiresAt },
  })

  const jwt = await encrypt({ sessionId: session.id, expiresAt }, EXPIRES_IN_STR)
  const cookieStore = await cookies()

  cookieStore.set("session", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })
}

export async function updateSession() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get("session")?.value
  const payload = await decrypt(jwt)

  if (!jwt || !payload) return null

  const expiresAt = new Date(Date.now() + EXPIRES_IN)

  await db.session.update({
    where: { id: payload.sessionId },
    data: { expiresAt },
  })

  cookieStore.set("session", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get("session")?.value
  const payload = await decrypt(jwt)

  if (payload?.sessionId) {
    await db.session.delete({ where: { id: payload.sessionId } }).catch(() => null)
  }

  cookieStore.delete("session")
}
