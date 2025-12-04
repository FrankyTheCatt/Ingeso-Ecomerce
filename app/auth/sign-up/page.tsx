"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Store, ArrowRight, CheckCircle2 } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/my-orders`,
        },
      })

      if (authError) throw authError

      if (authData.user?.id) {
        try {
          await fetch("/api/auth", { method: "POST" })
        } catch (err) {
          console.error("Error creating user role:", err)
        }
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-voodoo-50 dark:bg-voodoo-950 p-4">
        <div className="w-full max-w-md bg-white dark:bg-voodoo-900 rounded-2xl shadow-xl p-8 text-center space-y-6 border border-voodoo-100 dark:border-voodoo-800">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-voodoo-950 dark:text-voodoo-50">¡Cuenta Creada!</h2>
            <p className="text-muted-foreground">
              Hemos enviado un correo de confirmación a <span className="font-medium text-voodoo-900 dark:text-voodoo-100">{formData.email}</span>
            </p>
          </div>
          <Button asChild className="w-full h-12 text-base bg-voodoo-600 hover:bg-voodoo-700 text-white">
            <Link href="/auth/login">Ir a Iniciar Sesión</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Right Side - Image/Design (Inverted for variety) */}
      <div className="hidden lg:flex flex-1 bg-voodoo-900 relative overflow-hidden items-center justify-center p-12 order-2">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 -mt-20 -ml-20 w-96 h-96 rounded-full bg-voodoo-500/30 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 -mb-20 -mr-20 w-80 h-80 rounded-full bg-voodoo-400/20 blur-3xl"></div>
        
        <div className="relative z-10 text-center space-y-6 max-w-lg">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-white/20 mb-8">
            <Store className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight">Únete a la comunidad</h2>
          <p className="text-xl text-voodoo-200">Crea tu cuenta hoy y accede a ofertas exclusivas para estudiantes.</p>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 bg-white dark:bg-voodoo-950 order-1">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
             <Link href="/" className="inline-flex items-center gap-2 group mb-6">
                <div className="bg-voodoo-600 text-white p-2 rounded-xl group-hover:bg-voodoo-700 transition-colors shadow-lg shadow-voodoo-200 dark:shadow-none">
                  <Store className="h-8 w-8" />
                </div>
              </Link>
            <h1 className="text-3xl font-bold tracking-tight text-voodoo-950 dark:text-voodoo-50">Crear una cuenta</h1>
            <p className="text-muted-foreground mt-2">Completa tus datos para comenzar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-voodoo-900 dark:text-voodoo-100">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="nombre@ejemplo.com"
                className="h-12 bg-voodoo-50 dark:bg-voodoo-900/50 border-voodoo-200 dark:border-voodoo-800 focus:ring-voodoo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-voodoo-900 dark:text-voodoo-100">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="h-12 bg-voodoo-50 dark:bg-voodoo-900/50 border-voodoo-200 dark:border-voodoo-800 focus:ring-voodoo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-voodoo-900 dark:text-voodoo-100">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="h-12 bg-voodoo-50 dark:bg-voodoo-900/50 border-voodoo-200 dark:border-voodoo-800 focus:ring-voodoo-500"
              />
            </div>

            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-base font-semibold bg-voodoo-600 hover:bg-voodoo-700 text-white shadow-lg shadow-voodoo-500/20" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  Registrarse <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
            <Link href="/auth/login" className="font-semibold text-voodoo-600 hover:text-voodoo-500 hover:underline">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
