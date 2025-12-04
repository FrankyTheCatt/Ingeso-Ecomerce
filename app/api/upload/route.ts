import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticación y permisos de admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // Verificar si es admin (opcional, puedes ajustar según tus necesidades)
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (roleData?.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 })
    }

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, WebP, GIF)" },
        { status: 400 }
      )
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "El archivo es demasiado grande. Máximo 5MB" }, { status: 400 })
    }

    // Generar nombre único para el archivo
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `products/${fileName}`

    // Subir archivo a Supabase Storage
    const { data, error } = await supabase.storage.from("product-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file:", error)
      return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 })
    }

    // Obtener URL pública de la imagen
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath)

    return NextResponse.json({ success: true, url: publicUrl, path: filePath })
  } catch (error) {
    console.error("Error in upload route:", error)
    return NextResponse.json({ error: "Error al procesar la imagen" }, { status: 500 })
  }
}
