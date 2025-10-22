"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function DatabaseErrorBanner() {
  const [hasError, setHasError] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const checkDatabase = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { error } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single()

        if (error && error.message.includes("infinite recursion")) {
          setHasError(true)
        }
      }
    }

    checkDatabase()
  }, [])

  if (!hasError || isDismissed) return null

  return (
    <Alert className="border-red-500 bg-red-50 mb-6">
      <AlertTriangle className="h-5 w-5 text-red-600" />
      <AlertTitle className="text-red-900 font-bold">⚠️ Configuración de Base de Datos Requerida</AlertTitle>
      <AlertDescription className="text-red-800 mt-2">
        <p className="mb-3">
          La base de datos necesita ser configurada para que la aplicación funcione correctamente. Debes ejecutar un
          script SQL en Supabase.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" asChild>
            <Link href="/database-error">
              Ver Instrucciones Detalladas
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsDismissed(true)}>
            Cerrar
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
