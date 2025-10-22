import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, CheckCircle2, AlertTriangle } from "lucide-react"

export default function SetupPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Configuración de Usuarios de Prueba</h1>
        <p className="text-muted-foreground">
          Sigue estos pasos para crear los usuarios de prueba en tu proyecto de Supabase
        </p>
      </div>

      <Alert className="mb-6 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-900">
          <strong>IMPORTANTE:</strong> Si ves errores de "infinite recursion", ejecuta primero el script
          009_fix_recursion_completely.sql
        </AlertDescription>
      </Alert>

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Estos pasos deben realizarse en el dashboard de Supabase debido a restricciones de seguridad
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">Paso 0: Corregir Políticas RLS (Si hay errores)</CardTitle>
            <CardDescription className="text-orange-700">
              Ejecuta este script si ves errores de recursión infinita
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm mb-2 text-orange-900">
                Ve a tu proyecto de Supabase → <strong>SQL Editor</strong> y ejecuta el script:
              </p>
              <code className="block bg-white p-4 rounded-lg text-sm border border-orange-200">
                scripts/009_fix_recursion_completely.sql
              </code>
              <p className="text-xs mt-2 text-orange-700">
                Este script elimina las políticas problemáticas y crea políticas simples sin recursión
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paso 1: Ejecutar Script de Roles</CardTitle>
            <CardDescription>Crea la tabla de roles de usuarios (si no existe)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm mb-2">
                Ve a tu proyecto de Supabase → <strong>SQL Editor</strong> y ejecuta el script:
              </p>
              <code className="block bg-muted p-4 rounded-lg text-sm">scripts/005_create_user_roles.sql</code>
              <p className="text-xs mt-2 text-muted-foreground">
                Si ya ejecutaste este script antes, puedes omitir este paso
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paso 2: Crear Usuario Administrador</CardTitle>
            <CardDescription>Crea el usuario con permisos de administrador</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm mb-3">
                Ve a <strong>Authentication → Users → Add user → Create new user</strong>
              </p>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Email:</p>
                    <code className="text-sm">admin@noporolos.store</code>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Password:</p>
                    <code className="text-sm">Admin123!</code>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Auto Confirm User:</p>
                    <code className="text-sm">✓ Activado</code>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paso 3: Crear Usuario Normal</CardTitle>
            <CardDescription>Crea un usuario de prueba sin permisos de administrador</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm mb-3">Repite el proceso anterior con estos datos:</p>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Email:</p>
                    <code className="text-sm">usuario@test.com</code>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Password:</p>
                    <code className="text-sm">Usuario123!</code>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Auto Confirm User:</p>
                    <code className="text-sm">✓ Activado</code>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paso 4: Asignar Roles</CardTitle>
            <CardDescription>Asigna los roles a los usuarios creados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm mb-3">
                Ve al <strong>SQL Editor</strong> y ejecuta este query para obtener los IDs de los usuarios:
              </p>
              <code className="block bg-muted p-4 rounded-lg text-sm mb-4">
                SELECT id, email FROM auth.users <br />
                WHERE email IN ('admin@noporolos.store', 'usuario@test.com');
              </code>

              <p className="text-sm mb-3">Luego ejecuta este query reemplazando los UUIDs con los IDs obtenidos:</p>
              <code className="block bg-muted p-4 rounded-lg text-sm">
                INSERT INTO user_roles (user_id, role) VALUES
                <br />
                ('UUID_DEL_ADMIN_AQUI', 'admin'),
                <br />
                ('UUID_DEL_USUARIO_AQUI', 'customer');
              </code>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">¡Listo!</CardTitle>
            <CardDescription className="text-green-700">
              Ahora puedes usar estos usuarios para probar la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-green-900">
              <p>
                <strong>Admin:</strong> Puede acceder al panel de administrador en <code>/admin</code>
              </p>
              <p>
                <strong>Usuario:</strong> Puede comprar productos y ver sus órdenes en <code>/my-orders</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
