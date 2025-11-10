-- Eliminar la política problemática que causa recursión infinita
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;

-- La política "Users can view their own role" es suficiente
-- Los usuarios (incluyendo admins) pueden ver su propio rol sin recursión
-- Esto permite que la función isAdmin() funcione correctamente

-- Agregar política para que los admins puedan insertar roles
-- Usamos una función de seguridad que no causa recursión
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Política para que solo admins puedan insertar/actualizar roles
CREATE POLICY "Only admins can manage roles"
  ON user_roles
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
