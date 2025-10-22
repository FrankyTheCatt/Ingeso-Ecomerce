import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import type { Product, Category } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { DatabaseErrorBanner } from "@/components/database-error-banner"

export default async function HomePage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const supabase = await createClient()

  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="container py-8">
      <DatabaseErrorBanner />

      {searchParams.error === "unauthorized" && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para acceder al panel de administrador. Solo los administradores pueden acceder a esa
            sección.
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Bienvenido a noporolos store</h1>
        <p className="text-muted-foreground text-lg">Todo lo que necesitas para tu vida universitaria</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todos los productos</TabsTrigger>
          {categories?.map((category: Category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        {categories?.map((category: Category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products
                ?.filter((product: Product) => product.category_id === category.id)
                .map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
