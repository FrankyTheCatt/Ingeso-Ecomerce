import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/format"
import { Package, ShoppingCart, TrendingUp, AlertCircle } from "lucide-react"
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de tu tienda</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockCount || 0}</div>
            <p className="text-xs text-muted-foreground">Productos con stock ≤ 5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SalesChart data={recentSalesData || []} />
        <TopProductsChart data={topProductsList} />
      </div>

      <CategorySalesChart data={categoryData} />
      {/* </CHANGE> */}

      <Card>
        <CardHeader>
          <CardTitle>Ventas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSales && recentSales.length > 0 ? (
              recentSales.map((sale: any) => (
                <div key={sale.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{sale.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{sale.customer_email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {sale.sale_items.length} producto(s) - {new Date(sale.created_at).toLocaleDateString("es-CL")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(sale.total)}</p>
                    <p className="text-xs text-muted-foreground">{sale.status}</p>
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
  )
}
