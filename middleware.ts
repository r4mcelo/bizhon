import { NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/jwt"

const protectedRoutes = ["/dashboard"]
const publicRoutes = ["/login", "/register", "/"]

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some((r) => path.startsWith(r))
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = req.cookies.get("session")?.value
  const session = await decrypt(cookie)

  if (isProtectedRoute && !session?.sessionId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (isPublicRoute && session?.sessionId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
