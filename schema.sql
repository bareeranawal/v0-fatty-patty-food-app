-- ==============================================
-- FATTY PATTY FOOD ORDERING SYSTEM - UNIFIED SCHEMA
-- ==============================================
-- This is the complete database schema combining all tables,
-- RLS policies, indexes, triggers, and functions.
-- ==============================================

-- 1. CATEGORIES TABLE
create table if not exists public.categories (
  id text primary key,
  name text not null,
  description text,
  image text not null,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.categories enable row level security;

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
  image_url text,
  is_popular boolean default false,
  is_featured boolean default false,
  is_available boolean default true,
  rating numeric(2,1) default 4.5,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.menu_items enable row level security;

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
  description text,
  items text[] not null, -- Array of item descriptions
  price integer not null,
  image text not null,
  image_url text,
  deal_type text default 'combo', -- discount, combo, bogo, bundle
  discount_percentage numeric(5,2),
  fixed_price numeric(10,2),
  is_active boolean default true,
  valid_from timestamptz,
  valid_until timestamptz,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.deals enable row level security;

create policy "deals_select_all" on public.deals 
  for select using (is_active = true);

-- 6. USERS TABLE
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  phone text,
  name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.users enable row level security;

create policy "users_select_own" on public.users 
  for select using (auth.uid() = id);

-- 7. ORDERS TABLE
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null, -- Human readable order number like FP-ABC123
  user_id uuid references public.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_address text,
  order_type text not null check (order_type in ('delivery', 'pickup')),
  delivery_area text,
  delivery_address text,
  pickup_branch text,
  items jsonb not null, -- Array of cart items with full details
  subtotal integer not null,
  delivery_fee integer default 0,
  total integer not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'picked_up', 'cancelled')),
  payment_method text,
  special_instructions text,
  notes text,
  estimated_time text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "orders_insert_all" on public.orders 
  for insert with check (true);

create policy "orders_select_by_number_phone" on public.orders 
  for select using (true);

-- 8. ORDER ITEMS TABLE
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id text references public.menu_items(id) on delete set null,
  item_name text not null,
  quantity integer not null,
  price integer not null,
  special_instructions text,
  created_at timestamptz default now()
);

alter table public.order_items enable row level security;

create policy "order_items_select_all" on public.order_items 
  for select using (true);

-- 9. ORDER STATUS HISTORY TABLE
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

-- 10. BRANCHES TABLE
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

-- 11. DELIVERY AREAS TABLE
create table if not exists public.delivery_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.delivery_areas enable row level security;

create policy "delivery_areas_select_all" on public.delivery_areas 
  for select using (is_active = true);

-- 12. ADMIN USERS TABLE
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  role text not null default 'admin' check (role in ('admin', 'super_admin')),
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.admin_users enable row level security;

create policy "admin_users_select_own" on public.admin_users 
  for select using (auth.uid() = id);

-- 13. MESSAGES TABLE
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "messages_insert_all" on public.messages 
  for insert with check (true);

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================
create index if not exists idx_menu_items_category on public.menu_items(category_id);
create index if not exists idx_menu_items_popular on public.menu_items(is_popular) where is_popular = true;
create index if not exists idx_menu_items_featured on public.menu_items(is_featured) where is_featured = true;
create index if not exists idx_menu_items_available on public.menu_items(is_available);
create index if not exists idx_deals_active on public.deals(is_active);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_number on public.orders(order_number);
create index if not exists idx_orders_phone on public.orders(customer_phone);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_created on public.orders(created_at desc);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_order_items_menu on public.order_items(menu_item_id);
create index if not exists idx_order_status_history_order on public.order_status_history(order_id);
create index if not exists idx_messages_read on public.messages(is_read);

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

drop trigger if exists trigger_users_updated on public.users;
create trigger trigger_users_updated
  before update on public.users
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

-- ==============================================
-- DEFAULT SEED DATA
-- ==============================================
insert into public.categories (id, name, description, image, sort_order) values
  ('beef-burgers', 'Beef Burgers', 'Delicious beef burger options', '/images/categories/beef.jpg', 1),
  ('chicken-burgers', 'Chicken Burgers', 'Crispy chicken burger selections', '/images/categories/chicken.jpg', 2),
  ('starters', 'Starters', 'Appetizers and starters', '/images/categories/starters.jpg', 3),
  ('fries', 'Fries', 'Crispy fries and sides', '/images/categories/fries.jpg', 4),
  ('bowls', 'Bowls', 'Healthy bowl options', '/images/categories/bowls.jpg', 5),
  ('pasta', 'Pasta', 'Pasta dishes', '/images/categories/pasta.jpg', 6),
  ('drinks', 'Drinks', 'Beverages', '/images/categories/drinks.jpg', 7)
on conflict (id) do nothing;
