"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { UserAddress } from "@/lib/types"

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    address: "",
    phone: "",
    paymentMethod: "efectivo" as "efectivo" | "transferencia",
    useExistingAddress: false,
    selectedAddressId: "",
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      setFormData((prev) => ({ ...prev, customerEmail: user.email || "" }))

      const { data: addressData } = await supabase
        .from("user_addresses")
        .select("*")
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false })

      if (addressData && addressData.length > 0) {
        setAddresses(addressData)
        const defaultAddress = addressData.find((a) => a.is_default) || addressData[0]
        setFormData((prev) => ({
          ...prev,
          useExistingAddress: true,
          selectedAddressId: defaultAddress.id,
          address: defaultAddress.address,
          phone: defaultAddress.phone,
        }))
      }
    }
    setIsLoadingAddresses(false)
  }

  const handleAddressChange = (addressId: string) => {
    const selectedAddr = addresses.find((a) => a.id === addressId)
    if (selectedAddr) {
      setFormData({
        ...formData,
        selectedAddressId: addressId,
        address: selectedAddr.address,
        phone: selectedAddr.phone,
      })
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
            <p className="text-muted-foreground mb-6">Agrega productos para comenzar tu compra</p>
            <Button asChild>
              <Link href="/">Ver productos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          paymentMethod: formData.paymentMethod,
          addressId: formData.useExistingAddress ? formData.selectedAddressId : null,
          deliveryAddress: formData.address,
          deliveryPhone: formData.phone,
          items: cart.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
          total: getCartTotal(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al procesar la venta")
      }

      const data = await response.json()
      clearCart()
      router.push(`/order-success?orderId=${data.saleId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar la venta")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Nombre Completo</Label>
                    <Input
                      id="customerName"
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Correo Electrónico</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      placeholder="juan@ejemplo.cl"
                      disabled={!!user}
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t pt-6">
                  <h3 className="font-semibold">Dirección de Entrega</h3>

                  {user && addresses.length > 0 && !isLoadingAddresses && (
                    <div className="space-y-3">
                      <RadioGroup
                        value={formData.useExistingAddress ? "existing" : "new"}
                        onValueChange={(value) =>
                          setFormData({ ...formData, useExistingAddress: value === "existing" })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="existing" id="existing" />
                          <Label htmlFor="existing">Usar dirección guardada</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="new" id="new" />
                          <Label htmlFor="new">Ingresar nueva dirección</Label>
                        </div>
                      </RadioGroup>

                      {formData.useExistingAddress && (
                        <RadioGroup value={formData.selectedAddressId} onValueChange={handleAddressChange}>
                          {addresses.map((addr) => (
                            <div key={addr.id} className="flex items-start space-x-2 p-3 border rounded-lg">
                              <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                              <Label htmlFor={addr.id} className="flex-1 cursor-pointer">
                                <div className="space-y-1">
                                  <p className="font-medium">{addr.address}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {addr.region}, {addr.country}
                                  </p>
                                  <p className="text-sm text-muted-foreground">Tel: {addr.phone}</p>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    </div>
                  )}

                  {(!user || !formData.useExistingAddress || addresses.length === 0) && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input
                          id="address"
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Calle Principal 123, Depto 4B"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono de Contacto</Label>
                        <Input
                          id="phone"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+56 9 1234 5678"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>País</Label>
                          <Input value="Chile" disabled />
                        </div>
                        <div className="space-y-2">
                          <Label>Región</Label>
                          <Input value="Coquimbo" disabled />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 border-t pt-6">
                  <h3 className="font-semibold">Método de Pago</h3>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      setFormData({ ...formData, paymentMethod: value as "efectivo" | "transferencia" })
                    }
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="efectivo" id="efectivo" />
                      <Label htmlFor="efectivo" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Efectivo</p>
                          <p className="text-sm text-muted-foreground">Pago contra entrega</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="transferencia" id="transferencia" />
                      <Label htmlFor="transferencia" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Transferencia Bancaria</p>
                          <p className="text-sm text-muted-foreground">
                            Recibirás los datos bancarios después de confirmar
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>}

                <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Confirmar Pedido"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
