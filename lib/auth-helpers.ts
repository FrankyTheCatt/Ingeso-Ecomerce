import { createClient } from "@/lib/supabase/server"

export async function isAdmin() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const { data: role, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle()

      if (error) {
        console.warn("[isAdmin] Error al obtener rol:", error.message)
        return false // simplemente devolvemos false, no lanzamos error
      }

      if (!role) {
        console.warn("[isAdmin] Usuario sin rol asignado. Se asume cliente.")
        return false
      }

      return role.role === "admin"

  } catch (error: any) {
  // ✅ Esta es la comprobación manual de la Solución 2
      if (typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
        throw error // ✅ Es una redirección, la volvemos a lanzar
      }

      // Si no es redirección, es un error real
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
