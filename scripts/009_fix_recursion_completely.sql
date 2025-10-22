-- ============================================
-- SCRIPT PARA CORREGIR RECURSIÓN INFINITA EN user_roles
-- ============================================
-- Este script elimina todas las políticas problemáticas
-- y crea políticas simples que no causan recursión

-- Paso 1: Eliminar TODAS las políticas existentes
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON user_roles;
DROP POLICY IF EXISTS "users_select_own_role" ON user_roles;
DROP POLICY IF EXISTS "service_role_all" ON user_roles;

-- Paso 2: Eliminar funciones problemáticas
DROP FUNCTION IF EXISTS is_admin();

-- Paso 3: Crear política simple para SELECT
-- Esta política permite a cada usuario ver SOLO su propio rol
-- No causa recursión porque solo verifica auth.uid() = user_id
CREATE POLICY "users_can_read_own_role"
  ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Paso 4: Permitir INSERT/UPDATE/DELETE para usuarios autenticados
-- En producción, estas operaciones deberían hacerse con service_role
-- pero para desarrollo permitimos operaciones básicas
CREATE POLICY "authenticated_users_can_insert"
  ON user_roles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authenticated_users_can_update_own"
  ON user_roles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Nota: No permitimos DELETE para mayor seguridad
-- Si necesitas eliminar roles, usa el service_role key desde el backend

-- Verificar que RLS esté habilitado
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Políticas RLS corregidas exitosamente. Ya no debería haber recursión infinita.';
END $$;
