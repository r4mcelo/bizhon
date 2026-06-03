"use client"

import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  async function checkSession() {
    const res = await fetch("/api/auth/verify")
    if (!res.ok) {
      router.push("/login")
    } else {
      const data = await res.json()
      alert(`Sessão válida — userId: ${data.userId}`)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center gap-4">
      <button
        onClick={checkSession}
        className="rounded-md bg-black px-4 py-2 text-white text-sm"
      >
        Verificar sessão
      </button>
    </div>
  )
}
