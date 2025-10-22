import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, MapPin, CreditCard } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const params = await searchParams
  const orderId = params.orderId

  if (!orderId) {
    redirect("/")
  }

  const supabase = await createClient()

  const { data: sale } = await supabase.from("sales").select("*, sale_items(*)").eq("id", orderId).single()

  if (!sale) {
    redirect("/")
  }

  return (
    <div className="container py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl">¡Pedido Confirmado!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-muted-foreground">
            <p>Gracias por tu compra, {sale.customer_name}</p>
            <p className="text-sm mt-1">Hemos enviado un correo de confirmación a {sale.customer_email}</p>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Detalles del Pedido</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Número de Orden:</span>
                <span className="font-mono">{sale.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fecha:</span>
                <span>{new Date(sale.created_at).toLocaleDateString("es-CL")}</span>
              </div>
            </div>
          </div>

          {sale.delivery_address && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Dirección de Entrega
              </h3>
              <div className="space-y-1 text-sm">
                <p>{sale.delivery_address}</p>
                <p className="text-muted-foreground">Coquimbo, Chile</p>
                <p className="text-muted-foreground">Tel: {sale.delivery_phone}</p>
              </div>
            </div>
          )}

          {sale.payment_method && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Método de Pago
              </h3>
              <div className="text-sm">
                <p className="capitalize">{sale.payment_method}</p>
                {sale.payment_method === "transferencia" && (
                  <div className="mt-3 p-4 bg-muted rounded-lg space-y-2">
                    <p className="font-medium">Datos para Transferencia:</p>
                    <p className="text-muted-foreground">Banco: Banco Estado</p>
                    <p className="text-muted-foreground">Cuenta Corriente: 12345678</p>
                    <p className="text-muted-foreground">RUT: 12.345.678-9</p>
                    <p className="text-muted-foreground">Nombre: noporolos store</p>
                    <p className="text-xs mt-2 text-amber-600">
                      Por favor envía el comprobante a contacto@noporolos.cl
                    </p>
                  </div>
                )}
                {sale.payment_method === "efectivo" && (
                  <p className="text-muted-foreground mt-1">Pago contra entrega</p>
                )}
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Productos</h3>
            <div className="space-y-2">
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

          <div className="border-t pt-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(sale.total)}</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button asChild className="flex-1">
              <Link href="/">Seguir Comprando</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
