import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import type { Product, Category } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export const metadata = {
  title: "Catálogo de Productos | noporolos store",
  description: "Explora nuestra selección completa de productos para estudiantes universitarios.",
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false })
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      {params.error === "unauthorized" && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para acceder al panel de administrador. Solo los administradores pueden acceder a esa
            sección.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Catálogo Completo</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Todo lo que necesitas para sobrevivir y triunfar en el semestre. Desde snacks para las noches de estudio hasta los gadgets más esenciales.
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex overflow-auto pb-4 mb-6">
          <TabsList className="inline-flex h-auto p-1 bg-secondary/50 rounded-lg">
            <TabsTrigger value="all" className="py-2.5 px-6 rounded-md font-medium">Todos</TabsTrigger>
            {categories?.map((category: Category) => (
              <TabsTrigger key={category.id} value={category.id} className="py-2.5 px-6 rounded-md font-medium">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        {categories?.map((category: Category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
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

