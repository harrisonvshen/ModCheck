-- 002: Tint laws per state
-- Stores minimum VLT% requirements for each window position

create table if not exists tint_laws (
  id                  uuid primary key default gen_random_uuid(),
  state_id            uuid not null references states (id) on delete cascade,
  front_side_vlt      integer,          -- min VLT% for front side windows
  rear_side_vlt       integer,          -- min VLT% for rear side windows (null = any)
  rear_window_vlt     integer,          -- min VLT% for rear window (null = any)
  windshield_strip    text,             -- e.g. "top 4 inches", "AS-1 line", "none"
  reflective_allowed  boolean not null default false,
  medical_exemption   boolean not null default true,
  fine_first_offense  text,
  notes               text,
  last_updated        timestamptz not null default now(),

  constraint fk_tint_state unique (state_id)
);

create index if not exists idx_tint_laws_state on tint_laws (state_id);
