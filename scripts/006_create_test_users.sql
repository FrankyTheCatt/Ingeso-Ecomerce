-- IMPORTANTE: Estos usuarios de prueba deben crearse manualmente en Supabase
-- debido a las restricciones de seguridad de auth.users

-- Para crear los usuarios, ve a tu proyecto de Supabase:
-- 1. Ve a Authentication > Users
-- 2. Click en "Add user" > "Create new user"
-- 3. Crea estos usuarios:

-- USUARIO ADMINISTRADOR:
-- Email: admin@noporolos.store
-- Password: Admin123!
-- Confirm password: true

-- USUARIO NORMAL:
-- Email: usuario@test.com
-- Password: Usuario123!
-- Confirm password: true

-- Después de crear los usuarios en la UI de Supabase, ejecuta este script
-- para asignarles roles (reemplaza los UUIDs con los IDs reales de los usuarios):

-- Nota: Para obtener los UUIDs de los usuarios, ejecuta:
-- SELECT id, email FROM auth.users WHERE email IN ('admin@noporolos.store', 'usuario@test.com');

-- Luego inserta los roles (reemplaza 'USER_ID_AQUI' con los UUIDs reales):
-- INSERT INTO user_roles (user_id, role) VALUES
-- ('UUID_DEL_ADMIN', 'admin'),
-- ('UUID_DEL_USUARIO', 'customer');

-- ALTERNATIVA: Si tienes acceso a la API de Supabase Admin, puedes usar este código:
-- (Este código debe ejecutarse desde un entorno con acceso al service_role_key)

/*
-- Crear usuario administrador
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@noporolos.store',
  crypt('Admin123!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  ''
);

-- Crear usuario normal
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'usuario@test.com',
  crypt('Usuario123!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  ''
);
*/
