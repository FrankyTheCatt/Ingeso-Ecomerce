import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/product-form"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase.from("products").select("*").eq("id", id).single()

  if (!product) {
    notFound()
  }

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Editar Producto</h1>
        <p className="text-muted-foreground">Actualiza la información del producto</p>
      </div>
      <ProductForm product={product} categories={categories || []} />
    </div>
  )
}
