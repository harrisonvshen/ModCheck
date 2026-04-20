-- ============================================================
-- Seed: Remaining 40 US states + their tint laws
-- ⚠️  IMPORTANT: These values are compiled from state vehicle codes
--    as of early 2026. Verify against current DMV sources before
--    production launch. Laws change, some states updated in 2024-2025.
-- ============================================================

-- ────────────────────────────────────────────
-- 1. Insert remaining 40 states
-- ────────────────────────────────────────────
-- Already seeded: CA, TX, FL, NY, MA, AZ, CO, GA, IL, VA

insert into states (id, name, abbreviation, inspection_required, emissions_required) values
  ('a0000000-0000-0000-0000-000000000011', 'Alabama',        'AL', false, false),
  ('a0000000-0000-0000-0000-000000000012', 'Alaska',         'AK', false, false),
  ('a0000000-0000-0000-0000-000000000013', 'Arkansas',       'AR', false, false),
  ('a0000000-0000-0000-0000-000000000014', 'Connecticut',    'CT', true,  true),
  ('a0000000-0000-0000-0000-000000000015', 'Delaware',       'DE', true,  true),
  ('a0000000-0000-0000-0000-000000000016', 'Hawaii',         'HI', true,  false),
  ('a0000000-0000-0000-0000-000000000017', 'Idaho',          'ID', false, false),
  ('a0000000-0000-0000-0000-000000000018', 'Indiana',        'IN', false, false),
  ('a0000000-0000-0000-0000-000000000019', 'Iowa',           'IA', false, false),
  ('a0000000-0000-0000-0000-000000000020', 'Kansas',         'KS', false, false),
  ('a0000000-0000-0000-0000-000000000021', 'Kentucky',       'KY', false, false),
  ('a0000000-0000-0000-0000-000000000022', 'Louisiana',      'LA', true,  false),
  ('a0000000-0000-0000-0000-000000000023', 'Maine',          'ME', true,  true),
  ('a0000000-0000-0000-0000-000000000024', 'Maryland',       'MD', true,  true),
  ('a0000000-0000-0000-0000-000000000025', 'Michigan',       'MI', false, false),
  ('a0000000-0000-0000-0000-000000000026', 'Minnesota',      'MN', false, true),
  ('a0000000-0000-0000-0000-000000000027', 'Mississippi',    'MS', false, false),
  ('a0000000-0000-0000-0000-000000000028', 'Missouri',       'MO', true,  true),
  ('a0000000-0000-0000-0000-000000000029', 'Montana',        'MT', false, false),
  ('a0000000-0000-0000-0000-000000000030', 'Nebraska',       'NE', false, false),
  ('a0000000-0000-0000-0000-000000000031', 'Nevada',         'NV', false, true),
  ('a0000000-0000-0000-0000-000000000032', 'New Hampshire',  'NH', true,  false),
  ('a0000000-0000-0000-0000-000000000033', 'New Jersey',     'NJ', true,  true),
  ('a0000000-0000-0000-0000-000000000034', 'New Mexico',     'NM', false, true),
  ('a0000000-0000-0000-0000-000000000035', 'North Carolina', 'NC', true,  true),
  ('a0000000-0000-0000-0000-000000000036', 'North Dakota',   'ND', false, false),
  ('a0000000-0000-0000-0000-000000000037', 'Ohio',           'OH', true,  true),
  ('a0000000-0000-0000-0000-000000000038', 'Oklahoma',       'OK', false, false),
  ('a0000000-0000-0000-0000-000000000039', 'Oregon',         'OR', true,  true),
  ('a0000000-0000-0000-0000-000000000040', 'Pennsylvania',   'PA', true,  true),
  ('a0000000-0000-0000-0000-000000000041', 'Rhode Island',   'RI', false, false),
  ('a0000000-0000-0000-0000-000000000042', 'South Carolina', 'SC', false, false),
  ('a0000000-0000-0000-0000-000000000043', 'South Dakota',   'SD', false, false),
  ('a0000000-0000-0000-0000-000000000044', 'Tennessee',      'TN', false, true),
  ('a0000000-0000-0000-0000-000000000045', 'Utah',           'UT', true,  true),
  ('a0000000-0000-0000-0000-000000000046', 'Vermont',        'VT', true,  true),
  ('a0000000-0000-0000-0000-000000000047', 'Washington',     'WA', false, true),
  ('a0000000-0000-0000-0000-000000000048', 'West Virginia',  'WV', true,  false),
  ('a0000000-0000-0000-0000-000000000049', 'Wisconsin',      'WI', false, false),
  ('a0000000-0000-0000-0000-000000000050', 'Wyoming',        'WY', false, false)
