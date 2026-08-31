import type { Personnel, Mission, SOSAlert, FieldUpdate, Resource, WeatherCondition, Team, Expedition, AuditLog, NotificationItem, Message } from '@/types';

export const INITIAL_EXPEDITIONS: Expedition[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Antarctic Expedition Alpha',
    code: 'EXP-ANTARCTIC-2026',
    location: 'McMurdo Sound & South Pole Sector',
    status: 'ACTIVE',
    start_date: new Date(Date.now() - 30 * 86400000).toISOString(),
    leader_name: 'Dr. Erik Lindqvist',
    created_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-222222222222',
    name: 'Concordia Dome C Traverse',
    code: 'EXP-CONCORDIA-2026',
    location: 'High Antarctic Plateau',
    status: 'PLANNING',
    start_date: new Date(Date.now() + 15 * 86400000).toISOString(),
    leader_name: 'Elena Vance',
    created_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-333333333333',
    name: 'Vostok Ice Core Expedition',
    code: 'EXP-VOSTOK-2025',
    location: 'Subglacial Lake Vostok',
    status: 'COMPLETED',
    start_date: new Date(Date.now() - 180 * 86400000).toISOString(),
    end_date: new Date(Date.now() - 30 * 86400000).toISOString(),
    leader_name: 'Marcus Holloway',
    created_at: new Date().toISOString(),
  }
];

export const INITIAL_TEAMS: Team[] = [
  { id: '22222222-2222-2222-2222-111111111111', expedition_id: '11111111-1111-1111-1111-111111111111', name: 'Team Alpha', callsign: 'ALPHA-EREBUS', color_code: '#38bdf8', created_at: new Date().toISOString() },
  { id: '22222222-2222-2222-2222-222222222222', expedition_id: '11111111-1111-1111-1111-111111111111', name: 'Team Bravo', callsign: 'BRAVO-ROSS-ICE', color_code: '#22d3ee', created_at: new Date().toISOString() },
  { id: '22222222-2222-2222-2222-333333333333', expedition_id: '11111111-1111-1111-1111-111111111111', name: 'Team Charlie', callsign: 'CHARLIE-LOGISTICS', color_code: '#f59e0b', created_at: new Date().toISOString() },
  { id: '22222222-2222-2222-2222-444444444444', expedition_id: '11111111-1111-1111-1111-111111111111', name: 'Team Delta', callsign: 'DELTA-CONCORDIA', color_code: '#a855f7', created_at: new Date().toISOString() },
  { id: '22222222-2222-2222-2222-555555555555', expedition_id: '11111111-1111-1111-1111-111111111111', name: 'Team Echo', callsign: 'ECHO-SAR-MCMURDO', color_code: '#ef4444', created_at: new Date().toISOString() }
];

