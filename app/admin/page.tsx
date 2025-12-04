import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/format"
import { Package, ShoppingCart, TrendingUp, AlertCircle, User } from "lucide-react"
import { SalesChart } from "@/components/sales-chart"
import { TopProductsChart } from "@/components/top-products-chart"
import { CategorySalesChart } from "@/components/category-sales-chart"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Get total products
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

  // Get low stock products
  const { count: lowStockCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .lte("stock", 5)

  // Get total sales
  const { count: totalSales } = await supabase.from("sales").select("*", { count: "exact", head: true })

  // Get total revenue
  const { data: sales } = await supabase
    .from("sales")
    .select("total, created_at")
    .order("created_at", { ascending: true })
  const totalRevenue = sales?.reduce((sum, sale) => sum + Number(sale.total), 0) || 0

  // Get sales data for chart (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: recentSalesData } = await supabase
    .from("sales")
    .select("total, created_at")
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: true })

  // Get top selling products
  const { data: topProducts } = await supabase.from("sale_items").select("product_name, quantity, price_at_sale")

  // Aggregate top products
  const productSales = topProducts?.reduce((acc: any, item: any) => {
    if (!acc[item.product_name]) {
      acc[item.product_name] = { name: item.product_name, quantity: 0, revenue: 0 }
    }
    acc[item.product_name].quantity += item.quantity
    acc[item.product_name].revenue += item.quantity * item.price_at_sale
    return acc
  }, {})

  const topProductsList = Object.values(productSales || {})
    .sort((a: any, b: any) => b.quantity - a.quantity)
    .slice(0, 5)

  // Get sales by category
  const { data: categorySales } = await supabase.from("sale_items").select("product_id, quantity, price_at_sale")

  const productIds = categorySales?.map((item: any) => item.product_id).filter(Boolean) || []

  let categoryData: any[] = []
  if (productIds.length > 0) {
    const { data: productsWithCategories } = await supabase
      .from("products")
      .select("id, category_id, categories(name)")
      .in("id", productIds)

    const categoryMap = new Map()
    productsWithCategories?.forEach((product: any) => {
      categoryMap.set(product.id, product.categories?.name || "Sin categoría")
    })

    const categorySalesMap = categorySales?.reduce((acc: any, item: any) => {
      const categoryName = categoryMap.get(item.product_id) || "Sin categoría"
      if (!acc[categoryName]) {
        acc[categoryName] = 0
      }
      acc[categoryName] += item.quantity * item.price_at_sale
      return acc
    }, {})

    categoryData = Object.entries(categorySalesMap || {}).map(([name, value]) => ({
      name,
      value: Number(value),
    }))
  }

  // Get recent sales
  const { data: recentSales } = await supabase
    .from("sales")
    .select("*, sale_items(*)")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-voodoo-950 dark:text-voodoo-50">Dashboard</h1>
        <p className="text-voodoo-600 dark:text-voodoo-400">Resumen de actividad y rendimiento de tu tienda.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-voodoo-100 dark:border-voodoo-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-voodoo-600 dark:text-voodoo-400">Ingresos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-voodoo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-voodoo-900 dark:text-voodoo-50">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">+20.1% mes pasado</p>
          </CardContent>
        </Card>
        <Card className="border-voodoo-100 dark:border-voodoo-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-voodoo-600 dark:text-voodoo-400">Ventas Totales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-voodoo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-voodoo-900 dark:text-voodoo-50">{totalSales || 0}</div>
             <p className="text-xs text-muted-foreground mt-1">+15% mes pasado</p>
          </CardContent>
        </Card>
        <Card className="border-voodoo-100 dark:border-voodoo-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-voodoo-600 dark:text-voodoo-400">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-voodoo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-voodoo-900 dark:text-voodoo-50">{totalProducts || 0}</div>
             <p className="text-xs text-muted-foreground mt-1">Activos en catálogo</p>
          </CardContent>
        </Card>
        <Card className="border-voodoo-100 dark:border-voodoo-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-voodoo-600 dark:text-voodoo-400">Alertas de Stock</CardTitle>
            <AlertCircle className={`h-4 w-4 ${lowStockCount && lowStockCount > 0 ? "text-red-500 animate-pulse" : "text-voodoo-500"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-voodoo-900 dark:text-voodoo-50">{lowStockCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Productos con stock bajo</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
            <SalesChart data={recentSalesData || []} />
        </div>
        <div className="col-span-3">
             <TopProductsChart data={topProductsList} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-3">
            <CategorySalesChart data={categoryData} />
        </div>
        <div className="col-span-4">
            <Card className="h-full shadow-sm border-voodoo-100 dark:border-voodoo-800">
                <CardHeader>
                <CardTitle className="text-lg font-semibold text-voodoo-900 dark:text-voodoo-50">Últimas Transacciones</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="space-y-6">
                    {recentSales && recentSales.length > 0 ? (
                    recentSales.map((sale: any) => (
                        <div key={sale.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-9 w-9 rounded-full bg-voodoo-50 dark:bg-voodoo-900 flex items-center justify-center text-voodoo-600">
                                <User className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-voodoo-900 dark:text-voodoo-50">{sale.customer_name}</p>
                                <p className="text-xs text-muted-foreground">{sale.customer_email}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-voodoo-900 dark:text-voodoo-50">{formatPrice(sale.total)}</p>
                            <p className="text-xs text-voodoo-500 capitalize">{sale.status}</p>
                        </div>
                        </div>
                    ))
                    ) : (
                    <p className="text-center text-muted-foreground py-8">No hay ventas registradas</p>
                    )}
                </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
