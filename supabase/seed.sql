-- 10 states + tint laws
-- pulled from state DMV pages and vehicle codes, early 2026

-- 1. states

insert into states (id, name, abbreviation, inspection_required, emissions_required) values
  ('a0000000-0000-0000-0000-000000000001', 'California',    'CA', false, true),
  ('a0000000-0000-0000-0000-000000000002', 'Texas',         'TX', true,  false),
  ('a0000000-0000-0000-0000-000000000003', 'Florida',       'FL', false, false),
  ('a0000000-0000-0000-0000-000000000004', 'New York',      'NY', true,  true),
  ('a0000000-0000-0000-0000-000000000005', 'Massachusetts', 'MA', true,  true),
  ('a0000000-0000-0000-0000-000000000006', 'Arizona',       'AZ', false, true),
  ('a0000000-0000-0000-0000-000000000007', 'Colorado',      'CO', false, true),
  ('a0000000-0000-0000-0000-000000000008', 'Georgia',       'GA', false, true),
  ('a0000000-0000-0000-0000-000000000009', 'Illinois',      'IL', false, true),
  ('a0000000-0000-0000-0000-000000000010', 'Virginia',      'VA', true,  true)
on conflict (abbreviation) do nothing;

-- 2. tint laws
-- VLT = min visible light transmission. null means no restriction.

insert into tint_laws (
  state_id, front_side_vlt, rear_side_vlt, rear_window_vlt,
  windshield_strip, reflective_allowed, medical_exemption,
  fine_first_offense, notes
) values

-- CALIFORNIA  (Cal. Veh. Code §26708)
-- Front sides: 70%, rear sides: any, rear: any, windshield: top 4 inches
(
  'a0000000-0000-0000-0000-000000000001',
  70, null, null,
  'Top 4 inches or AS-1 line',
  false, true,
  '$25 base fine + fees (~$197 total)',
  'CA is strict on front sides. Rear windows can be any darkness if vehicle has dual side mirrors. No metallic/reflective tint allowed.'
),

-- TEXAS  (Tex. Transp. Code §547.613)
-- Front sides: 25%, rear sides: 25%, rear: any, windshield: top 5 inches or AS-1
(
  'a0000000-0000-0000-0000-000000000002',
  25, 25, null,
  'Top 5 inches or AS-1 line',
  false, true,
  '$20–$200',
  'Texas allows 25% VLT on front and rear sides. Rear window can be any darkness if vehicle has side mirrors on both sides. Reflective tint not allowed above 25%.'
),

-- FLORIDA  (Fla. Stat. §316.2953, §316.2954)
-- Front sides: 28%, rear sides: 15%, rear: 15%, windshield: AS-1 line or top 5 inches
(
  'a0000000-0000-0000-0000-000000000003',
  28, 15, 15,
  'AS-1 line or top 5 inches',
  false, true,
  '$115 (non-moving violation)',
  'Florida is relatively lenient. Front sides 28% VLT, rear sides and rear window 15% VLT. No red, amber, or blue tint permitted.'
),

-- NEW YORK  (NY VTL §375 12-a)
-- Front sides: 70%, rear sides: 70%, rear: any, windshield: top 6 inches
(
  'a0000000-0000-0000-0000-000000000004',
  70, 70, null,
  'Top 6 inches',
  false, true,
  '$150 per window',
  'NY is one of the strictest states. 70% VLT on front and rear side windows. Rear window can be any darkness if vehicle has dual side mirrors. Commonly enforced during inspections.'
),

-- MASSACHUSETTS  (540 CMR 22.07)
-- Front sides: 35%, rear sides: 35%, rear: 35%, windshield: top 6 inches
(
  'a0000000-0000-0000-0000-000000000005',
  35, 35, 35,
  'Top 6 inches',
  false, true,
  '$250 first offense',
  'MA requires 35% VLT on all side and rear windows. Tint is checked during annual safety inspection. Non-reflective tint only.'
),

-- ARIZONA  (ARS §28-959.01)
-- Front sides: 33%, rear sides: any, rear: any, windshield: top 5 inches or AS-1
(
  'a0000000-0000-0000-0000-000000000006',
  33, null, null,
  'Top 5 inches or AS-1 line',
  false, true,
  '$100–$300',
  'Arizona is lenient on rear windows, any darkness allowed. Front sides must allow 33% VLT. No more than 35% reflectivity on any window.'
),

-- COLORADO  (CRS §42-4-227)
-- Front sides: 27%, rear sides: 27%, rear: 27%, windshield: top 4 inches
(
  'a0000000-0000-0000-0000-000000000007',
  27, 27, 27,
  'Top 4 inches',
  false, true,
  '$50–$100 + 4 points',
  'Colorado requires 27% VLT on all windows. Aftermarket tint on the windshield is only allowed on the top 4 inches. Points are assessed on your license.'
),

-- GEORGIA  (O.C.G.A. §40-8-73.1)
-- Front sides: 32%, rear sides: 32%, rear: 32%, windshield: top 6 inches (must be non-reflective)
(
  'a0000000-0000-0000-0000-000000000008',
  32, 32, 32,
  'Top 6 inches, non-reflective',
  false, true,
  '$25–$100',
  'Georgia requires at least 32% VLT on front side, rear side, and rear windows. Windshield tint limited to top 6 inches and must be non-reflective.'
),

-- ILLINOIS  (625 ILCS 5/12-503)
-- Front sides: 35%, rear sides: 35%, rear: any (SUV/van), windshield: top 6 inches or AS-1
(
  'a0000000-0000-0000-0000-000000000009',
  35, 35, null,
  'Top 6 inches or AS-1 line',
  false, true,
  '$50–$500',
  'Illinois requires 35% VLT on front and rear side windows for sedans. SUVs and vans may have any darkness on rear window. No reflective tint. Fines escalate for repeat offenses.'
),

-- VIRGINIA  (Va. Code §46.2-1052, §46.2-1053)
-- Front sides: 50%, rear sides: 35%, rear: 35%, windshield: AS-1 line only
(
  'a0000000-0000-0000-0000-000000000010',
  50, 35, 35,
  'AS-1 line only',
  false, true,
  '$110 first offense',
  'Virginia requires 50% VLT on front side windows and 35% on rear sides and rear window. Tint is checked during annual state inspection. Sun-screening devices prohibited.'
)

on conflict (state_id) do nothing;
