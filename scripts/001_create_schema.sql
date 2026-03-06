-- ==============================================
-- FATTY PATTY FOOD ORDERING SYSTEM - SCHEMA
-- ==============================================

-- 1. CATEGORIES TABLE
create table if not exists public.categories (
  id text primary key,
  name text not null,
  image text not null,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.categories enable row level security;

-- Anyone can read active categories
create policy "categories_select_all" on public.categories 
  for select using (is_active = true);

-- 2. MENU ITEMS TABLE
create table if not exists public.menu_items (
  id text primary key,
  name text not null,
  description text,
  price integer not null, -- Price in PKR (no decimals)
  category_id text not null references public.categories(id) on delete cascade,
  image text not null,
  is_popular boolean default false,
  rating numeric(2,1) default 4.5,
  is_available boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.menu_items enable row level security;

-- Anyone can read available menu items
create policy "menu_items_select_all" on public.menu_items 
  for select using (is_available = true);

-- 3. ADD-ONS TABLE
create table if not exists public.add_ons (
  id text primary key,
  name text not null,
  price integer not null default 0,
  category_type text not null, -- 'burger', 'basic', 'all'
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.add_ons enable row level security;

create policy "add_ons_select_all" on public.add_ons 
  for select using (is_active = true);

-- 4. DRINK OPTIONS TABLE
create table if not exists public.drink_options (
  id text primary key,
  name text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.drink_options enable row level security;

create policy "drink_options_select_all" on public.drink_options 
  for select using (is_active = true);

-- 5. DEALS TABLE
create table if not exists public.deals (
  id text primary key,
  name text not null,
  title text not null,
  items text[] not null, -- Array of item descriptions
  price integer not null,
  image text not null,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.deals enable row level security;

create policy "deals_select_all" on public.deals 
  for select using (is_active = true);

-- 6. ORDERS TABLE
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null, -- Human readable order number like FP-ABC123
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  order_type text not null check (order_type in ('delivery', 'pickup')),
  delivery_area text,
  delivery_address text,
  pickup_branch text,
  items jsonb not null, -- Array of cart items with full details
  subtotal integer not null,
  delivery_fee integer default 0,
  total integer not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'picked_up', 'cancelled')),
  special_instructions text,
  estimated_time text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;

-- Allow inserting orders without authentication (guest checkout)
create policy "orders_insert_all" on public.orders 
  for insert with check (true);

-- Allow reading orders by order_number and phone (for tracking)
create policy "orders_select_by_number_phone" on public.orders 
  for select using (true); -- We'll filter by order_number + phone in the app

-- 7. ORDER STATUS HISTORY TABLE (for tracking)
create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  notes text,
  created_at timestamptz default now()
);

alter table public.order_status_history enable row level security;

create policy "order_status_history_select_all" on public.order_status_history 
  for select using (true);

-- 8. BRANCHES TABLE
create table if not exists public.branches (
  id text primary key,
  name text not null,
  address text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.branches enable row level security;

create policy "branches_select_all" on public.branches 
  for select using (is_active = true);

-- 9. DELIVERY AREAS TABLE
create table if not exists public.delivery_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.delivery_areas enable row level security;

create policy "delivery_areas_select_all" on public.delivery_areas 
  for select using (is_active = true);

-- 10. ADMIN USERS TABLE (for admin dashboard access)
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  role text not null default 'admin' check (role in ('admin', 'super_admin')),
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.admin_users enable row level security;

-- Only authenticated users can check if they're admin
create policy "admin_users_select_own" on public.admin_users 
  for select using (auth.uid() = id);

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================
create index if not exists idx_menu_items_category on public.menu_items(category_id);
create index if not exists idx_menu_items_popular on public.menu_items(is_popular) where is_popular = true;
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_number on public.orders(order_number);
create index if not exists idx_orders_phone on public.orders(customer_phone);
create index if not exists idx_orders_created on public.orders(created_at desc);
create index if not exists idx_order_status_history_order on public.order_status_history(order_id);

-- ==============================================
-- FUNCTIONS
-- ==============================================

-- Function to generate order number
create or replace function generate_order_number()
returns text
language plpgsql
as $$
declare
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := 'FP-';
  i integer;
begin
  for i in 1..6 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  return result;
end;
$$;

-- Trigger to auto-generate order number
create or replace function set_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null then
    new.order_number := generate_order_number();
  end if;
  return new;
end;
$$;

drop trigger if exists trigger_set_order_number on public.orders;
create trigger trigger_set_order_number
  before insert on public.orders
  for each row
  execute function set_order_number();

-- Function to update timestamps
create or replace function update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Add update triggers
drop trigger if exists trigger_categories_updated on public.categories;
create trigger trigger_categories_updated
  before update on public.categories
  for each row
  execute function update_updated_at();

drop trigger if exists trigger_menu_items_updated on public.menu_items;
create trigger trigger_menu_items_updated
  before update on public.menu_items
  for each row
  execute function update_updated_at();

drop trigger if exists trigger_deals_updated on public.deals;
create trigger trigger_deals_updated
  before update on public.deals
  for each row
  execute function update_updated_at();

drop trigger if exists trigger_orders_updated on public.orders;
create trigger trigger_orders_updated
  before update on public.orders
  for each row
  execute function update_updated_at();

-- Function to log order status changes
create or replace function log_order_status_change()
returns trigger
language plpgsql
as $$
begin
  if old.status is distinct from new.status then
    insert into public.order_status_history (order_id, status)
    values (new.id, new.status);
  end if;
  return new;
end;
$$;

drop trigger if exists trigger_order_status_change on public.orders;
create trigger trigger_order_status_change
  after update on public.orders
  for each row
  execute function log_order_status_change();
