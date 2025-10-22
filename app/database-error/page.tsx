import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Terminal, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DatabaseErrorPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Alert className="mb-6 border-red-500 bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <AlertTitle className="text-red-900 text-lg">Error de Recursión Infinita Detectado</AlertTitle>
        <AlertDescription className="text-red-800 mt-2">
          Las políticas de seguridad de la base de datos necesitan ser corregidas para que la aplicación funcione
          correctamente.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Solución: Ejecutar Script SQL
          </CardTitle>
          <CardDescription>Sigue estos pasos para corregir el problema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                1
              </div>
              <div className="space-y-2 flex-1">
                <p className="font-medium">Abre tu proyecto de Supabase</p>
                <p className="text-sm text-muted-foreground">
                  Ve a{" "}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    supabase.com/dashboard
                  </a>{" "}
                  y selecciona tu proyecto
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                2
              </div>
              <div className="space-y-2 flex-1">
                <p className="font-medium">Abre el SQL Editor</p>
                <p className="text-sm text-muted-foreground">
                  En el menú lateral, haz clic en <strong>SQL Editor</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                3
              </div>
              <div className="space-y-2 flex-1">
                <p className="font-medium">Ejecuta el script de corrección</p>
                <p className="text-sm text-muted-foreground mb-2">Copia el contenido del archivo y ejecútalo:</p>
                <code className="block bg-muted p-3 rounded text-sm">scripts/009_fix_recursion_completely.sql</code>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="space-y-2 flex-1">
                <p className="font-medium">Recarga la aplicación</p>
                <p className="text-sm text-muted-foreground">
                  Una vez ejecutado el script, recarga esta página y el error debería estar resuelto
                </p>
              </div>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>¿Qué causa este error?</AlertTitle>
            <AlertDescription className="mt-2 text-sm">
              Las políticas de Row Level Security (RLS) en la tabla <code>user_roles</code> están configuradas de manera
              que crean un ciclo infinito al intentar verificar permisos. El script corrige esto eliminando las
              políticas problemáticas y creando políticas simples que no causan recursión.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button asChild>
              <Link href="/setup">Ver Guía Completa de Setup</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
