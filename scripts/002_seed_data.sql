-- Insert sample categories
insert into public.categories (name, description) values
  ('Útiles Escolares', 'Cuadernos, lápices, y materiales de escritura'),
  ('Tecnología', 'Accesorios tecnológicos para estudiantes'),
  ('Libros', 'Libros de texto y literatura'),
  ('Snacks', 'Comida y bebidas para el campus')
on conflict do nothing;

-- Insert sample products with Chilean prices
insert into public.products (name, description, price, stock, category_id, image_url)
select 
  'Cuaderno Universitario 100 hojas',
  'Cuaderno de tapa dura con 100 hojas cuadriculadas',
  2990,
  50,
  (select id from public.categories where name = 'Útiles Escolares' limit 1),
  '/placeholder.svg?height=400&width=400'
union all select
  'Set de Lápices Faber-Castell',
  'Set de 12 lápices de colores profesionales',
  5990,
  30,
  (select id from public.categories where name = 'Útiles Escolares' limit 1),
  '/placeholder.svg?height=400&width=400'
union all select
  'Mouse Inalámbrico',
  'Mouse inalámbrico ergonómico para laptop',
  12990,
  25,
  (select id from public.categories where name = 'Tecnología' limit 1),
  '/placeholder.svg?height=400&width=400'
union all select
  'Audífonos Bluetooth',
  'Audífonos inalámbricos con cancelación de ruido',
  29990,
  15,
  (select id from public.categories where name = 'Tecnología' limit 1),
  '/placeholder.svg?height=400&width=400'
union all select
  'Pendrive 32GB',
  'Memoria USB 3.0 de alta velocidad',
  8990,
  40,
  (select id from public.categories where name = 'Tecnología' limit 1),
  '/placeholder.svg?height=400&width=400'
union all select
  'Calculadora Científica',
  'Calculadora científica Casio FX-991',
  19990,
  20,
  (select id from public.categories where name = 'Útiles Escolares' limit 1),
  '/placeholder.svg?height=400&width=400'
union all select
  'Mochila Universitaria',
  'Mochila con compartimento para laptop 15"',
  24990,
  18,
  (select id from public.categories where name = 'Útiles Escolares' limit 1),
  '/placeholder.svg?height=400&width=400'
union all select
  'Libro: Cálculo Vol. 1',
  'Libro de cálculo diferencial e integral',
  35990,
  12,
  (select id from public.categories where name = 'Libros' limit 1),
  '/placeholder.svg?height=400&width=400'
union all select
  'Café Instantáneo Pack 10',
  'Pack de 10 sobres de café instantáneo',
  3990,
  60,
  (select id from public.categories where name = 'Snacks' limit 1),
  '/placeholder.svg?height=400&width=400'
union all select
  'Barras de Cereal x6',
  'Pack de 6 barras de cereal con chocolate',
  2490,
  80,
  (select id from public.categories where name = 'Snacks' limit 1),
  '/placeholder.svg?height=400&width=400'
on conflict do nothing;
