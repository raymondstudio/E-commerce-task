-- Run this in Supabase SQL editor.
-- It creates user-scoped wishlist and order APIs with RLS.

create table if not exists public.wishlist (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id integer not null,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total numeric(10, 2) not null,
  status text not null default 'Processing',
  payment_method text not null default 'card',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_name text not null,
  qty integer not null check (qty > 0),
  price numeric(10, 2) not null
);

create table if not exists public.newsletter_subscribers (
  email text primary key,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.wishlist enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy if not exists "Users can read own wishlist"
on public.wishlist for select
using (auth.uid() = user_id);

create policy if not exists "Users can insert own wishlist"
on public.wishlist for insert
with check (auth.uid() = user_id);

create policy if not exists "Users can delete own wishlist"
on public.wishlist for delete
using (auth.uid() = user_id);

create policy if not exists "Users can read own orders"
on public.orders for select
using (auth.uid() = user_id);

create policy if not exists "Users can insert own orders"
on public.orders for insert
with check (auth.uid() = user_id);

create policy if not exists "Users can read own order items"
on public.order_items for select
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_id and o.user_id = auth.uid()
  )
);

create policy if not exists "Users can insert order items for own orders"
on public.order_items for insert
with check (
  exists (
    select 1
    from public.orders o
    where o.id = order_id and o.user_id = auth.uid()
  )
);

create policy if not exists "Anyone can subscribe newsletter"
on public.newsletter_subscribers for insert
to anon, authenticated
with check (true);

create policy if not exists "Anyone can view newsletter rows"
on public.newsletter_subscribers for select
to anon, authenticated
using (true);

create policy if not exists "Anyone can update newsletter rows"
on public.newsletter_subscribers for update
to anon, authenticated
using (true)
with check (true);
