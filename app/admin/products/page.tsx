import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/format"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ProductActions } from "@/components/product-actions"
import { Badge } from "@/components/ui/badge"

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Productos</h1>
          <p className="text-muted-foreground">Gestiona tu inventario de productos</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products && products.length > 0 ? (
              products.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{product.name}</p>
                      {product.stock <= 5 && product.stock > 0 && <Badge variant="secondary">Stock bajo</Badge>}
                      {product.stock === 0 && <Badge variant="destructive">Agotado</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Precio:</span>{" "}
                        <span className="font-semibold">{formatPrice(product.price)}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Stock:</span>{" "}
                        <span className="font-semibold">{product.stock}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Categoría:</span>{" "}
                        <span className="font-semibold">{product.categories?.name || "Sin categoría"}</span>
                      </p>
                    </div>
                  </div>
                  <ProductActions productId={product.id} />
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No hay productos registrados</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
