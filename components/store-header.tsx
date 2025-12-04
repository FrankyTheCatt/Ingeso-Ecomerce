"use client"

import Link from "next/link"
import { ShoppingCart, Store, User, LogOut, Settings, MapPin, Search, Menu, X, Package, Heart, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/lib/cart-context"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function StoreHeader() {
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) checkAdminStatus(supabase, user.id)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkAdminStatus(supabase, session.user.id)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async (supabase: any, userId: string) => {
    try {
      const response = await supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle()
      setIsAdmin(response.data?.role === "admin")
    } catch (err) {
      console.error("Could not check admin status:", err)
      setIsAdmin(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-voodoo-50/80 dark:bg-voodoo-950/80 backdrop-blur-md border-b border-voodoo-200 dark:border-voodoo-800 shadow-sm"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-voodoo-900 dark:text-voodoo-50">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-voodoo-50 dark:bg-voodoo-950 border-r border-voodoo-200 dark:border-voodoo-800">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/" className="text-lg font-semibold text-voodoo-900 dark:text-voodoo-50 hover:text-voodoo-600">
                  Inicio
                </Link>
                <Link href="/products" className="text-lg font-semibold text-voodoo-900 dark:text-voodoo-50 hover:text-voodoo-600">
                  Catálogo
                </Link>
                <Link href="/about" className="text-lg font-semibold text-voodoo-900 dark:text-voodoo-50 hover:text-voodoo-600">
                  Nosotros
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-voodoo-600 text-white p-1.5 rounded-lg group-hover:bg-voodoo-700 transition-colors">
              <Store className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-voodoo-800 to-voodoo-600 dark:from-voodoo-100 dark:to-voodoo-400">
              noporolos store
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-voodoo-900 dark:text-voodoo-100 hover:text-voodoo-600 dark:hover:text-voodoo-400 transition-colors">
            Inicio
          </Link>
          <Link href="/products" className="text-sm font-medium text-voodoo-900 dark:text-voodoo-100 hover:text-voodoo-600 dark:hover:text-voodoo-400 transition-colors">
            Catálogo
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-voodoo-700 dark:text-voodoo-300 hover:bg-voodoo-100 dark:hover:bg-voodoo-900 rounded-full">
            <Search className="h-5 w-5" />
          </Button>

          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" className="text-voodoo-700 dark:text-voodoo-300 hover:bg-voodoo-100 dark:hover:bg-voodoo-900 rounded-full">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-voodoo-600 text-white text-[10px] font-bold rounded-full shadow-sm border-2 border-white dark:border-voodoo-950">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full px-2 hover:bg-voodoo-100 dark:hover:bg-voodoo-900 gap-2 ml-2">
                  <Avatar className="h-8 w-8 border border-voodoo-200 dark:border-voodoo-700">
                    <AvatarFallback className="bg-voodoo-100 text-voodoo-700 dark:bg-voodoo-900 dark:text-voodoo-300 font-bold text-xs">
                      {user.email?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 bg-white dark:bg-voodoo-950 border-voodoo-200 dark:border-voodoo-800 shadow-lg rounded-xl mt-2">
                <div className="px-4 py-3 bg-voodoo-50 dark:bg-voodoo-900/50 rounded-lg mb-2">
                  <p className="text-sm font-bold text-voodoo-900 dark:text-voodoo-50">Mi Cuenta</p>
                  <p className="text-xs text-voodoo-500 truncate">{user.email}</p>
                </div>
                
                <div className="space-y-1">
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-voodoo-50 dark:focus:bg-voodoo-900 py-2.5">
                    <Link href="/my-orders" className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-voodoo-500" />
                        <span>Mis Compras</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-voodoo-300" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-voodoo-50 dark:focus:bg-voodoo-900 py-2.5">
                    <Link href="/profile" className="flex items-center justify-between w-full">
                       <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-voodoo-500" />
                        <span>Direcciones</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-voodoo-300" />
                    </Link>
                  </DropdownMenuItem>
                </div>

                {isAdmin && (
                  <>
                    <DropdownMenuSeparator className="my-2 bg-voodoo-100 dark:bg-voodoo-800" />
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-voodoo-50 dark:focus:bg-voodoo-900 py-2.5 text-voodoo-700 font-medium">
                      <Link href="/admin" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Panel Admin
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator className="my-2 bg-voodoo-100 dark:bg-voodoo-800" />
                
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/30 text-red-600 focus:text-red-600 py-2.5">
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="rounded-full bg-voodoo-900 text-white hover:bg-voodoo-800 dark:bg-voodoo-100 dark:text-voodoo-950 px-6 shadow-md ml-2">
              <Link href="/auth/login">
                Acceder
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
