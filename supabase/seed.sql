-- POLAR COMMAND - Realistic Operational Seed Data
-- Svalbard & High Arctic Telemetry Coordinates (~78.2° N, 15.6° E)

-- Insert HQ Admin Profile
INSERT INTO public.users (id, email, full_name, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'commander@polarcommand.org', 'Commander Admin', 'Commander')
ON CONFLICT (email) DO NOTHING;

-- Expeditions
INSERT INTO public.expeditions (id, name, code, location, status, leader_name)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Arctic Expedition Alpha', 'EXP-ALPHA-2026', 'Svalbard Sector 9', 'ACTIVE', 'Dr. Erik Lindqvist'),
  ('11111111-1111-1111-1111-222222222222', 'Aurora Expedition Beta', 'EXP-BETA-2026', 'North Greenland Traverse', 'PLANNING', 'Elena Vance'),
  ('11111111-1111-1111-1111-333333333333', 'Icefall Expedition Gamma', 'EXP-GAMMA-2025', 'Ellesmere Island', 'COMPLETED', 'Marcus Holloway')
ON CONFLICT DO NOTHING;

-- Teams
INSERT INTO public.teams (id, expedition_id, name, callsign, color_code)
VALUES 
  ('22222222-2222-2222-2222-111111111111', '11111111-1111-1111-1111-111111111111', 'Team Alpha', 'ALPHA-VANGUARD', '#38bdf8'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Team Bravo', 'BRAVO-GLACIER', '#22d3ee'),
  ('22222222-2222-2222-2222-333333333333', '11111111-1111-1111-1111-111111111111', 'Team Charlie', 'CHARLIE-LOGISTICS', '#f59e0b'),
  ('22222222-2222-2222-2222-444444444444', '11111111-1111-1111-1111-111111111111', 'Team Delta', 'DELTA-ENGINEER', '#a855f7'),
  ('22222222-2222-2222-2222-555555555555', '11111111-1111-1111-1111-111111111111', 'Team Echo', 'ECHO-SAR', '#ef4444')
ON CONFLICT DO NOTHING;

-- Personnel (20 Realistic Field Personnel)
INSERT INTO public.personnel (id, expedition_id, team_id, full_name, role, status, latitude, longitude, location_name, battery_level, comm_channel, satellite_status)
VALUES 
  ('33333333-3333-3333-3333-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-111111111111', 'Arjun Kumar', 'Vehicle Inspection Specialist', 'EMERGENCY', 78.2450, 15.6820, 'Camp B - North Ridge', 68, 'SATELLITE', 'SATELLITE AVAILABLE'),
  ('33333333-3333-3333-3333-000000000002', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-111111111111', 'Dr. Astrid Lindholm', 'Lead Glaciologist', 'ON_MISSION', 78.2410, 15.6790, 'Longyearbyen Ice Core 1', 88, 'SATELLITE', 'SATELLITE AVAILABLE'),
  ('33333333-3333-3333-3333-000000000003', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-111111111111', 'Klaus Meier', 'Polar Rover Pilot', 'ACTIVE', 78.2430, 15.6850, 'Camp B Patrol Waypoint', 74, 'RADIO', 'SATELLITE AVAILABLE'),
  ('33333333-3333-3333-3333-000000000004', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-111111111111', 'Sarah Jenkins', 'Safety & Field Medic', 'ACTIVE', 78.2440, 15.6810, 'Camp B Medical Unit', 92, 'SATELLITE', 'SATELLITE AVAILABLE'),
  
  ('33333333-3333-3333-3333-000000000005', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Elena Vance', 'Senior Geophysicist', 'ON_MISSION', 78.2100, 15.6120, 'Foxfonna Glacier Base', 81, 'SATELLITE', 'SATELLITE AVAILABLE'),
  ('33333333-3333-3333-3333-000000000006', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Nikolai Volkov', 'Seismic Array Engineer', 'ON_MISSION', 78.2120, 15.6150, 'Foxfonna Ridge East', 59, 'RADIO', 'SATELLITE AVAILABLE'),
  ('33333333-3333-3333-3333-000000000007', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Hanna Sorenson', 'Environmental Technician', 'ACTIVE', 78.2150, 15.6190, 'Foxfonna Outpost', 95, 'INTERNET', 'SATELLITE AVAILABLE'),
  ('33333333-3333-3333-3333-000000000008', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Tomasz Kowalski', 'Ice Core Drilling Tech', 'ACTIVE', 78.2090, 15.6080, 'Foxfonna Drilling Rig 2', 78, 'SATELLITE', 'SATELLITE AVAILABLE'),

  ('33333333-3333-3333-3333-000000000009', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-333333333333', 'Marcus Holloway', 'Logistics Operations Chief', 'ACTIVE', 78.2250, 15.6510, 'Main Supply Hub Svalbard', 98, 'INTERNET', 'SATELLITE AVAILABLE'),
  ('33333333-3333-3333-3333-000000000010', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-333333333333', 'Yuki Tanaka', 'Cargo Inventory Manager', 'ACTIVE', 78.2260, 15.6530, 'Depot Alpha Warehouse', 86, 'INTERNET', 'SATELLITE AVAILABLE'),
  ('33333333-3333-3333-3333-000000000011', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-333333333333', 'David O''Connor', 'Heavy Convoy Driver', 'ON_MISSION', 78.2310, 15.6600, 'Transit Route Alpha-Beta', 62, 'RADIO', 'SATELLITE DEGRADED'),
  ('33333333-3333-3333-3333-000000000012', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-333333333333', 'Freja Mikkelsen', 'Supply Depot Specialist', 'IDLE', 78.2240, 15.6490, 'Main Supply Hub Svalbard', 90, 'INTERNET', 'SATELLITE AVAILABLE'),

  ('33333333-3333-3333-3333-000000000013', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-444444444444', 'Dr. Lars Berg', 'Satellite Telemetry Lead', 'ACTIVE', 78.2360, 15.6700, 'Adventdalen Radar Station', 79, 'SATELLITE', 'SATELLITE AVAILABLE'),
  ('33333333-3333-3333-3333-000000000014', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-444444444444', 'Ingrid Solberg', 'Power Systems Engineer', 'ON_MISSION', 78.2380, 15.6740, 'Generator Station Nord', 54, 'RADIO', 'SATELLITE AVAILABLE'),
  ('33333333-3333-3333-3333-000000000015', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-444444444444', 'Liam Walsh', 'Drone Mapping Pilot', 'ACTIVE', 78.2390, 15.6760, 'Adventdalen Survey Point', 43, 'SATELLITE', 'SATELLITE AVAILABLE'),
  ('33333333-3333-3333-3333-000000000016', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-444444444444', 'Sven Nygård', 'Mechanical Repair Tech', 'ACTIVE', 78.2350, 15.6680, 'Adventdalen Workshop', 88, 'INTERNET', 'SATELLITE AVAILABLE'),

  ('33333333-3333-3333-3333-000000000017', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-555555555555', 'Captain Bjørn Hansen', 'SAR Team Leader', 'ACTIVE', 78.2480, 15.6900, 'Rescue Outpost Nord', 94, 'SATELLITE', 'SATELLITE AVAILABLE'),
  ('33333333-3333-3333-3333-000000000018', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-555555555555', 'Maja Lindstrom', 'Paramedic & Rescue Swimmer', 'ACTIVE', 78.2490, 15.6920, 'Rescue Outpost Nord', 91, 'SATELLITE', 'SATELLITE AVAILABLE'),
  ('33333333-3333-3333-3333-000000000019', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-555555555555', 'Victor Moreau', 'Avalanche Safety Specialist', 'ON_MISSION', 78.2510, 15.6980, 'Sassendalen Crevasse Pass', 77, 'RADIO', 'SATELLITE AVAILABLE'),
  ('33333333-3333-3333-3333-000000000020', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-555555555555', 'Karin Olsen', 'Communications Relay Specialist', 'OFFLINE', 78.2550, 15.7100, 'Mount Operafjellet Relay', 18, 'OFFLINE QUEUE', 'SATELLITE UNAVAILABLE')
ON CONFLICT DO NOTHING;

-- Missions (10 Missions)
INSERT INTO public.missions (id, expedition_id, team_id, title, description, location_name, latitude, longitude, priority, status, deadline)
VALUES
  ('44444444-4444-4444-4444-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-111111111111', 'Vehicle Inspection & Maintenance', 'Routine health check and engine diagnostic on Polar Rover Alpha after severe blizzard.', 'Camp B - North Ridge', 78.2450, 15.6820, 'HIGH', 'EMERGENCY', NOW() + INTERVAL '2 hours'),
  ('44444444-4444-4444-4444-000000000002', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-111111111111', 'Longyearbyen Ice Core Sampling', 'Extract 50m ice core samples for climate temperature historical analysis.', 'Longyearbyen Ice Core 1', 78.2410, 15.6790, 'NORMAL', 'ACTIVE', NOW() + INTERVAL '6 hours'),
  ('44444444-4444-4444-4444-000000000003', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Foxfonna Seismic Sensor Array', 'Install 8 low-frequency geophones along Foxfonna glacial bed.', 'Foxfonna Glacier Base', 78.2100, 15.6120, 'HIGH', 'ACTIVE', NOW() + INTERVAL '12 hours'),
  ('44444444-4444-4444-4444-000000000004', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-333333333333', 'Fuel Supply Depot Transport', 'Transport 1200L Diesel Fuel to Camp B Emergency Stockpile.', 'Transit Route Alpha-Beta', 78.2310, 15.6600, 'CRITICAL', 'ACTIVE', NOW() + INTERVAL '4 hours'),
  ('44444444-4444-4444-4444-000000000005', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-444444444444', 'Satellite Dish Calibration', 'Re-align high-gain antenna following storm wind drift.', 'Adventdalen Radar Station', 78.2360, 15.6700, 'NORMAL', 'COMPLETED', NOW() - INTERVAL '1 day'),
  ('44444444-4444-4444-4444-000000000006', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-444444444444', 'Auxiliary Generator Servicing', 'Replace oil filters and check battery banks at Generator Station Nord.', 'Generator Station Nord', 78.2380, 15.6740, 'HIGH', 'ASSIGNED', NOW() + INTERVAL '1 day'),
  ('44444444-4444-4444-4444-000000000007', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-555555555555', 'Crevasse Route Safety Patrol', 'Mark hazardous ice fissures along Sassendalen traverse path.', 'Sassendalen Crevasse Pass', 78.2510, 15.6980, 'HIGH', 'ACTIVE', NOW() + INTERVAL '8 hours'),
  ('44444444-4444-4444-4444-000000000008', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-555555555555', 'Operafjellet Relay Recovery', 'Establish radio link contact with offline telemetry beacon on Mount Operafjellet.', 'Mount Operafjellet Relay', 78.2550, 15.7100, 'CRITICAL', 'DELAYED', NOW() + INTERVAL '3 hours'),
  ('44444444-4444-4444-4444-000000000009', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-333333333333', 'Medical Kit Restock', 'Deliver 4 Arctic Trauma Emergency Kits to Outpost Delta.', 'Outpost Delta', 78.2200, 15.6300, 'NORMAL', 'PLANNED', NOW() + INTERVAL '2 days'),
  ('44444444-4444-4444-4444-000000000010', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Permafrost Temperature Mapping', 'Deploy 12 thermal probes at 10m depth.', 'Foxfonna Ridge East', 78.2120, 15.6150, 'LOW', 'PLANNED', NOW() + INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- Active SOS Alert
INSERT INTO public.sos_alerts (id, expedition_id, personnel_id, team_id, latitude, longitude, location_name, battery_level, comm_channel, status, description)
VALUES (
  '55555555-5555-5555-5555-000000000001',
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-000000000001', -- Arjun Kumar
  '22222222-2222-2222-2222-111111111111', -- Team Alpha
  78.2450,
  15.6820,
  'Camp B - North Ridge',
  68,
  'SATELLITE',
  'REPORTED',
  'Polar Rover Engine Overheating & Sudden Loss of Cabin Heating during sub-zero gale force wind.'
) ON CONFLICT DO NOTHING;

-- Field Updates (Operations Inbox)
INSERT INTO public.field_updates (id, expedition_id, team_id, personnel_id, priority, status, location_name, latitude, longitude, description)
VALUES 
  ('66666666-6666-6666-6666-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-111111111111', '33333333-3333-3333-3333-000000000001', 'HIGH', 'NEW', 'Camp B - North Ridge', 78.2450, 15.6820, 'Vehicle overheating. Hydraulic line pressure dropping rapidly. Request immediate mechanical repair kit and backup dispatch.'),
  ('66666666-6666-6666-6666-000000000002', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-000000000006', 'MEDIUM', 'OPEN', 'Foxfonna Ridge East', 78.2120, 15.6150, 'Low fuel warning on generator unit 2. Remaining run-time estimated at 4.5 hours.'),
  ('66666666-6666-6666-6666-000000000003', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-333333333333', '33333333-3333-3333-3333-000000000011', 'NORMAL', 'IN_PROGRESS', 'Transit Route Alpha-Beta', 78.2310, 15.6600, 'Heavy convoy passing Checkpoint Bravo safely. All cargo secure.'),
  ('66666666-6666-6666-6666-000000000004', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-444444444444', '33333333-3333-3333-3333-000000000013', 'LOW', 'RESOLVED', 'Adventdalen Radar Station', 78.2360, 15.6700, 'Satellite antenna recalibration complete. Signal strength restored to 98%.')
ON CONFLICT DO NOTHING;

-- Resources
INSERT INTO public.resources (id, expedition_id, name, category, quantity_available, quantity_reserved, quantity_in_transit, unit, critical_threshold, location_name, status)
VALUES
  ('77777777-7777-7777-7777-000000000001', '11111111-1111-1111-1111-111111111111', 'Arctic Grade Diesel Fuel', 'Fuel', 1200, 300, 200, 'Liters', 250, 'Main Supply Hub Svalbard', 'AVAILABLE'),
  ('77777777-7777-7777-7777-000000000002', '11111111-1111-1111-1111-111111111111', 'Emergency Medical Trauma Kit', 'Medical Supplies', 14, 3, 2, 'Kits', 5, 'Main Supply Hub Svalbard', 'AVAILABLE'),
  ('77777777-7777-7777-7777-000000000003', '11111111-1111-1111-1111-111111111111', 'High-Calorie Polar Meal Rations', 'Food', 450, 100, 50, 'Packs', 100, 'Depot Alpha Warehouse', 'AVAILABLE'),
  ('77777777-7777-7777-7777-000000000004', '11111111-1111-1111-1111-111111111111', 'Heavy Vehicle Repair Toolset', 'Emergency Supplies', 2, 1, 0, 'Sets', 3, 'Adventdalen Workshop', 'LOW'),
  ('77777777-7777-7777-7777-000000000005', '11111111-1111-1111-1111-111111111111', 'Iridium Satellite Transceiver', 'Communication Equipment', 6, 2, 1, 'Units', 2, 'Main Supply Hub Svalbard', 'AVAILABLE'),
  ('77777777-7777-7777-7777-000000000006', '11111111-1111-1111-1111-111111111111', 'Portable Generator 5kW', 'Power Supplies', 1, 1, 0, 'Units', 2, 'Camp B - North Ridge', 'CRITICAL')
ON CONFLICT DO NOTHING;

-- Weather Records
INSERT INTO public.weather_conditions (id, location_name, temperature_celsius, wind_speed_kmh, visibility_km, pressure_hpa, condition, risk_level)
VALUES
  ('88888888-8888-8888-8888-000000000001', 'Camp B - North Ridge', -18.4, 42.0, 1.8, 994.2, 'Freezing Gale & Blowing Snow', 'HIGH'),
  ('88888888-8888-8888-8888-000000000002', 'Main Supply Hub Svalbard', -12.1, 18.5, 8.5, 1008.4, 'Clear Overcast', 'LOW'),
  ('88888888-8888-8888-8888-000000000003', 'Foxfonna Glacier Base', -21.0, 35.2, 3.2, 998.1, 'Blowing Snow', 'MODERATE'),
  ('88888888-8888-8888-8888-000000000004', 'Mount Operafjellet Relay', -26.5, 68.0, 0.4, 988.0, 'Severe Blizzard', 'SEVERE')
ON CONFLICT DO NOTHING;

-- Initial Audit Log
INSERT INTO public.audit_logs (user_name, user_role, action, target_type, target_id, details)
VALUES 
  ('Commander Admin', 'Commander', 'System Initialized', 'Expedition', '11111111-1111-1111-1111-111111111111', 'HQ Command Center connection established for Arctic Expedition Alpha.'),
  ('Arjun Kumar', 'Field Personnel', 'SOS Triggered', 'SOSAlert', '55555555-5555-5555-5555-000000000001', 'Emergency SOS broadcast sent via Satellite link.')
ON CONFLICT DO NOTHING;
