import { NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { db } from "@/lib/db"
import { createSession } from "@/lib/session"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json(
        { message: "Email ou senha incorretos." },
        { status: 401 }
      )
    }

    const valid = await compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json(
        { message: "Email ou senha incorretos." },
        { status: 401 }
      )
    }

    await createSession(user.id)

    return NextResponse.json({ id: user.id })
  } catch (error) {
    console.error("[login]", error)
    return NextResponse.json(
      { message: "Erro interno ao fazer login." },
      { status: 500 }
    )
  }
}
