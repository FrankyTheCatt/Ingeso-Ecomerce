import { createClient } from "@/lib/supabase/server"

export async function isAdmin() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const { data: roleData, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle()

    if (error) {
      console.error("Error checking admin role:", error.message)
      if (error.message.includes("infinite recursion")) {
        console.error(
          "CRITICAL: Infinite recursion in user_roles policies. Please check Supabase policies",
        )
      }
      return false
    }

    return roleData?.role === "admin"
  } catch (error) {
    console.error("Exception in isAdmin:", error)
    return false
  }
}

export async function getUserRole(userId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle()

    if (error) {
      console.error("Error getting user role:", error.message)
      return "customer"
    }

    return data?.role || "customer"
  } catch (error) {
    console.error("Exception in getUserRole:", error)
    return "customer"
  }
}
