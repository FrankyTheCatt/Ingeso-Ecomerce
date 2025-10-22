import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/product-form"

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nuevo Producto</h1>
        <p className="text-muted-foreground">Agrega un nuevo producto a tu inventario</p>
      </div>
      <ProductForm categories={categories || []} />
    </div>
  )
}
