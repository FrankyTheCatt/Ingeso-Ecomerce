"use client"

import { usePathname } from "next/navigation"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/auth/admin")

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <StoreHeader />
      <div className="flex flex-col min-h-screen">
        <main className="w-full mx-auto flex-grow">{children}</main>
        <StoreFooter />
      </div>
    </>
  )
}

