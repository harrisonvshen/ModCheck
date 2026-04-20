-- 003: Exhaust laws per state

create table if not exists exhaust_laws (
  id                    uuid primary key default gen_random_uuid(),
  state_id              uuid not null references states (id) on delete cascade,
  max_decibels          integer,          -- max allowed dB (null = no specific limit)
  muffler_required      boolean not null default true,
  cat_delete_legal      boolean not null default false,
  straight_pipe_legal   boolean not null default false,
  measurement_method    text,             -- how dB is measured (distance, RPM)
  fine_first_offense    text,
  notes                 text,
  last_updated          timestamptz not null default now(),

  constraint fk_exhaust_state unique (state_id)
);

create index if not exists idx_exhaust_laws_state on exhaust_laws (state_id);
