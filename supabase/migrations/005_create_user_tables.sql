-- 005: User profiles, vehicles, and mods

-- User profiles (linked to Supabase Auth)
create table if not exists user_profiles (
  id                uuid primary key,   -- matches auth.users.id
  email             text not null,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro')),
  created_at        timestamptz not null default now()
);

-- User vehicles
create table if not exists user_vehicles (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references user_profiles (id) on delete cascade,
  year      integer not null,
  make      text not null,
  model     text not null,
  gvwr      integer,                    -- gross vehicle weight rating (lbs)
  created_at timestamptz not null default now()
);

create index if not exists idx_user_vehicles_user on user_vehicles (user_id);

-- User mods (flexible JSONB for mod details)
create table if not exists user_mods (
  id            uuid primary key default gen_random_uuid(),
  vehicle_id    uuid not null references user_vehicles (id) on delete cascade,
  mod_category  text not null check (mod_category in ('tint', 'exhaust', 'suspension')),
  mod_details   jsonb not null default '{}',
  created_at    timestamptz not null default now(),

  -- One mod entry per category per vehicle
  constraint uq_vehicle_mod unique (vehicle_id, mod_category)
);

create index if not exists idx_user_mods_vehicle on user_mods (vehicle_id);
