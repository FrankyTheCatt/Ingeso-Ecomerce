import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/format"
import { Badge } from "@/components/ui/badge"

export default async function AdminSalesPage() {
  const supabase = await createClient()

  const { data: sales } = await supabase
    .from("sales")
    .select("*, sale_items(*)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ventas</h1>
        <p className="text-muted-foreground">Historial completo de ventas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sales && sales.length > 0 ? (
              sales.map((sale: any) => (
                <div key={sale.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-lg">{sale.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{sale.customer_email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Orden: {sale.id.slice(0, 8).toUpperCase()} - {new Date(sale.created_at).toLocaleString("es-CL")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{formatPrice(sale.total)}</p>
                      <Badge variant="secondary" className="mt-1">
                        {sale.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium mb-2">Productos:</p>
                    <div className="space-y-1">
                      {sale.sale_items.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.product_name} x{item.quantity}
                          </span>
                          <span>{formatPrice(item.price_at_sale * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
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