on conflict (abbreviation) do nothing;

-- ────────────────────────────────────────────
-- 2. Insert tint laws for remaining 40 states
-- ────────────────────────────────────────────
-- Format: state_id, front_side_vlt, rear_side_vlt, rear_window_vlt,
--         windshield_strip, reflective_allowed, medical_exemption,
--         fine_first_offense, notes

insert into tint_laws (
  state_id, front_side_vlt, rear_side_vlt, rear_window_vlt,
  windshield_strip, reflective_allowed, medical_exemption,
  fine_first_offense, notes
) values

-- ALABAMA (Ala. Code §32-5-215)
-- Front 32%, Rear 32%, Back 32%
('a0000000-0000-0000-0000-000000000011',
  32, 32, 32,
  'Top 6 inches, non-reflective',
  false, true,
  '$100–$200',
  'Alabama requires 32% VLT on all side and rear windows. Non-reflective tint only above AS-1 line on windshield. Medical exemptions available with documentation.'),

-- ALASKA (AS §28.35.251)
-- Front 70%, Rear 40%, Back 40%
('a0000000-0000-0000-0000-000000000012',
  70, 40, 40,
  'Top 5 inches',
  false, true,
  '$100–$300',
  'Alaska requires 70% VLT on front side windows and 40% on rear side and rear windows. Windshield tint allowed only on top 5 inches. Medical exemptions permitted.'),

-- ARKANSAS (Ark. Code §27-37-306)
-- Front 25%, Rear 25%, Back 10%
('a0000000-0000-0000-0000-000000000013',
  25, 25, 10,
  'Top 5 inches or AS-1 line',
  false, true,
  '$100–$250',
  'Arkansas allows 25% VLT on front and rear sides, and 10% on rear window. Relatively permissive. Windshield strip limited to top 5 inches.'),

-- CONNECTICUT (CGS §14-99g)
-- Front 35%, Rear 35%, Back any with mirrors
('a0000000-0000-0000-0000-000000000014',
  35, 35, null,
  'Non-reflective, above AS-1 line',
  false, true,
  '$119 infraction',
  'Connecticut requires 35% VLT on front and rear side windows. Rear window can be any darkness if vehicle has dual side mirrors. Tint checked during emissions/inspection.'),

-- DELAWARE (21 Del. C. §4313)
-- Front 70%, Rear 70%, Back 70%
('a0000000-0000-0000-0000-000000000015',
  70, 70, 70,
  'Non-reflective, above AS-1 line',
  false, true,
  '$57.50–$115',
  'Delaware is one of the strictest states. 70% VLT required on all windows. Essentially only factory tint is legal. Medical exemptions available but require annual renewal.'),

-- HAWAII (HRS §291-21.5)
-- Front 35%, Rear 35%, Back 35%
('a0000000-0000-0000-0000-000000000016',
  35, 35, 35,
  'Non-reflective strip allowed',
  false, true,
  '$200–$500',
  'Hawaii requires 35% VLT on front side, rear side, and rear windows. Non-reflective windshield strip allowed. Fines are relatively high compared to mainland states.'),

-- IDAHO (Idaho Code §49-944)
-- Front 35%, Rear 20%, Back 35%
('a0000000-0000-0000-0000-000000000017',
  35, 20, 35,
  'Top of windshield, non-reflective',
  false, true,
  '$67–$150',
  'Idaho allows 35% VLT on front sides and rear window, and 20% on rear sides. Permits darker rear side windows than front. No reflective or mirrored tint.'),

-- INDIANA (IC §9-19-19)
-- Front 30%, Rear 30%, Back 30%
('a0000000-0000-0000-0000-000000000018',
  30, 30, 30,
  'Non-reflective, above AS-1 line',
  false, true,
  '$150 class C infraction',
  'Indiana requires 30% VLT on all side and rear windows. Windshield tint only above the AS-1 line and must be non-reflective. Medical exemptions available.'),

