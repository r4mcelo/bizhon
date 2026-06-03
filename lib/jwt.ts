import { SignJWT, jwtVerify } from "jose"

export interface SessionPayload {
  sessionId: string
  expiresAt: Date
}

const key = new TextEncoder().encode(process.env.SESSION_SECRET)

export async function encrypt(payload: SessionPayload, expiresIn: string) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key)
}

export async function decrypt(token: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
