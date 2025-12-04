"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, Plus, Trash2, Home, Phone, Star, ArrowLeft, Map } from "lucide-react"
import type { UserAddress } from "@/lib/types"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [newAddress, setNewAddress] = useState({
    address: "",
    phone: "",
  })

  useEffect(() => {
    checkUser()
    loadAddresses()
  }, [])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
    }
  }

  const loadAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) throw error
      setAddresses(data || [])
    } catch (error) {
      console.error("Error loading addresses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuario no autenticado")

      const { error } = await supabase.from("user_addresses").insert({
        user_id: user.id,
        address: newAddress.address,
        phone: newAddress.phone,
        country: "Chile",
        region: "Coquimbo",
        is_default: addresses.length === 0,
      })

      if (error) throw error

      setNewAddress({ address: "", phone: "" })
      setIsAddingAddress(false)
      loadAddresses()
    } catch (error) {
      console.error("Error adding address:", error)
      alert("Error al agregar dirección")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta dirección?")) return

    try {
      const { error } = await supabase.from("user_addresses").delete().eq("id", id)

      if (error) throw error
      loadAddresses()
    } catch (error) {
      console.error("Error deleting address:", error)
      alert("Error al eliminar dirección")
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuario no autenticado")

      // Remove default from all addresses
      await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", user.id)

      // Set new default
      const { error } = await supabase.from("user_addresses").update({ is_default: true }).eq("id", id)

      if (error) throw error
      loadAddresses()
    } catch (error) {
      console.error("Error setting default address:", error)
      alert("Error al establecer dirección predeterminada")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center max-w-5xl">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
           <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus direcciones de envío y preferencias</p>
        </div>
        <Button variant="outline" asChild>
             <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a la tienda
             </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
         {/* Main Content - Addresses */}
         <div className="space-y-6">
            <Card className="border-muted shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Mis Direcciones
                        </CardTitle>
                        <CardDescription>
                            Direcciones guardadas para tus envíos
                        </CardDescription>
                    </div>
                    {!isAddingAddress && (
                        <Button onClick={() => setIsAddingAddress(true)} size="sm" className="shadow-sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Dirección
                        </Button>
                    )}
                </CardHeader>
                <Separator />
                <CardContent className="p-6">
                    {isAddingAddress && (
                        <div className="mb-8 bg-muted/30 p-6 rounded-lg border border-dashed border-primary/50 animate-in fade-in zoom-in-95 duration-300">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-semibold text-lg">Agregar Nueva Dirección</h3>
                                <Button variant="ghost" size="sm" onClick={() => setIsAddingAddress(false)} className="h-8 w-8 p-0">
                                    <span className="sr-only">Cerrar</span>
                                    <Plus className="h-4 w-4 rotate-45" />
                                </Button>
                            </div>
                            <form onSubmit={handleAddAddress} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-sm font-medium">Dirección Completa</Label>
                                    <div className="relative">
                                        <Map className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="address"
                                            required
                                            value={newAddress.address}
                                            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                            placeholder="Ej: Av. Siempre Viva 742, Springfield"
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium">Teléfono de Contacto</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            required
                                            value={newAddress.phone}
                                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                            placeholder="Ej: +56 9 1234 5678"
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">País</Label>
                                        <div className="h-10 flex items-center px-3 rounded-md border bg-muted/50 text-sm text-muted-foreground">
                                            Chile
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Región</Label>
                                        <div className="h-10 flex items-center px-3 rounded-md border bg-muted/50 text-sm text-muted-foreground">
                                            Coquimbo
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button type="submit" disabled={isSaving} className="flex-1">
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Guardando...
                                            </>
                                        ) : (
                                            "Guardar Dirección"
                                        )}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setIsAddingAddress(false)}>
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {addresses.length === 0 && !isAddingAddress ? (
                        <div className="text-center py-12 px-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10">
                             <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <MapPin className="h-6 w-6 text-muted-foreground" />
                             </div>
                             <h3 className="text-lg font-medium mb-1">No tienes direcciones guardadas</h3>
                             <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
                                Agrega tu primera dirección para agilizar el proceso de compra y envío.
                             </p>
                             <Button onClick={() => setIsAddingAddress(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Dirección
                             </Button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {addresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    className={`relative flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border transition-all ${
                                        addr.is_default
                                            ? "border-primary/50 bg-primary/5 shadow-sm"
                                            : "border-muted hover:border-muted-foreground/30 hover:bg-muted/10"
                                    }`}
                                >
                                    <div className="flex gap-4 items-start mb-4 sm:mb-0">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                                            addr.is_default ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                                        }`}>
                                            {addr.is_default ? <Home className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-base">{addr.address}</p>
                                                {addr.is_default && (
                                                    <Badge variant="default" className="h-5 text-[10px] px-1.5">
                                                        <Star className="h-3 w-3 mr-1 fill-current" />
                                                        Principal
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                <Map className="h-3.5 w-3.5" />
                                                {addr.region}, {addr.country}
                                            </p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                <Phone className="h-3.5 w-3.5" />
                                                {addr.phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        {!addr.is_default && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleSetDefault(addr.id)}
                                                className="text-muted-foreground hover:text-primary"
                                            >
                                                Hacer principal
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteAddress(addr.id)}
                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Eliminar</span>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
         </div>

         {/* Sidebar - Quick Stats or Info */}
         <div className="space-y-6">
             <Card>
                 <CardHeader>
                     <CardTitle className="text-lg">Resumen</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                         <span className="text-sm text-muted-foreground">Direcciones</span>
                         <span className="font-bold text-lg">{addresses.length}</span>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Información Importante</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Tus direcciones se utilizan para calcular los costos de envío. Asegúrate de mantener actualizada tu dirección principal.
                        </p>
                    </div>
                 </CardContent>
             </Card>
         </div>
      </div>
    </div>
  )
}
