import { NextResponse } from "next/server"
import { deleteSession } from "@/lib/session"

export async function POST() {
  try {
    await deleteSession()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[logout]", error)
    return NextResponse.json(
      { message: "Erro interno ao fazer logout." },
      { status: 500 }
    )
  }
}
