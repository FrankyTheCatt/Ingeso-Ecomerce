"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin, Plus, Trash2 } from "lucide-react"
import type { UserAddress } from "@/lib/types"
import { useRouter } from "next/navigation"

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
      console.error("[v0] Error loading addresses:", error)
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
      console.error("[v0] Error adding address:", error)
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
      console.error("[v0] Error deleting address:", error)
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
      console.error("[v0] Error setting default address:", error)
      alert("Error al establecer dirección predeterminada")
    }
  }

  if (isLoading) {
    return (
      <div className="container py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

      <div className="max-w-3xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Mis Direcciones
            </CardTitle>
            {!isAddingAddress && (
              <Button onClick={() => setIsAddingAddress(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Dirección
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isAddingAddress && (
              <Card className="border-2 border-primary">
                <CardContent className="pt-6">
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        required
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        placeholder="Calle Principal 123, Depto 4B"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono de Contacto</Label>
                      <Input
                        id="phone"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
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

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSaving}>
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
                </CardContent>
              </Card>
            )}

            {addresses.length === 0 && !isAddingAddress ? (
              <p className="text-muted-foreground text-center py-8">
                No tienes direcciones guardadas. Agrega una para facilitar tus compras.
              </p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <Card key={addr.id} className={addr.is_default ? "border-primary" : ""}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          {addr.is_default && (
                            <span className="text-xs font-medium text-primary">Dirección Predeterminada</span>
                          )}
                          <p className="font-medium">{addr.address}</p>
                          <p className="text-sm text-muted-foreground">
                            {addr.region}, {addr.country}
                          </p>
                          <p className="text-sm text-muted-foreground">Tel: {addr.phone}</p>
                        </div>
                        <div className="flex gap-2">
                          {!addr.is_default && (
                            <Button variant="outline" size="sm" onClick={() => handleSetDefault(addr.id)}>
                              Predeterminada
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(addr.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
