import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { name, description, price, stock, category_id, image_url } = body

    if (!name || price === undefined || stock === undefined) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price,
        stock,
        category_id: category_id || null,
        image_url: image_url || null,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, product: data })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Error al actualizar el producto" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Error al eliminar el producto" }, { status: 500 })
  }
}
