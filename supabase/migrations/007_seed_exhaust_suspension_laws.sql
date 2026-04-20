-- 007: Seed exhaust_laws and suspension_laws for all 50 US states
--
-- WARNING: These values are approximate and gathered from publicly available
-- summaries of state vehicle codes. Laws change frequently. Always verify
-- current regulations with official state DMV / DOT sources before relying
-- on this data. This seed is for informational purposes only.
--
-- Federal note: catalytic converter removal (cat delete) is illegal under
-- the federal Clean Air Act / EPA regulations in ALL 50 states, regardless
-- of individual state law.

-- ============================================================
--  EXHAUST LAWS
-- ============================================================

insert into exhaust_laws
  (state_id, max_decibels, muffler_required, cat_delete_legal, straight_pipe_legal, measurement_method, fine_first_offense, notes)
values
  -- 01 California
  ('a0000000-0000-0000-0000-000000000001', 95,   true, false, false, 'SAE J1169 – 50 ft from center of lane', 'Up to $1,000', 'CVC 27150-27153. CARB enforced. Aftermarket exhaust must have CARB EO number. Smog check required.'),
  -- 02 Texas
  ('a0000000-0000-0000-0000-000000000002', null, true, false, false, 'Subjective – excessive / unusual noise', 'Up to $200',   'TX Transp. Code 547.604. No specific dB limit; muffler must prevent excessive noise.'),
  -- 03 Florida
  ('a0000000-0000-0000-0000-000000000003', null, true, false, false, 'Subjective – excessive / unusual noise', 'Up to $114',   'FL Stat. 316.293. Must have muffler in good working order; no cutouts or bypasses.'),
  -- 04 New York
  ('a0000000-0000-0000-0000-000000000004', null, true, false, false, 'Subjective – plainly audible from 150 ft (NYC)', 'Up to $875 (NYC SLEEP Act)', 'VTL 375(31). NYC has stricter noise camera enforcement under the SLEEP Act.'),
  -- 05 Massachusetts
  ('a0000000-0000-0000-0000-000000000005', null, true, false, false, 'Subjective – excessive noise', 'Up to $300', 'MGL c.90 s.16. Annual safety inspection checks exhaust system integrity.'),
  -- 06 Arizona
  ('a0000000-0000-0000-0000-000000000006', null, true, false, false, 'Subjective – excessive / unusual noise', 'Up to $300',   'ARS 28-955. Muffler required; no cutouts or bypasses allowed.'),
  -- 07 Colorado
  ('a0000000-0000-0000-0000-000000000007', null, true, false, false, 'Subjective – plainly audible at reasonable distance', 'Up to $500', 'CRS 42-4-224. Emissions testing required in Front Range counties.'),
  -- 08 Georgia
  ('a0000000-0000-0000-0000-000000000008', null, true, false, false, 'Subjective – excessive / unusual noise', 'Up to $150',   'OCGA 40-8-71. Muffler must prevent excessive or unusual noise.'),
  -- 09 Illinois
  ('a0000000-0000-0000-0000-000000000009', 87,  true, false, false, 'SAE J1169 – 50 ft measurement', 'Up to $500', '625 ILCS 5/12-602. Specific dB limits: 87 dB for vehicles under 8,000 lbs.'),
  -- 10 Virginia
  ('a0000000-0000-0000-0000-000000000010', null, true, false, false, 'Subjective – excessive noise', 'Up to $250', 'VA Code 46.2-1047. Annual safety inspection checks exhaust. Emissions tested in NoVA.'),

  -- 11 Alabama
  ('a0000000-0000-0000-0000-000000000011', null, true, false, false, 'Subjective – excessive / unusual noise', 'Up to $100', 'AL Code 32-5-216. Muffler required; no cutouts or bypasses.'),
  -- 12 Alaska
  ('a0000000-0000-0000-0000-000000000012', null, true, false, false, 'Subjective – excessive noise', 'Up to $300', 'AS 28.35.160. Muffler required; no cutouts.'),
  -- 13 Arkansas
  ('a0000000-0000-0000-0000-000000000013', null, true, false, false, 'Subjective – excessive / unusual noise', 'Up to $100', 'ACA 27-37-502. Muffler must prevent excessive noise.'),
  -- 14 Connecticut
  ('a0000000-0000-0000-0000-000000000014', null, true, false, false, 'Subjective – excessive noise', 'Up to $250', 'CGS 14-80. Emissions testing required.'),
  -- 15 Delaware
  ('a0000000-0000-0000-0000-000000000015', null, true, false, false, 'Subjective – excessive / unusual noise', 'Up to $115', 'Del. Code 21-4302. Muffler required; no cutouts.'),
  -- 16 Hawaii
  ('a0000000-0000-0000-0000-000000000016', null, true, false, false, 'Subjective – excessive noise', 'Up to $200', 'HRS 291-24. Annual safety inspection includes exhaust check.'),
  -- 17 Idaho
  ('a0000000-0000-0000-0000-000000000017', 92,  true, false, false, 'SAE J1169 – measured at 20 in from tailpipe', 'Up to $100', 'IC 49-937. 92 dB limit measured at 20 inches from tailpipe at 3/4 max RPM.'),
  -- 18 Indiana
  ('a0000000-0000-0000-0000-000000000018', null, true, false, false, 'Subjective – excessive / unusual noise', 'Up to $500', 'IC 9-19-7. Muffler required; no cutouts or bypasses.'),
  -- 19 Iowa
  ('a0000000-0000-0000-0000-000000000019', null, true, false, false, 'Subjective – excessive noise', 'Up to $200', 'Iowa Code 321.436. Muffler required in constant operation.'),
  -- 20 Kansas
  ('a0000000-0000-0000-0000-000000000020', 90,  true, false, false, 'Measured at 50 ft from center of lane', 'Up to $100', 'KSA 8-1739. 90 dB limit at 50 ft for vehicles under 10,000 lbs.'),
  -- 21 Kentucky
  ('a0000000-0000-0000-0000-000000000021', null, true, false, false, 'Subjective – excessive / unusual noise', 'Up to $100', 'KRS 189.140. Muffler must prevent excessive or unusual noise.'),
  -- 22 Louisiana
  ('a0000000-0000-0000-0000-000000000022', null, true, false, false, 'Subjective – excessive noise', 'Up to $175', 'LRS 32:352. Muffler required; no cutouts or bypasses.'),
  -- 23 Maine
  ('a0000000-0000-0000-0000-000000000023', 95,  true, false, false, 'Measured at 50 ft from vehicle', 'Up to $250', '29-A MRSA 1912. 95 dB limit; annual inspection.'),
  -- 24 Maryland
  ('a0000000-0000-0000-0000-000000000024', 80,  true, false, false, 'SAE J1169 – measured at 50 ft', 'Up to $100', 'MD Transp. 22-609. 80 dB limit at 50 ft under 35 mph. Emissions testing required.'),
  -- 25 Michigan
  ('a0000000-0000-0000-0000-000000000025', 85,  true, false, false, 'Measured at 50 ft from roadway centerline', 'Up to $100', 'MCL 257.707c. 85 dB at 50 ft for vehicles under 10,000 lbs at speeds under 35 mph.'),
  -- 26 Minnesota
  ('a0000000-0000-0000-0000-000000000026', 84,  true, false, false, 'Measured at 50 ft from vehicle', 'Up to $200', 'MN Stat. 169.69. 84 dB at 50 ft for vehicles under 10,000 lbs at speeds under 35 mph.'),
  -- 27 Mississippi
  ('a0000000-0000-0000-0000-000000000027', null, true, false, false, 'Subjective – excessive / unusual noise', 'Up to $100', 'MS Code 63-7-43. Muffler required; no cutouts.'),
  -- 28 Missouri
  ('a0000000-0000-0000-0000-000000000028', null, true, false, false, 'Subjective – excessive noise', 'Up to $200', 'RSMo 307.365. Muffler required; safety inspection in St. Louis and KC areas.'),
  -- 29 Montana
  ('a0000000-0000-0000-0000-000000000029', null, true, false, true,  'Subjective – excessive noise', 'Up to $100', 'MCA 61-9-322. Montana does not have emissions testing; straight pipes generally tolerated.'),
  -- 30 Nebraska
  ('a0000000-0000-0000-0000-000000000030', null, true, false, false, 'Subjective – excessive / unusual noise', 'Up to $100', 'NRS 60-6,288. Muffler required; no cutouts.'),
  -- 31 Nevada
  ('a0000000-0000-0000-0000-000000000031', null, true, false, false, 'Subjective – excessive noise', 'Up to $250', 'NRS 484D.400. Muffler required. Emissions testing in Washoe and Clark counties.'),
  -- 32 New Hampshire
  ('a0000000-0000-0000-0000-000000000032', null, true, false, false, 'Subjective – excessive noise', 'Up to $100', 'RSA 266:58-a. Muffler required; annual inspection checks exhaust.'),
  -- 33 New Jersey
  ('a0000000-0000-0000-0000-000000000033', null, true, false, false, 'Subjective – excessive noise', 'Up to $200', 'NJSA 39:3-70. Muffler required. Emissions testing required.'),
  -- 34 New Mexico
  ('a0000000-0000-0000-0000-000000000034', null, true, false, false, 'Subjective – excessive noise', 'Up to $100', 'NMSA 66-3-843. Muffler required; emissions testing in Bernalillo County.'),
  -- 35 North Carolina
  ('a0000000-0000-0000-0000-000000000035', null, true, false, false, 'Subjective – excessive noise', 'Up to $250', 'NCGS 20-128. Muffler required. Annual safety inspection.'),
  -- 36 North Dakota
  ('a0000000-0000-0000-0000-000000000036', null, true, false, false, 'Subjective – excessive / unusual noise', 'Up to $100', 'NDCC 39-21-36. Muffler required; no cutouts.'),
  -- 37 Ohio
  ('a0000000-0000-0000-0000-000000000037', 89,  true, false, false, 'SAE J1169 – 50 ft measurement', 'Up to $150', 'ORC 4513.22. 89 dB at 50 ft at speeds up to 35 mph for vehicles under 10,000 lbs.'),
  -- 38 Oklahoma
  ('a0000000-0000-0000-0000-000000000038', null, true, false, false, 'Subjective – excessive / unusual noise', 'Up to $200', '47 OS 12-401. Muffler required; no cutouts or bypasses.'),
  -- 39 Oregon
  ('a0000000-0000-0000-0000-000000000039', null, true, false, false, 'Subjective – excessive noise', 'Up to $360', 'ORS 815.250. Muffler required. DEQ emissions testing in Portland and Medford areas.'),
  -- 40 Pennsylvania
  ('a0000000-0000-0000-0000-000000000040', null, true, false, false, 'Subjective – excessive noise', 'Up to $200', '75 PaCS 4523. Muffler required. Annual safety and emissions inspection.'),
  -- 41 Rhode Island
  ('a0000000-0000-0000-0000-000000000041', null, true, false, false, 'Subjective – excessive noise', 'Up to $200', 'RIGL 31-23-9. Muffler required. Biennial inspection.'),
  -- 42 South Carolina
  ('a0000000-0000-0000-0000-000000000042', null, true, false, false, 'Subjective – excessive / unusual noise', 'Up to $100', 'SC Code 56-5-4860. Muffler required; no cutouts.'),
  -- 43 South Dakota
  ('a0000000-0000-0000-0000-000000000043', null, true, false, true,  'Subjective – excessive noise', 'Up to $100', 'SDCL 32-15-14. No emissions testing; straight pipe enforcement is minimal.'),
  -- 44 Tennessee
  ('a0000000-0000-0000-0000-000000000044', null, true, false, false, 'Subjective – excessive noise', 'Up to $50',  'TCA 55-9-202. Muffler required; no cutouts.'),
  -- 45 Utah
  ('a0000000-0000-0000-0000-000000000045', null, true, false, false, 'Subjective – excessive noise', 'Up to $100', 'UC 41-6a-1626. Muffler required. Emissions in Wasatch Front counties.'),
  -- 46 Vermont
  ('a0000000-0000-0000-0000-000000000046', null, true, false, false, 'Subjective – excessive noise', 'Up to $200', '23 VSA 1135. Muffler required. Annual inspection.'),
  -- 47 Washington
  ('a0000000-0000-0000-0000-000000000047', null, true, false, false, 'Subjective – excessive noise', 'Up to $250', 'RCW 46.37.390. Muffler required. Emissions testing in certain counties.'),
  -- 48 West Virginia
  ('a0000000-0000-0000-0000-000000000048', null, true, false, false, 'Subjective – excessive / unusual noise', 'Up to $100', 'WV Code 17C-15-34. Muffler required; no cutouts.'),
  -- 49 Wisconsin
  ('a0000000-0000-0000-0000-000000000049', null, true, false, false, 'Subjective – excessive noise', 'Up to $200', 'WI Stat. 347.39. Muffler required. Emissions testing in SE Wisconsin.'),
  -- 50 Wyoming
  ('a0000000-0000-0000-0000-000000000050', null, true, false, true,  'Subjective – excessive noise', 'Up to $100', 'WS 31-5-960. No emissions testing; enforcement of exhaust noise is lenient.')
