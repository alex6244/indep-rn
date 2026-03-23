-- 01. PostgreSQL schema skeleton for MVP
-- Note: types/constraints можно подстроить под реальный schema и enum strategy.

create table users (
  id bigserial primary key,
  phone text not null unique,
  email text unique,
  password_hash text,
  name text not null,
  role text not null check (role in (''client'',''picker'')),
  status text not null default ''active'',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table refresh_tokens (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  token_hash text not null unique,
  device_id text,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table cars (
  id bigserial primary key,
  brand text not null,
  title text not null,
  price numeric not null,
  year int not null,
  mileage int not null,
  engine text,
  power int,
  drive_type text,
  address text,
  specs jsonb not null default ''{}'',
  filter_flags jsonb not null default ''{}'',
  status text not null default ''active'',
  created_at timestamptz not null default now()
);

create table car_media (
  id bigserial primary key,
  car_id bigint not null references cars(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  media_type text not null
);

create table reports (
  id bigserial primary key,
  car_id bigint not null references cars(id) on delete cascade,
  price numeric not null,
  title text not null,
  subtitle text,
  city text,
  cover_url text,
  carousel_urls jsonb not null default ''[]'',
  defects jsonb not null default ''{}'',
  pts_data jsonb not null default ''[]'',
  mileage_text text,
  owners jsonb not null default ''{}'',
  legal_cleanliness jsonb not null default ''{}'',
  commercial_usage jsonb not null default ''{}'',
  penalties jsonb not null default ''[]'',
  cost_estimation jsonb not null default ''{}'',
  year_text text,
  body_type_text text,
  created_at timestamptz not null default now()
);

create table report_purchases (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  report_id bigint not null references reports(id) on delete cascade,
  amount numeric,
  paid_at timestamptz,
  provider_ref text,
  created_at timestamptz not null default now(),
  unique(user_id, report_id)
);

create table favorites (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  car_id bigint not null references cars(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, car_id)
);

-- Indexes
create index idx_cars_brand_model_year_price_mileage on cars(brand, title, year, price, mileage);
create index idx_favorites_user_id on favorites(user_id);
create index idx_reports_car_id on reports(car_id);
create index idx_refresh_tokens_user_id on refresh_tokens(user_id);
