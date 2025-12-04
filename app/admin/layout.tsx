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
  } catch (error) {
    console.error("Error checking admin status:", error)
    redirect("/?error=unauthorized")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="container mx-auto px-4 py-6 max-w-7xl">{children}</main>
    </div>
  )
}
