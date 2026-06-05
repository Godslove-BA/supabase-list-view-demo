-- Seed for supabase-list-view-demo
-- Run in the Supabase SQL editor of any free-tier project.
-- Creates `orders` (5,000 rows) and `events` (20,000 rows) with public-read RLS so the
-- frontend's anon key can read them. Drop the tables first if you want to re-seed.

create table public.orders (
  id bigint generated always as identity primary key,
  order_number text unique not null,
  customer_name text not null,
  customer_email text not null,
  total_cents int not null,
  currency text default 'USD',
  status text check (status in ('paid','pending','failed','refunded')) not null,
  payment_method text,
  shipping_city text,
  shipping_country text,
  items_count int not null,
  notes text,
  created_at timestamptz default now()
);

insert into public.orders (order_number, customer_name, customer_email, total_cents, status, payment_method, shipping_city, shipping_country, items_count, notes, created_at)
select
  '#' || lpad((1000 + g)::text, 6, '0'),
  (array['Sarah Chen','Marcus Liu','Jordan Park','Priya Iyer','Tom Reyes','Alex Kim','Maya Patel','Noah Garcia','Iris Wang','Ben Singh'])[1 + (g % 10)],
  lower((array['sarah','marcus','jordan','priya','tom','alex','maya','noah','iris','ben'])[1 + (g % 10)] || g) || '@example.com',
  (50 + (g * 7) % 50000),
  (array['paid','paid','paid','paid','pending','failed','refunded'])[1 + (g % 7)],
  (array['stripe','paypal','card'])[1 + (g % 3)],
  (array['NYC','SF','LA','Chicago','Austin','Seattle','Boston','Denver','Atlanta','Miami'])[1 + (g % 10)],
  (array['US','US','US','CA','MX','UK','DE','FR','JP','AU'])[1 + (g % 10)],
  1 + (g % 5),
  case when g % 8 = 0 then 'Gift wrap requested' when g % 12 = 0 then 'Express shipping' else null end,
  now() - (g || ' minutes')::interval
from generate_series(1, 5000) g;

create table public.events (
  id bigint generated always as identity primary key,
  event_type text not null,
  session_id text not null,
  metadata jsonb,
  occurred_at timestamptz default now()
);

insert into public.events (event_type, session_id, metadata, occurred_at)
select
  (array['page_view','button_click','form_submit','purchase','signup','logout','search','scroll_50','scroll_100','video_play'])[1 + (g % 10)],
  'sess_' || md5(g::text),
  jsonb_build_object('path', (array['/','/pricing','/docs','/blog','/login','/signup'])[1 + (g % 6)], 'duration_ms', 100 + (g % 5000)),
  now() - (g || ' seconds')::interval
from generate_series(1, 20000) g;

-- Demo only — let the anon key read both tables.
alter table public.orders enable row level security;
alter table public.events enable row level security;
create policy "demo public read" on public.orders for select using (true);
create policy "demo public read" on public.events for select using (true);
