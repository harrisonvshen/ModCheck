-- ============================================================
-- Tint law corrections based on 2026 DMV/state code verification
-- Run this in Supabase SQL Editor.
-- ============================================================

-- TEXAS: Rear side windows have NO VLT restriction when the
-- vehicle has dual outside mirrors (the default for modern cars).
-- Previously set to 25, correcting to null (any darkness allowed).
update tint_laws
set rear_side_vlt = null,
    notes = 'Texas allows 25% VLT on front sides. Rear side windows and rear window can be any darkness provided the vehicle has dual outside mirrors (standard on all modern vehicles). No reflective tint above 25%.',
    last_updated = now()
where state_id = 'a0000000-0000-0000-0000-000000000002';

-- ILLINOIS: Rear window requires 35% VLT for sedans (was null).
-- SUVs/vans/trucks can have any darkness, but we use the stricter
-- sedan rule to be safe.
update tint_laws
set rear_window_vlt = 35,
    notes = 'Illinois requires 35% VLT on front sides, rear sides, AND rear window for sedans. SUVs, vans, and trucks may have any darkness on rear windows. If your vehicle is a sedan, rear window must be at least 35% VLT. No reflective tint.',
    last_updated = now()
where state_id = 'a0000000-0000-0000-0000-000000000009';
