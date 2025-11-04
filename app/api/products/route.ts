import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { name, description, price, stock, category_id, image_url } = body

    if (!name || price === undefined || stock === undefined) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        description,
        price,
        stock,
        category_id: category_id || null,
        image_url: image_url || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, product: data })
  } catch (error) {
    console.error("[v0] Error creating product:", error)
    return NextResponse.json({ error: "Error al crear el producto" }, { status: 500 })
  }
}