-- IOWA (Iowa Code §321.438)
-- Front 70%, Rear any, Back any
('a0000000-0000-0000-0000-000000000019',
  70, null, null,
  'AS-1 line only',
  false, true,
  '$100–$250',
  'Iowa requires 70% VLT on front side windows but places no restriction on rear side or rear windows. Windshield tint only above AS-1 line.'),

-- KANSAS (KSA §8-1749a)
-- Front 35%, Rear 35%, Back 35%
('a0000000-0000-0000-0000-000000000020',
  35, 35, 35,
  'Top of windshield, non-reflective',
  false, true,
  '$60–$100',
  'Kansas requires 35% VLT on all side and rear windows. Non-reflective windshield strip only. Aftermarket tint must be labeled by the manufacturer.'),

-- KENTUCKY (KRS §189.110)
-- Front 35%, Rear 18%, Back 18%
('a0000000-0000-0000-0000-000000000021',
  35, 18, 18,
  'Non-reflective, above AS-1 line',
  false, true,
  '$179 fine',
  'Kentucky allows 35% VLT on front side windows and 18% on rear side and rear windows. Relatively permissive on rear windows. Medical exemptions available.'),

-- LOUISIANA (La. RS §32:361.1)
-- Front 40%, Rear 25%, Back 12%
('a0000000-0000-0000-0000-000000000022',
  40, 25, 12,
  'Top of windshield, AS-1 line',
  false, true,
  '$150–$350',
  'Louisiana requires 40% VLT on front side windows, 25% on rear sides, and 12% on rear window. State inspection checks tint. Medical exemptions available with doctor certification.'),

-- MAINE (29-A MRSA §1916)
-- Front 35%, Rear any, Back any
('a0000000-0000-0000-0000-000000000023',
  35, null, null,
  'Top 4 inches',
  false, true,
  '$100–$200',
  'Maine requires 35% VLT on front side windows but has no restriction on rear side or rear windows. Tint is checked during annual inspection.'),

-- MARYLAND (Md. Transp. Code §22-406)
-- Front 35%, Rear 35%, Back 35%
('a0000000-0000-0000-0000-000000000024',
  35, 35, 35,
  'Top of windshield, non-reflective',
  false, true,
  '$50–$500',
  'Maryland requires 35% VLT on all side and rear windows. Tint is checked during state inspection. Reflective tint is prohibited. Medical exemptions require annual renewal.'),

-- MICHIGAN (MCL §257.709)
-- Front 70% (no aftermarket), Rear any, Back any
('a0000000-0000-0000-0000-000000000025',
  70, null, null,
  'Top 4 inches',
  false, true,
  '$115 civil infraction',
  'Michigan effectively prohibits aftermarket tint on front side windows, must maintain 70% VLT (factory only). No restriction on rear side or rear windows. Top 4 inches of windshield may be tinted.'),

-- MINNESOTA (Minn. Stat. §169.71)
-- Front 50%, Rear 50%, Back 50%
('a0000000-0000-0000-0000-000000000026',
  50, 50, 50,
  'Non-reflective, above AS-1 line',
  false, true,
  '$50–$100',
  'Minnesota requires 50% VLT on all side and rear windows. Windshield tint only above AS-1 line, non-reflective. Medical exemptions available for darker tint.'),

-- MISSISSIPPI (Miss. Code §63-7-59)
-- Front 28%, Rear 28%, Back 28%
('a0000000-0000-0000-0000-000000000027',
  28, 28, 28,
  'Top of windshield, non-reflective',
  false, true,
  '$25–$100',
  'Mississippi requires 28% VLT on front side, rear side, and rear windows. Non-reflective windshield strip allowed. Relatively lenient compared to many states.'),

-- MISSOURI (RSMo §307.173)
-- Front 35%, Rear any, Back any
('a0000000-0000-0000-0000-000000000028',
  35, null, null,
  'Non-reflective, above AS-1 line',
  false, true,
  '$75–$200',
  'Missouri requires 35% VLT on front side windows but has no restriction on rear side or rear windows. Tint may be checked during state inspection in inspection-required areas.'),

-- MONTANA (MCA §61-9-405)
-- Front 24%, Rear 14%, Back 14%
('a0000000-0000-0000-0000-000000000029',
  24, 14, 14,
  'Top 5 inches',
  false, true,
  '$100',
  'Montana is one of the most permissive states. 24% VLT on front sides and 14% on rear sides and rear window. Top 5 inches of windshield can be tinted.'),

