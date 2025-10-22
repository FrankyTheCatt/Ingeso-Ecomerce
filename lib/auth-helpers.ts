import { createClient } from "@/lib/supabase/server"

export async function isAdmin() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const { data: roleData, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single()

    // Si hay error de recursión, retornar false y loguear
    if (error) {
      console.error("[v0] Error checking admin role:", error.message)
      if (error.message.includes("infinite recursion")) {
        console.error(
          "[v0] CRITICAL: Infinite recursion in user_roles policies. Please run scripts/009_fix_recursion_completely.sql in Supabase SQL Editor",
        )
      }
      return false
    }

    return roleData?.role === "admin"
  } catch (error) {
    console.error("[v0] Exception in isAdmin:", error)
    return false
  }
}

export async function getUserRole(userId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).single()

    if (error) {
      console.error("[v0] Error getting user role:", error.message)
      return "customer"
    }

    return data?.role || "customer"
  } catch (error) {
    console.error("[v0] Exception in getUserRole:", error)
    return "customer"
  }
}
