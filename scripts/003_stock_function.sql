-- Create function to safely decrement stock
create or replace function public.decrement_stock(product_id uuid, quantity integer)
returns void
language plpgsql
as $$
begin
  update public.products
  set stock = stock - quantity
  where id = product_id and stock >= quantity;
  
  if not found then
    raise exception 'Insufficient stock for product %', product_id;
  end if;
end;
$$;
