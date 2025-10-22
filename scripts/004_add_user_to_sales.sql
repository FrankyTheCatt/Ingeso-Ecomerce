-- Add user_id column to sales table to associate sales with registered users
alter table public.sales add column if not exists user_id uuid references auth.users(id) on delete set null;

-- Create index for better performance when querying user sales
create index if not exists idx_sales_user on public.sales(user_id);

-- Create index for email lookups (for associating past purchases)
create index if not exists idx_sales_email on public.sales(customer_email);