-- NEBRASKA (Neb. Rev. Stat. §60-6,257)
-- Front 35%, Rear 20%, Back 20%
('a0000000-0000-0000-0000-000000000030',
  35, 20, 20,
  'Top of windshield, non-reflective',
  false, true,
  '$25–$100',
  'Nebraska requires 35% VLT on front side windows and 20% on rear side and rear windows. Non-reflective tint only on windshield strip.'),

-- NEVADA (NRS §484D.440)
-- Front 35%, Rear any, Back any
('a0000000-0000-0000-0000-000000000031',
  35, null, null,
  'Top of windshield, above AS-1 line',
  false, true,
  '$100–$250',
  'Nevada requires 35% VLT on front side windows. No restriction on rear side or rear windows. Reflective tint of any kind is prohibited on windshield.'),

-- NEW HAMPSHIRE (RSA §266:58-a)
-- Front 70% (effectively no tint), Rear 35%, Back 35%
('a0000000-0000-0000-0000-000000000032',
  70, 35, 35,
  'No aftermarket tint on windshield',
  false, false,
  'Warning for first offense, then fine',
  'New Hampshire restricts front side windows to 70% VLT and rear windows to 35% VLT. No windshield tint allowed. No medical exemptions available, one of very few states without them.'),

-- NEW JERSEY (NJSA §39:3-74)
-- Front 70% (no aftermarket), Rear any, Back any
('a0000000-0000-0000-0000-000000000033',
  70, null, null,
  'No aftermarket tint allowed',
  false, true,
  '$54–$108 + court costs',
  'New Jersey prohibits aftermarket tint on front side windows, 70% VLT required (factory only). No restriction on rear side or rear windows. Very strictly enforced, especially during inspection.'),

-- NEW MEXICO (NMSA §66-3-854)
-- Front 20%, Rear 20%, Back 20%
('a0000000-0000-0000-0000-000000000034',
  20, 20, 20,
  'Top 5 inches',
  false, true,
  '$25–$300',
  'New Mexico is one of the most permissive states, allowing 20% VLT on all windows. Top 5 inches of windshield may be tinted. Medical exemptions not needed for most tint levels.'),

-- NORTH CAROLINA (NCGS §20-127)
-- Front 35%, Rear 35%, Back 35%
('a0000000-0000-0000-0000-000000000035',
  35, 35, 35,
  'Non-reflective, above AS-1 line',
  false, true,
  '$50 infraction',
  'North Carolina requires 35% VLT on all side and rear windows. Tint is checked during annual state inspection. Non-reflective tint only.'),

-- NORTH DAKOTA (NDCC §39-21-39.1)
-- Front 50%, Rear any, Back any
('a0000000-0000-0000-0000-000000000036',
  50, null, null,
  'Top of windshield, AS-1 line',
  false, true,
  '$20 non-moving violation',
  'North Dakota requires 50% VLT on front side windows but has no restriction on rear side or rear windows. Very low fines. Medical exemptions available.'),

-- OHIO (ORC §4513.241)
-- Front 50%, Rear any, Back any
('a0000000-0000-0000-0000-000000000037',
  50, null, null,
  'Non-reflective, above AS-1 line',
  false, true,
  '$120 minor misdemeanor',
  'Ohio requires 50% VLT on front side windows. No restriction on rear side or rear windows. Non-reflective windshield strip only. Tint is checked during vehicle inspection.'),

-- OKLAHOMA (47 OS §12-400.2)
-- Front 25%, Rear 25%, Back 25%
('a0000000-0000-0000-0000-000000000038',
  25, 25, 25,
  'Top 5 inches or AS-1 line',
  false, true,
  '$249 fine',
  'Oklahoma allows 25% VLT on all side and rear windows. Top 5 inches of windshield may be tinted. Relatively permissive for front side windows.'),

-- OREGON (ORS §815.222)
-- Front 35%, Rear 35%, Back 35%
('a0000000-0000-0000-0000-000000000039',
  35, 35, 35,
  'Non-reflective, above AS-1 line',
  false, true,
  '$110 violation',
  'Oregon requires 35% VLT on all side and rear windows. Non-reflective only. Checked during state vehicle inspection in DEQ areas.'),

