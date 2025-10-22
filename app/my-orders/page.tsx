import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/format"
import { Package, Calendar } from "lucide-react"

export default async function MyOrdersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get sales associated with this user's ID or email
  const { data: sales } = await supabase
    .from("sales")
    .select(
      `
      *,
      sale_items (
        *
      )
    `,
    )
    .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
    .order("created_at", { ascending: false })

  // Update sales that match email but don't have user_id yet
  if (sales && sales.length > 0) {
    const salesToUpdate = sales.filter((sale) => !sale.user_id && sale.customer_email === user.email)
    if (salesToUpdate.length > 0) {
      await supabase
        .from("sales")
        .update({ user_id: user.id })
        .in(
          "id",
          salesToUpdate.map((s) => s.id),
        )
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mis Compras</h1>
        <p className="text-muted-foreground">Historial de tus pedidos en noporolos store</p>
      </div>

      {!sales || sales.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No tienes compras aún</h2>
            <p className="text-muted-foreground text-center">Cuando realices una compra, aparecerá aquí</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sales.map((sale) => (
            <Card key={sale.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pedido #{sale.id.slice(0, 8)}</CardTitle>
                  <Badge variant={sale.status === "completed" ? "default" : "secondary"}>
                    {sale.status === "completed" ? "Completado" : sale.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(sale.created_at).toLocaleDateString("es-CL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {sale.sale_items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.product_name} x{item.quantity}
                      </span>
                      <span className="font-medium">{formatPrice(item.price_at_sale * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">{formatPrice(sale.total)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