export const INITIAL_PERSONNEL: Personnel[] = [
  { id: '33333333-3333-3333-3333-000000000001', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-111111111111', full_name: 'Arjun Kumar', role: 'Vehicle Inspection Specialist', status: 'EMERGENCY', latitude: -77.5300, longitude: 167.1700, location_name: 'Mount Erebus Ridge Camp B', battery_level: 68, comm_channel: 'SATELLITE', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 120000).toISOString(), assigned_mission_id: '44444444-4444-4444-4444-000000000001', created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-000000000002', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-111111111111', full_name: 'Dr. Astrid Lindholm', role: 'Lead Glaciologist', status: 'ON_MISSION', latitude: -77.5250, longitude: 167.1650, location_name: 'Erebus Glacier Tongue', battery_level: 88, comm_channel: 'SATELLITE', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 300000).toISOString(), assigned_mission_id: '44444444-4444-4444-4444-000000000002', created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-000000000003', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-111111111111', full_name: 'Klaus Meier', role: 'Polar Rover Pilot', status: 'ACTIVE', latitude: -77.5320, longitude: 167.1750, location_name: 'Mount Erebus Patrol Waypoint', battery_level: 74, comm_channel: 'RADIO', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 450000).toISOString(), created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-000000000004', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-111111111111', full_name: 'Sarah Jenkins', role: 'Safety & Field Medic', status: 'ACTIVE', latitude: -77.5290, longitude: 167.1680, location_name: 'Mount Erebus Medical Unit', battery_level: 92, comm_channel: 'SATELLITE', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 600000).toISOString(), created_at: new Date().toISOString() },

  { id: '33333333-3333-3333-3333-000000000005', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-222222222222', full_name: 'Elena Vance', role: 'Senior Geophysicist', status: 'ON_MISSION', latitude: -78.5000, longitude: 169.2000, location_name: 'Ross Ice Shelf Base', battery_level: 81, comm_channel: 'SATELLITE', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 180000).toISOString(), assigned_mission_id: '44444444-4444-4444-4444-000000000003', created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-000000000006', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-222222222222', full_name: 'Nikolai Volkov', role: 'Seismic Array Engineer', status: 'ON_MISSION', latitude: -78.5050, longitude: 169.2100, location_name: 'Ross Ice Shelf East', battery_level: 59, comm_channel: 'RADIO', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 500000).toISOString(), assigned_mission_id: '44444444-4444-4444-4444-000000000003', created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-000000000007', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-222222222222', full_name: 'Hanna Sorenson', role: 'Environmental Technician', status: 'ACTIVE', latitude: -78.4950, longitude: 169.1900, location_name: 'Ross Outpost Nord', battery_level: 95, comm_channel: 'INTERNET', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 120000).toISOString(), created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-000000000008', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-222222222222', full_name: 'Tomasz Kowalski', role: 'Ice Core Drilling Tech', status: 'ACTIVE', latitude: -78.5100, longitude: 169.2200, location_name: 'Ross Shelf Rig 2', battery_level: 78, comm_channel: 'SATELLITE', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 800000).toISOString(), created_at: new Date().toISOString() },

  { id: '33333333-3333-3333-3333-000000000009', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-333333333333', full_name: 'Marcus Holloway', role: 'Logistics Operations Chief', status: 'ACTIVE', latitude: -77.8489, longitude: 166.6686, location_name: 'McMurdo Main Supply Hub', battery_level: 98, comm_channel: 'INTERNET', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 60000).toISOString(), created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-000000000010', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-333333333333', full_name: 'Yuki Tanaka', role: 'Cargo Inventory Manager', status: 'ACTIVE', latitude: -77.8500, longitude: 166.6720, location_name: 'McMurdo Depot Warehouse', battery_level: 86, comm_channel: 'INTERNET', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 240000).toISOString(), created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-000000000011', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-333333333333', full_name: 'David O\'Connor', role: 'Heavy Convoy Driver', status: 'ON_MISSION', latitude: -78.1000, longitude: 168.0000, location_name: 'Ross Ice Shelf Transit Corridor', battery_level: 62, comm_channel: 'RADIO', satellite_status: 'SATELLITE DEGRADED', last_ping: new Date(Date.now() - 400000).toISOString(), assigned_mission_id: '44444444-4444-4444-4444-000000000004', created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-000000000012', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-333333333333', full_name: 'Freja Mikkelsen', role: 'Supply Depot Specialist', status: 'IDLE', latitude: -77.8470, longitude: 166.6650, location_name: 'McMurdo Supply Hub', battery_level: 90, comm_channel: 'INTERNET', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 720000).toISOString(), created_at: new Date().toISOString() },

  { id: '33333333-3333-3333-3333-000000000013', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-444444444444', full_name: 'Dr. Lars Berg', role: 'Satellite Telemetry Lead', status: 'ACTIVE', latitude: -75.1000, longitude: 123.3300, location_name: 'Concordia Station Dome C', battery_level: 79, comm_channel: 'SATELLITE', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 150000).toISOString(), created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-000000000014', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-444444444444', full_name: 'Ingrid Solberg', role: 'Power Systems Engineer', status: 'ON_MISSION', latitude: -75.1050, longitude: 123.3350, location_name: 'Concordia Generator Substation', battery_level: 54, comm_channel: 'RADIO', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 360000).toISOString(), assigned_mission_id: '44444444-4444-4444-4444-000000000006', created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-000000000015', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-444444444444', full_name: 'Liam Walsh', role: 'Drone Mapping Pilot', status: 'ACTIVE', latitude: -75.0980, longitude: 123.3250, location_name: 'Dome C Survey Point', battery_level: 43, comm_channel: 'SATELLITE', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 90000).toISOString(), created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-000000000016', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-444444444444', full_name: 'Sven Nygård', role: 'Mechanical Repair Tech', status: 'ACTIVE', latitude: -75.1020, longitude: 123.3320, location_name: 'Dome C Workshop', battery_level: 88, comm_channel: 'INTERNET', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 1100000).toISOString(), created_at: new Date().toISOString() },

  { id: '33333333-3333-3333-3333-000000000017', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-555555555555', full_name: 'Captain Bjørn Hansen', role: 'SAR Team Leader', status: 'ACTIVE', latitude: -77.8520, longitude: 166.6750, location_name: 'McMurdo SAR Heliport Base', battery_level: 94, comm_channel: 'SATELLITE', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 40000).toISOString(), created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-000000000018', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-555555555555', full_name: 'Maja Lindstrom', role: 'Paramedic & Rescue Swimmer', status: 'ACTIVE', latitude: -77.8530, longitude: 166.6780, location_name: 'McMurdo SAR Heliport Base', battery_level: 91, comm_channel: 'SATELLITE', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 130000).toISOString(), created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-000000000019', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-555555555555', full_name: 'Victor Moreau', role: 'Avalanche Safety Specialist', status: 'ON_MISSION', latitude: -77.5350, longitude: 167.1800, location_name: 'Mount Erebus Crevasse Pass', battery_level: 77, comm_channel: 'RADIO', satellite_status: 'SATELLITE AVAILABLE', last_ping: new Date(Date.now() - 210000).toISOString(), assigned_mission_id: '44444444-4444-4444-4444-000000000007', created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-000000000020', expedition_id: '11111111-1111-1111-1111-111111111111', team_id: '22222222-2222-2222-2222-555555555555', full_name: 'Karin Olsen', role: 'Communications Relay Specialist', status: 'OFFLINE', latitude: -77.5400, longitude: 167.1900, location_name: 'Mount Erebus Outpost Relay', battery_level: 18, comm_channel: 'OFFLINE QUEUE', satellite_status: 'SATELLITE UNAVAILABLE', last_ping: new Date(Date.now() - 7200000).toISOString(), assigned_mission_id: '44444444-4444-4444-4444-000000000008', created_at: new Date().toISOString() }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: '44444444-4444-4444-4444-000000000001',
    expedition_id: '11111111-1111-1111-1111-111111111111',
    team_id: '22222222-2222-2222-2222-111111111111',
    title: 'Vehicle Inspection & Emergency Repair',
    description: 'Routine health check and engine diagnostic on Polar Rover Alpha after severe Antarctic blizzard.',
    location_name: 'Mount Erebus Ridge Camp B',
    latitude: -77.5300,
    longitude: 167.1700,
    priority: 'HIGH',
    status: 'EMERGENCY',
    deadline: new Date(Date.now() + 7200000).toISOString(),
    assigned_personnel_ids: ['33333333-3333-3333-3333-000000000001'],
    required_resource_ids: ['77777777-7777-7777-7777-000000000004'],
    created_by: 'HQ Commander',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-000000000002',
    expedition_id: '11111111-1111-1111-1111-111111111111',
    team_id: '22222222-2222-2222-2222-111111111111',
    title: 'Erebus Ice Core Sampling',
    description: 'Extract 50m ice core samples for climate temperature historical analysis.',
    location_name: 'Erebus Glacier Tongue',
    latitude: -77.5250,
    longitude: 167.1650,
    priority: 'NORMAL',
    status: 'ACTIVE',
    deadline: new Date(Date.now() + 21600000).toISOString(),
    assigned_personnel_ids: ['33333333-3333-3333-3333-000000000002'],
    created_by: 'Dr. Erik Lindqvist',
    created_at: new Date(Date.now() - 14400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-000000000003',
    expedition_id: '11111111-1111-1111-1111-111111111111',
    team_id: '22222222-2222-2222-2222-222222222222',
    title: 'Ross Ice Shelf Seismic Array',
    description: 'Install 8 low-frequency geophones along Ross glacial ice shelf.',
    location_name: 'Ross Ice Shelf Base',
    latitude: -78.5000,
    longitude: 169.2000,
    priority: 'HIGH',
    status: 'ACTIVE',
    deadline: new Date(Date.now() + 43200000).toISOString(),
    assigned_personnel_ids: ['33333333-3333-3333-3333-000000000005', '33333333-3333-3333-3333-000000000006'],
    created_by: 'Operations Manager',
    created_at: new Date(Date.now() - 28800000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-000000000004',
    expedition_id: '11111111-1111-1111-1111-111111111111',
    team_id: '22222222-2222-2222-2222-333333333333',
    title: 'Fuel Supply Depot Transport',
    description: 'Transport 1200L Diesel Fuel to Mount Erebus Emergency Stockpile.',
    location_name: 'Ross Ice Shelf Transit Corridor',
    latitude: -78.1000,
    longitude: 168.0000,
    priority: 'CRITICAL',
    status: 'ACTIVE',
    deadline: new Date(Date.now() + 14400000).toISOString(),
    assigned_personnel_ids: ['33333333-3333-3333-3333-000000000011'],
    required_resource_ids: ['77777777-7777-7777-7777-000000000001'],
    created_by: 'Logistics Manager',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-000000000005',
    expedition_id: '11111111-1111-1111-1111-111111111111',
    team_id: '22222222-2222-2222-2222-444444444444',
    title: 'Concordia Satellite Dish Calibration',
    description: 'Re-align high-gain antenna following Antarctic plateau storm drift.',
    location_name: 'Concordia Station Dome C',
    latitude: -75.1000,
    longitude: 123.3300,
    priority: 'NORMAL',
    status: 'COMPLETED',
    assigned_personnel_ids: ['33333333-3333-3333-3333-000000000013'],
    created_by: 'HQ Commander',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
  }
];

export const INITIAL_SOS_ALERTS: SOSAlert[] = [
  {
    id: '55555555-5555-5555-5555-000000000001',
    expedition_id: '11111111-1111-1111-1111-111111111111',
    personnel_id: '33333333-3333-3333-3333-000000000001', // Arjun Kumar
    team_id: '22222222-2222-2222-2222-111111111111',
    latitude: -77.5300,
    longitude: 167.1700,
    location_name: 'Mount Erebus Ridge Camp B',
    battery_level: 68,
    comm_channel: 'SATELLITE',
    status: 'REPORTED',
    description: 'Polar Rover Engine Overheating & Sudden Loss of Cabin Heating during sub-zero gale force wind.',
    created_at: new Date(Date.now() - 180000).toISOString(),
  },
  {
    id: '55555555-5555-5555-5555-000000000002',
    expedition_id: '11111111-1111-1111-1111-111111111111',
    personnel_id: '33333333-3333-3333-3333-000000000020', // Karin Olsen
    team_id: '22222222-2222-2222-2222-555555555555',
    latitude: -77.5400,
    longitude: 167.1900,
    location_name: 'Mount Erebus Outpost Relay',
    battery_level: 42,
    comm_channel: 'SATELLITE',
    status: 'ACKNOWLEDGED',
    description: 'Satellite Relay Beacon Lost Connection & Frostbite Threat on Ridge Outpost.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '55555555-5555-5555-5555-000000000003',
    expedition_id: '11111111-1111-1111-1111-111111111111',
    personnel_id: '33333333-3333-3333-3333-000000000014', // Ingrid Solberg
    team_id: '22222222-2222-2222-2222-444444444444',
    latitude: -75.1050,
    longitude: 123.3350,
    location_name: 'Concordia Generator Substation',
    battery_level: 85,
    comm_channel: 'RADIO',
    status: 'TEAM_DISPATCHED',
    description: 'Main Power Substation Transformer Short Circuit & Secondary Battery Failover Active.',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '55555555-5555-5555-5555-000000000004',
    expedition_id: '11111111-1111-1111-1111-111111111111',
    personnel_id: '33333333-3333-3333-3333-000000000003', // Klaus Meier
    team_id: '22222222-2222-2222-2222-111111111111',
    latitude: -77.5320,
    longitude: 167.1750,
    location_name: 'Mount Erebus Patrol Waypoint',
    battery_level: 95,
    comm_channel: 'INTERNET',
    status: 'RESOLVED',
    description: 'Fuel Line Freeze on Snowmobile Transporter — Heating Sleeve Applied & Resolved.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    resolved_at: new Date(Date.now() - 43200000).toISOString(),
  }
];

export const INITIAL_FIELD_UPDATES: FieldUpdate[] = [
  {
    id: '66666666-6666-6666-6666-000000000001',
    expedition_id: '11111111-1111-1111-1111-111111111111',
    team_id: '22222222-2222-2222-2222-111111111111',
    personnel_id: '33333333-3333-3333-3333-000000000001',
    priority: 'HIGH',
    status: 'NEW',
    location_name: 'Mount Erebus Ridge Camp B',
    latitude: -77.5300,
    longitude: 167.1700,
    description: 'Vehicle overheating. Hydraulic line pressure dropping rapidly. Request immediate mechanical repair kit and backup dispatch.',
    related_mission_id: '44444444-4444-4444-4444-000000000001',
    created_at: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: '66666666-6666-6666-6666-000000000002',
    expedition_id: '11111111-1111-1111-1111-111111111111',
    team_id: '22222222-2222-2222-2222-222222222222',
    personnel_id: '33333333-3333-3333-3333-000000000006',
    priority: 'MEDIUM',
    status: 'OPEN',
    location_name: 'Ross Ice Shelf East',
    latitude: -78.5050,
    longitude: 169.2100,
    description: 'Low fuel warning on generator unit 2. Remaining run-time estimated at 4.5 hours.',
    created_at: new Date(Date.now() - 420000).toISOString(),
  },
  {
    id: '66666666-6666-6666-6666-000000000003',
    expedition_id: '11111111-1111-1111-1111-111111111111',
    team_id: '22222222-2222-2222-2222-333333333333',
    personnel_id: '33333333-3333-3333-3333-000000000011',
    priority: 'NORMAL',
    status: 'IN_PROGRESS',
    location_name: 'Ross Ice Shelf Transit Corridor',
    latitude: -78.1000,
    longitude: 168.0000,
    description: 'Heavy convoy passing Checkpoint Ross safely. All cargo secure.',
    created_at: new Date(Date.now() - 720000).toISOString(),
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  { id: '77777777-7777-7777-7777-000000000001', expedition_id: '11111111-1111-1111-1111-111111111111', name: 'Arctic Grade Diesel Fuel', category: 'Fuel', quantity_available: 1200, quantity_reserved: 300, quantity_in_transit: 200, unit: 'Liters', critical_threshold: 250, location_name: 'McMurdo Main Supply Hub', status: 'AVAILABLE', created_at: new Date().toISOString() },
  { id: '77777777-7777-7777-7777-000000000002', expedition_id: '11111111-1111-1111-1111-111111111111', name: 'Emergency Medical Trauma Kit', category: 'Medical Supplies', quantity_available: 14, quantity_reserved: 3, quantity_in_transit: 2, unit: 'Kits', critical_threshold: 5, location_name: 'McMurdo Main Supply Hub', status: 'AVAILABLE', created_at: new Date().toISOString() },
  { id: '77777777-7777-7777-7777-000000000003', expedition_id: '11111111-1111-1111-1111-111111111111', name: 'High-Calorie Polar Meal Rations', category: 'Food', quantity_available: 450, quantity_reserved: 100, quantity_in_transit: 50, unit: 'Packs', critical_threshold: 100, location_name: 'McMurdo Depot Warehouse', status: 'AVAILABLE', created_at: new Date().toISOString() },
  { id: '77777777-7777-7777-7777-000000000004', expedition_id: '11111111-1111-1111-1111-111111111111', name: 'Heavy Vehicle Repair Toolset', category: 'Emergency Supplies', quantity_available: 2, quantity_reserved: 1, quantity_in_transit: 0, unit: 'Sets', critical_threshold: 3, location_name: 'McMurdo Depot Workshop', status: 'LOW', created_at: new Date().toISOString() },
  { id: '77777777-7777-7777-7777-000000000005', expedition_id: '11111111-1111-1111-1111-111111111111', name: 'Iridium Satellite Transceiver', category: 'Communication Equipment', quantity_available: 6, quantity_reserved: 2, quantity_in_transit: 1, unit: 'Units', critical_threshold: 2, location_name: 'McMurdo Main Supply Hub', status: 'AVAILABLE', created_at: new Date().toISOString() },
  { id: '77777777-7777-7777-7777-000000000006', expedition_id: '11111111-1111-1111-1111-111111111111', name: 'Portable Generator 5kW', category: 'Power Supplies', quantity_available: 1, quantity_reserved: 1, quantity_in_transit: 0, unit: 'Units', critical_threshold: 2, location_name: 'Mount Erebus Ridge Camp B', status: 'CRITICAL', created_at: new Date().toISOString() }
];

export const INITIAL_WEATHER: WeatherCondition[] = [
  { id: '88888888-8888-8888-8888-000000000001', location_name: 'Mount Erebus Ridge Camp B', temperature_celsius: -32.4, wind_speed_kmh: 58.0, visibility_km: 1.2, pressure_hpa: 984.2, condition: 'Freezing Gale & Heavy Blowing Snow', risk_level: 'HIGH', recorded_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-000000000002', location_name: 'McMurdo Main Supply Hub', temperature_celsius: -22.1, wind_speed_kmh: 24.5, visibility_km: 8.5, pressure_hpa: 998.4, condition: 'Clear Overcast', risk_level: 'LOW', recorded_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-000000000003', location_name: 'Concordia Plateau Station', temperature_celsius: -48.0, wind_speed_kmh: 42.2, visibility_km: 2.5, pressure_hpa: 968.1, condition: 'Extreme Ice Crystal Fog', risk_level: 'HIGH', recorded_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-000000000004', location_name: 'South Pole Observatory', temperature_celsius: -55.5, wind_speed_kmh: 75.0, visibility_km: 0.3, pressure_hpa: 955.0, condition: 'Severe Whiteout Blizzard', risk_level: 'SEVERE', recorded_at: new Date().toISOString() }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: '99999999-9999-9999-9999-000000000001', user_id: '00000000-0000-0000-0000-000000000001', user_name: 'Commander Admin', user_role: 'Commander', action: 'System Initialized', target_type: 'Expedition', target_id: '11111111-1111-1111-1111-111111111111', details: 'HQ Command Center telemetry stream activated for Antarctic Expedition Alpha.', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '99999999-9999-9999-9999-000000000002', user_id: '33333333-3333-3333-3333-000000000001', user_name: 'Arjun Kumar', user_role: 'Operations Manager', action: 'SOS Triggered', target_type: 'SOSAlert', target_id: '55555555-5555-5555-5555-000000000001', details: 'Field emergency broadcast sent: Rover engine overheat at Erebus Camp B.', timestamp: new Date(Date.now() - 180000).toISOString() }
];

export const INITIAL_RESOURCE_REQUESTS: any[] = [
  {
    id: 'req-001',
    expedition_id: '11111111-1111-1111-1111-111111111111',
    team_id: '22222222-2222-2222-2222-111111111111',
    personnel_id: '33333333-3333-3333-3333-000000000001',
    resource_id: '77777777-7777-7777-7777-000000000001',
    resource_name: 'Arctic Grade Diesel Fuel',
    quantity_requested: 200,
    unit: 'Liters',
    priority: 'HIGH',
    location_name: 'Mount Erebus Ridge Camp B',
    status: 'PENDING',
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'req-002',
    expedition_id: '11111111-1111-1111-1111-111111111111',
    team_id: '22222222-2222-2222-2222-222222222222',
    personnel_id: '33333333-3333-3333-3333-000000000005',
    resource_id: '77777777-7777-7777-7777-000000000002',
    resource_name: 'Emergency Medical Trauma Kit',
    quantity_requested: 2,
    unit: 'Kits',
    priority: 'MEDIUM',
    location_name: 'Ross Ice Shelf Base',
    status: 'APPROVED',
    reviewed_by: 'Commander Admin',
    created_at: new Date(Date.now() - 1200000).toISOString(),
  }
];
