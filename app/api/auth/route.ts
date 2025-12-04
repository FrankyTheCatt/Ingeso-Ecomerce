import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401 })
    }

    const { data: existingRole, error: fetchError } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()

    if (existingRole) {
      return NextResponse.json({ message: "El usuario ya tiene un rol", role: existingRole.role }, { status: 200 })
    }

    console.log("Creating role for user:", user.id)

    const { data: newRole, error: insertError } = await supabase
      .from("user_roles")
      .insert({
        user_id: user.id,
        role: "user",
      })
      .select()
      .maybeSingle()

    if (insertError) {
      console.error("Error creating user role:", insertError)
      return NextResponse.json(
        { error: "Error al crear el rol del usuario", details: insertError.message },
        { status: 500 },
      )
    }

    console.log("Role created successfully:", newRole)
    return NextResponse.json({ message: "Rol del usuario creado", role: newRole }, { status: 201 })
  } catch (error) {
    console.error("Exception in auth route:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
