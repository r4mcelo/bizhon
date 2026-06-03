import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { createSession } from "@/lib/session"

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

export async function POST(request: Request) {
  try {
    const { name, email, password, organizationName } = await request.json()

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { message: "Já existe uma conta com esse email." },
        { status: 409 }
      )
    }

    const passwordHash = await hash(password, 12)

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        memberships: {
          create: {
            role: "OWNER",
            organization: {
              create: {
                name: organizationName,
                slug: slugify(organizationName),
              },
            },
          },
        },
      },
    })

    await createSession(user.id)

    return NextResponse.json({ id: user.id }, { status: 201 })
  } catch (error) {
    console.error("[register]", error)
    return NextResponse.json(
      { message: "Erro interno ao criar conta." },
      { status: 500 }
    )
  }
}