on conflict (state_id) do nothing;


-- ============================================================
--  SUSPENSION LAWS
-- ============================================================

insert into suspension_laws
  (state_id, max_lift_inches, max_bumper_height_front, max_bumper_height_rear, frame_height_limit, lowering_restrictions, fine_first_offense, notes)
values
  -- 01 California
  ('a0000000-0000-0000-0000-000000000001', null, 22, 22, 'Frame height must not exceed 23 in for passenger vehicles', 'No minimum ride height specified; headlamp and bumper height requirements apply', 'Up to $1,000', 'CVC 24008.5 and CVC 28071. Bumper height max 22 in for passenger vehicles under 4,500 lbs GVWR. Lift max effectively ~5 in from factory.'),
  -- 02 Texas
  ('a0000000-0000-0000-0000-000000000002', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $200', 'TX has no specific lift or bumper height laws. Headlamp height requirements (24-54 in) effectively limit extreme lifts.'),
  -- 03 Florida
  ('a0000000-0000-0000-0000-000000000003', null, 27, 29, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $114', 'FL Stat. 316.2955. Front bumper max 27 in, rear max 29 in for vehicles under 2,500 lbs. Higher limits for heavier vehicles.'),
  -- 04 New York
  ('a0000000-0000-0000-0000-000000000004', null, null, null, 'Body lifts restricted to max 2 in above frame', 'No specific lowering restrictions', 'Up to $150', 'VTL 375. No specific bumper height law, but annual inspection checks for unsafe modifications.'),
  -- 05 Massachusetts
  ('a0000000-0000-0000-0000-000000000005', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $200', 'CMR 540 7.04. Annual inspection checks for excessively raised or lowered vehicles that affect safety.'),
  -- 06 Arizona
  ('a0000000-0000-0000-0000-000000000006', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $200', 'AZ has minimal suspension modification regulations. Headlamp height rules apply.'),
  -- 07 Colorado
  ('a0000000-0000-0000-0000-000000000007', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'CO has no specific lift or bumper height laws. Standard headlamp height requirements apply.'),
  -- 08 Georgia
  ('a0000000-0000-0000-0000-000000000008', null, 25, 27, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $150', 'OCGA 40-8-73. Front bumper max 25 in, rear max 27 in for passenger vehicles.'),
  -- 09 Illinois
  ('a0000000-0000-0000-0000-000000000009', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $500', 'IL has no specific bumper height or lift laws. Modifications must not make vehicle unsafe.'),
  -- 10 Virginia
  ('a0000000-0000-0000-0000-000000000010', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $250', 'VA Code 46.2-1063. Annual inspection checks suspension components but no specific height restrictions.'),

  -- 11 Alabama
  ('a0000000-0000-0000-0000-000000000011', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'AL has no specific lift or bumper height laws.'),
  -- 12 Alaska
  ('a0000000-0000-0000-0000-000000000012', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $300', 'AK has no specific lift or bumper height laws.'),
  -- 13 Arkansas
  ('a0000000-0000-0000-0000-000000000013', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'AR has no specific lift or bumper height laws.'),
  -- 14 Connecticut
  ('a0000000-0000-0000-0000-000000000014', 4,   null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $250', 'CGS 14-106. Max 4 in body lift above factory specification.'),
  -- 15 Delaware
  ('a0000000-0000-0000-0000-000000000015', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $115', 'DE has no specific lift or bumper height laws.'),
  -- 16 Hawaii
  ('a0000000-0000-0000-0000-000000000016', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $200', 'HI has no specific lift or bumper height laws. Annual inspection checks safety.'),
  -- 17 Idaho
  ('a0000000-0000-0000-0000-000000000017', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'ID has no specific lift or bumper height laws.'),
  -- 18 Indiana
  ('a0000000-0000-0000-0000-000000000018', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $500', 'IN has no specific lift or bumper height laws.'),
  -- 19 Iowa
  ('a0000000-0000-0000-0000-000000000019', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $200', 'IA has no specific lift or bumper height laws.'),
  -- 20 Kansas
  ('a0000000-0000-0000-0000-000000000020', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'KS has no specific lift or bumper height laws.'),
  -- 21 Kentucky
  ('a0000000-0000-0000-0000-000000000021', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'KY has no specific lift or bumper height laws.'),
  -- 22 Louisiana
  ('a0000000-0000-0000-0000-000000000022', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $175', 'LA has no specific lift or bumper height laws. Headlamp height rules apply.'),
  -- 23 Maine
  ('a0000000-0000-0000-0000-000000000023', 4,   null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $250', '29-A MRSA 1903. Body lift max 4 in. Annual inspection.'),
  -- 24 Maryland
  ('a0000000-0000-0000-0000-000000000024', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'MD has no specific lift or bumper height laws. Safety inspection checks suspension.'),
  -- 25 Michigan
  ('a0000000-0000-0000-0000-000000000025', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'MI has no specific lift or bumper height laws. No vehicle inspections.'),
  -- 26 Minnesota
  ('a0000000-0000-0000-0000-000000000026', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $200', 'MN has no specific lift or bumper height laws.'),
  -- 27 Mississippi
  ('a0000000-0000-0000-0000-000000000027', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'MS has no specific lift or bumper height laws.'),
  -- 28 Missouri
  ('a0000000-0000-0000-0000-000000000028', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $200', 'MO has no specific lift or bumper height laws.'),
  -- 29 Montana
  ('a0000000-0000-0000-0000-000000000029', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'MT has no specific lift or bumper height laws.'),
  -- 30 Nebraska
  ('a0000000-0000-0000-0000-000000000030', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'NE has no specific lift or bumper height laws.'),
  -- 31 Nevada
  ('a0000000-0000-0000-0000-000000000031', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $250', 'NV has no specific lift or bumper height laws.'),
  -- 32 New Hampshire
  ('a0000000-0000-0000-0000-000000000032', 6,   null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'RSA 266:62. Max 6 in lift from factory. Annual inspection.'),
  -- 33 New Jersey
  ('a0000000-0000-0000-0000-000000000033', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $200', 'NJ has no specific lift or bumper height laws. Safety inspection checks suspension.'),
  -- 34 New Mexico
  ('a0000000-0000-0000-0000-000000000034', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'NM has no specific lift or bumper height laws.'),
  -- 35 North Carolina
  ('a0000000-0000-0000-0000-000000000035', 6,   null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $250', 'NCGS 20-135.4. Max 6 in above or below factory ride height. Annual inspection.'),
  -- 36 North Dakota
  ('a0000000-0000-0000-0000-000000000036', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'ND has no specific lift or bumper height laws.'),
  -- 37 Ohio
  ('a0000000-0000-0000-0000-000000000037', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $150', 'OH has no specific lift or bumper height laws.'),
  -- 38 Oklahoma
  ('a0000000-0000-0000-0000-000000000038', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $200', 'OK has no specific lift or bumper height laws.'),
  -- 39 Oregon
  ('a0000000-0000-0000-0000-000000000039', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $360', 'OR has no specific lift or bumper height laws.'),
  -- 40 Pennsylvania
  ('a0000000-0000-0000-0000-000000000040', null, 22, 24, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $200', '75 PaCS 4535. Front bumper max 22 in, rear max 24 in for passenger vehicles under 5,000 lbs. Annual inspection.'),
  -- 41 Rhode Island
  ('a0000000-0000-0000-0000-000000000041', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $200', 'RI has no specific lift or bumper height laws. Biennial inspection.'),
  -- 42 South Carolina
  ('a0000000-0000-0000-0000-000000000042', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'SC has no specific lift or bumper height laws.'),
  -- 43 South Dakota
  ('a0000000-0000-0000-0000-000000000043', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'SD has no specific lift or bumper height laws.'),
  -- 44 Tennessee
  ('a0000000-0000-0000-0000-000000000044', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $50', 'TN has no specific lift or bumper height laws.'),
  -- 45 Utah
  ('a0000000-0000-0000-0000-000000000045', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'UT has no specific lift or bumper height laws.'),
  -- 46 Vermont
  ('a0000000-0000-0000-0000-000000000046', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $200', 'VT has no specific lift or bumper height laws. Annual inspection.'),
  -- 47 Washington
  ('a0000000-0000-0000-0000-000000000047', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $250', 'WA has no specific lift or bumper height laws. Headlamp height rules apply.'),
  -- 48 West Virginia
  ('a0000000-0000-0000-0000-000000000048', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'WV has no specific lift or bumper height laws.'),
  -- 49 Wisconsin
  ('a0000000-0000-0000-0000-000000000049', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $200', 'WI has no specific lift or bumper height laws.'),
  -- 50 Wyoming
  ('a0000000-0000-0000-0000-000000000050', null, null, null, 'No specific frame height limit', 'No specific lowering restrictions', 'Up to $100', 'WY has no specific lift or bumper height laws.')
on conflict (state_id) do nothing;


-- ============================================================
--  ROW LEVEL SECURITY
-- ============================================================

-- RLS policies for exhaust_laws and suspension_laws
alter table exhaust_laws enable row level security;
alter table suspension_laws enable row level security;

create policy "Allow public read on exhaust_laws"
  on exhaust_laws for select using (true);

create policy "Allow public read on suspension_laws"
  on suspension_laws for select using (true);
