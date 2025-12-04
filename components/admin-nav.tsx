"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Productos",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Ventas",
    href: "/admin/sales",
    icon: ShoppingCart,
  },
]

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <div className="sticky top-0 z-50 w-full border-b border-voodoo-200 dark:border-voodoo-800 bg-voodoo-50/95 dark:bg-voodoo-950/95 backdrop-blur supports-[backdrop-filter]:bg-voodoo-50/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between max-w-7xl">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex items-center gap-2 group">
            <div className="bg-voodoo-700 text-white p-1.5 rounded-lg group-hover:bg-voodoo-800 transition-colors">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-voodoo-900 dark:text-voodoo-50">noporolos admin</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    isActive 
                      ? "bg-voodoo-100 text-voodoo-900 dark:bg-voodoo-900 dark:text-voodoo-50" 
                      : "text-voodoo-600 dark:text-voodoo-400 hover:bg-voodoo-50 dark:hover:bg-voodoo-900/50 hover:text-voodoo-900 dark:hover:text-voodoo-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border border-voodoo-200 dark:border-voodoo-700">
                  <AvatarFallback className="bg-voodoo-100 text-voodoo-700 dark:bg-voodoo-900 dark:text-voodoo-300">AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  <Store className="mr-2 h-4 w-4" />
                  <span>Ver Tienda</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
