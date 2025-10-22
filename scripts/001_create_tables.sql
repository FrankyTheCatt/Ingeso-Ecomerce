-- Create categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamp with time zone default now()
);

-- Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  stock integer not null default 0,
  category_id uuid references public.categories(id) on delete set null,
  image_url text,
  created_at timestamp with time zone default now()
);

-- Create sales table
create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  total numeric(10, 2) not null,
  status text not null default 'completed',
  customer_name text,
  customer_email text,
  created_at timestamp with time zone default now()
);

-- Create sale_items table
create table if not exists public.sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid references public.sales(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null,
  price_at_sale numeric(10, 2) not null,
  created_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_sale_items_sale on public.sale_items(sale_id);
create index if not exists idx_sales_created on public.sales(created_at);
