"use client"

import Link from "next/link"
import { ShoppingCart, Store, User, LogOut, Settings, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/lib/cart-context"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function StoreHeader() {
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)

      if (user) {
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("[v0] Error fetching user role:", error.message)
              if (error.message.includes("infinite recursion")) {
                console.error("[v0] Database configuration error. Please run scripts/009_fix_recursion_completely.sql")
              }
              setIsAdmin(false)
            } else {
              setIsAdmin(data?.role === "admin")
            }
          })
          .catch((err) => {
            console.error("[v0] Exception fetching user role:", err)
            setIsAdmin(false)
          })
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("[v0] Error fetching user role:", error.message)
              setIsAdmin(false)
            } else {
              setIsAdmin(data?.role === "admin")
            }
          })
          .catch((err) => {
            console.error("[v0] Exception fetching user role:", err)
            setIsAdmin(false)
          })
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">noporolos store</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Productos
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Mi Cuenta
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/my-orders">Mis Compras</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <MapPin className="h-4 w-4 mr-2" />
                    Mis Direcciones
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Settings className="h-4 w-4 mr-2" />
                        Panel Admin
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">
                <User className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Link>
            </Button>
          )}
          <Link href="/cart" className="relative">
            <Button variant="outline" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