-- PENNSYLVANIA (75 Pa.C.S. §4524)
-- Front 70% (no aftermarket), Rear any, Back any
('a0000000-0000-0000-0000-000000000040',
  70, null, null,
  'No aftermarket tint allowed',
  false, true,
  '$110 + court costs',
  'Pennsylvania prohibits aftermarket tint on front side windows and windshield, 70% VLT required. No restriction on rear side or rear windows. Strictly enforced during annual inspection.'),

-- RHODE ISLAND (RIGL §31-23.3)
-- Front 70%, Rear 70%, Back 70%
('a0000000-0000-0000-0000-000000000041',
  70, 70, 70,
  'Non-reflective, above AS-1 line',
  false, true,
  '$85 fine',
  'Rhode Island requires 70% VLT on all side and rear windows, one of the strictest states. Essentially only factory tint is allowed. Medical exemptions available.'),

-- SOUTH CAROLINA (SC Code §56-5-5015)
-- Front 27%, Rear 27%, Back 27%
('a0000000-0000-0000-0000-000000000042',
  27, 27, 27,
  'Non-reflective, above AS-1 line',
  false, true,
  '$200 fine',
  'South Carolina allows 27% VLT on all side and rear windows. Non-reflective windshield strip only. Relatively permissive.'),

-- SOUTH DAKOTA (SDCL §32-15-6.2)
-- Front 35%, Rear 20%, Back 20%
('a0000000-0000-0000-0000-000000000043',
  35, 20, 20,
  'Non-reflective, above AS-1 line',
  false, true,
  '$25–$100',
  'South Dakota requires 35% VLT on front side windows and 20% on rear side and rear windows. Windshield strip must be non-reflective.'),

-- TENNESSEE (TCA §55-9-107)
-- Front 35%, Rear 35%, Back 35%
('a0000000-0000-0000-0000-000000000044',
  35, 35, 35,
  'Top of windshield, AS-1 line',
  false, true,
  '$50 fine',
  'Tennessee requires 35% VLT on all side and rear windows. Windshield tint limited to AS-1 line or top of windshield strip. Medical exemptions available.'),

-- UTAH (UCA §41-6a-1635)
-- Front 43%, Rear any, Back any
('a0000000-0000-0000-0000-000000000045',
  43, null, null,
  'Top 4 inches',
  false, true,
  '$100–$250',
  'Utah requires 43% VLT on front side windows. No restriction on rear side or rear windows. Unusual 43% threshold. Windshield tint limited to top 4 inches.'),

-- VERMONT (23 VSA §1125)
-- Front 70% (no aftermarket), Rear any, Back any
('a0000000-0000-0000-0000-000000000046',
  70, null, null,
  'No aftermarket tint allowed',
  false, true,
  '$111 fine',
  'Vermont prohibits aftermarket tint on front side windows, 70% VLT required. No restriction on rear side or rear windows. Checked during annual state inspection.'),

-- WASHINGTON (RCW §46.37.430)
-- Front 24%, Rear 24%, Back 24%
('a0000000-0000-0000-0000-000000000047',
  24, 24, 24,
  'Top 6 inches',
  false, true,
  '$136 infraction',
  'Washington allows 24% VLT on all side and rear windows. One of the more permissive states. Windshield tint limited to top 6 inches.'),

-- WEST VIRGINIA (WV Code §17C-15-46)
-- Front 35%, Rear 35%, Back 35%
('a0000000-0000-0000-0000-000000000048',
  35, 35, 35,
  'Non-reflective, above AS-1 line',
  false, true,
  '$25–$100',
  'West Virginia requires 35% VLT on all side and rear windows. Windshield tint only above AS-1 line. Tint is checked during annual state inspection.'),

-- WISCONSIN (WI Stat. §305.34)
-- Front 50%, Rear 35%, Back 35%
('a0000000-0000-0000-0000-000000000049',
  50, 35, 35,
  'Non-reflective, above AS-1 line',
  false, true,
  '$150–$200 forfeiture',
  'Wisconsin requires 50% VLT on front side windows and 35% on rear side and rear windows. Non-reflective windshield strip only. Classified as a forfeiture offense, not a traffic violation.'),

-- WYOMING (WS §31-5-952)
-- Front 28%, Rear 28%, Back 28%
('a0000000-0000-0000-0000-000000000050',
  28, 28, 28,
  'Top 5 inches, AS-1 line',
  false, true,
  '$50–$150',
  'Wyoming allows 28% VLT on all side and rear windows. Windshield strip limited to top 5 inches. Relatively permissive.')

on conflict (state_id) do nothing;
