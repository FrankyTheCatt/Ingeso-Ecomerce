import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin-nav"
import { isAdmin } from "@/lib/auth-helpers"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin")
  }

  try {
    const userIsAdmin = await isAdmin()

    if (!userIsAdmin) {
      redirect("/?error=unauthorized")
    }
  } catch (error: any) {
    // ✅ Esta es la comprobación manual que reemplaza a isRedirectError
    if (typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error; // Es una redirección, vuelve a lanzarla
    }

    // Si NO es una redirección, es un error real
    console.error("[v0] Error checking admin status:", error)
    redirect("/database-error")
  }

  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="container py-6">{children}</main>
    </div>
  )
}
