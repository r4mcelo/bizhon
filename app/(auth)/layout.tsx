import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left panel — animated gradient */}
      <div className="auth-gradient hidden md:block md:w-[60%]" />

      {/* Right panel */}
      <div className="flex w-full md:w-[40%] bg-[#FAFAFA] items-center justify-center px-8 py-12 overflow-y-auto">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
