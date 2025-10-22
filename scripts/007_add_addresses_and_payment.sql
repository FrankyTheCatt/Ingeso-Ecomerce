-- Create user_addresses table
create table if not exists public.user_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  address text not null,
  phone text not null,
  country text not null default 'Chile',
  region text not null default 'Coquimbo',
  is_default boolean default false,
  created_at timestamp with time zone default now()
);

-- Create index for user addresses
create index if not exists idx_user_addresses_user on public.user_addresses(user_id);

-- Add payment method to sales table
alter table public.sales add column if not exists payment_method text;
alter table public.sales add column if not exists address_id uuid references public.user_addresses(id) on delete set null;
alter table public.sales add column if not exists delivery_address text;
alter table public.sales add column if not exists delivery_phone text;

-- Enable RLS on user_addresses
alter table public.user_addresses enable row level security;

-- Create policies for user_addresses
create policy "Users can view their own addresses"
  on public.user_addresses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own addresses"
  on public.user_addresses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own addresses"
  on public.user_addresses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own addresses"
  on public.user_addresses for delete
  using (auth.uid() = user_id);
