import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/format"
import { Package, Calendar, Clock, CheckCircle2, XCircle, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: "Completado",
          className: "bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25 border-green-500/20",
          icon: CheckCircle2,
        }
      case "pending":
        return {
          label: "Pendiente",
          className: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/25 border-yellow-500/20",
          icon: Clock,
        }
      case "cancelled":
        return {
          label: "Cancelado",
          className: "bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-500/25 border-red-500/20",
          icon: XCircle,
        }
      default:
        return {
          label: status,
          className: "bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/25 border-blue-500/20",
          icon: Package,
        }
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Compras</h1>
          <p className="text-muted-foreground mt-1">Gestiona y revisa el historial de tus pedidos</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/products">
            Seguir Comprando
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {!sales || sales.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No tienes compras registradas</h2>
            <p className="text-muted-foreground max-w-sm mb-6">
              Parece que aún no has realizado ningún pedido. ¡Explora nuestros productos y encuentra lo que necesitas!
            </p>
            <Button asChild>
              <Link href="/products">Ver Productos</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {sales.map((sale) => {
            const statusConfig = getStatusConfig(sale.status)
            const StatusIcon = statusConfig.icon
            const date = new Date(sale.created_at)

            return (
              <Card key={sale.id} className="overflow-hidden transition-all hover:shadow-md border-muted">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">Pedido #{sale.id.slice(0, 8).toUpperCase()}</CardTitle>
                        <Badge variant="outline" className={`capitalize flex items-center gap-1 ${statusConfig.className}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {date.toLocaleDateString("es-CL", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        <span>
                          {date.toLocaleTimeString("es-CL", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Total del pedido</p>
                      <p className="text-2xl font-bold text-primary">{formatPrice(sale.total)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider text-xs">Detalles de productos</h4>
                    <div className="divide-y">
                      {sale.sale_items.map((item: any) => (
                        <div key={item.id} className="py-3 flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded bg-secondary/50 flex items-center justify-center text-secondary-foreground">
                               <Package className="h-5 w-5 opacity-50" />
                            </div>
                            <div>
                              <p className="font-medium group-hover:text-primary transition-colors">{item.product_name}</p>
                              <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-medium tabular-nums">
                            {formatPrice(item.price_at_sale * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
