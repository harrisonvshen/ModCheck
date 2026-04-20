-- 004: Suspension / lift laws per state

create table if not exists suspension_laws (
  id                      uuid primary key default gen_random_uuid(),
  state_id                uuid not null references states (id) on delete cascade,
  max_lift_inches         integer,          -- max allowed lift (null = no limit)
  max_bumper_height_front integer,          -- max front bumper height in inches
  max_bumper_height_rear  integer,          -- max rear bumper height in inches
  frame_height_limit      text,             -- frame height rules (often varies by GVWR)
  lowering_restrictions   text,             -- rules for lowered vehicles
  fine_first_offense      text,
  notes                   text,
  last_updated            timestamptz not null default now(),

  constraint fk_suspension_state unique (state_id)
);

create index if not exists idx_suspension_laws_state on suspension_laws (state_id);
