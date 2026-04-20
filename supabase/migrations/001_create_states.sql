-- 001: States reference table
-- Every US state with inspection/emissions flags

create table if not exists states (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  abbreviation  text not null unique check (length(abbreviation) = 2),
  inspection_required boolean not null default false,
  emissions_required  boolean not null default false
);

-- Index for fast lookups by abbreviation
create index if not exists idx_states_abbreviation on states (abbreviation);
