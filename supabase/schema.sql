-- POLAR COMMAND - Database Schema DDL & Seed Data
-- Database Engine: PostgreSQL / Supabase
-- Target System: HQ Command Center & Field App Shared Backend

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USERS & PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Operations Manager',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. EXPEDITIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.expeditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- PLANNING, ACTIVE, DELAYED, PAUSED, COMPLETED, EMERGENCY
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  leader_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. TEAMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expedition_id UUID REFERENCES public.expeditions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  callsign TEXT UNIQUE NOT NULL,
  leader_id UUID,
  color_code TEXT NOT NULL DEFAULT '#38bdf8',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. PERSONNEL
-- ============================================================
CREATE TABLE IF NOT EXISTS public.personnel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expedition_id UUID REFERENCES public.expeditions(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, IDLE, ON_MISSION, OFFLINE, EMERGENCY, DELAYED
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location_name TEXT NOT NULL,
  battery_level INT NOT NULL DEFAULT 100,
  comm_channel TEXT NOT NULL DEFAULT 'SATELLITE', -- INTERNET, SATELLITE, RADIO, OFFLINE QUEUE
  satellite_status TEXT NOT NULL DEFAULT 'SATELLITE AVAILABLE', -- SATELLITE AVAILABLE, SATELLITE DEGRADED, SATELLITE UNAVAILABLE
  last_ping TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_mission_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. MISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expedition_id UUID REFERENCES public.expeditions(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location_name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  priority TEXT NOT NULL DEFAULT 'NORMAL', -- LOW, NORMAL, HIGH, CRITICAL
  status TEXT NOT NULL DEFAULT 'PLANNED', -- PLANNED, ASSIGNED, ACCEPTED, ACTIVE, DELAYED, COMPLETED, CANCELLED, EMERGENCY
  deadline TIMESTAMPTZ,
  assigned_personnel_ids UUID[] DEFAULT '{}',
  required_resource_ids UUID[] DEFAULT '{}',
  created_by TEXT NOT NULL DEFAULT 'HQ Commander',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. LOCATIONS (Location History Logs)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  personnel_id UUID REFERENCES public.personnel(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy_meters DOUBLE PRECISION DEFAULT 5.0,
  battery_level INT,
  comm_channel TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 7. FIELD UPDATES (Operations Inbox)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.field_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expedition_id UUID REFERENCES public.expeditions(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  personnel_id UUID REFERENCES public.personnel(id) ON DELETE CASCADE,
  priority TEXT NOT NULL DEFAULT 'NORMAL', -- LOW, NORMAL, MEDIUM, HIGH, CRITICAL
  status TEXT NOT NULL DEFAULT 'NEW', -- NEW, OPEN, IN_PROGRESS, RESOLVED
  location_name TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  description TEXT NOT NULL,
  attachment_url TEXT,
  related_mission_id UUID REFERENCES public.missions(id) ON DELETE SET NULL,
  related_incident_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 8. RESOURCE REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resource_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expedition_id UUID REFERENCES public.expeditions(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  personnel_id UUID REFERENCES public.personnel(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  resource_name TEXT NOT NULL,
  quantity_requested DOUBLE PRECISION NOT NULL,
  unit TEXT NOT NULL DEFAULT 'units',
  priority TEXT NOT NULL DEFAULT 'NORMAL',
  location_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, ASSIGNED, IN_TRANSIT, DELIVERED, CANCELLED
  reviewed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 9. INCIDENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expedition_id UUID REFERENCES public.expeditions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'HIGH', -- LOW, MEDIUM, HIGH, CRITICAL
  status TEXT NOT NULL DEFAULT 'OPEN', -- OPEN, INVESTIGATING, DISPATCHED, RESOLVED
  location_name TEXT NOT NULL,
  description TEXT NOT NULL,
  reported_by UUID REFERENCES public.personnel(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 9. SOS ALERTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sos_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expedition_id UUID REFERENCES public.expeditions(id) ON DELETE CASCADE,
  personnel_id UUID REFERENCES public.personnel(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location_name TEXT NOT NULL,
  battery_level INT NOT NULL,
  comm_channel TEXT NOT NULL DEFAULT 'SATELLITE',
  status TEXT NOT NULL DEFAULT 'REPORTED', -- REPORTED, ACKNOWLEDGED, UNDER_REVIEW, RESPONSE_INITIATED, TEAM_DISPATCHED, RESOURCES_ASSIGNED, ESCALATED, RESOLVED
  description TEXT NOT NULL,
  acknowledged_by TEXT,
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 10. RESOURCES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expedition_id UUID REFERENCES public.expeditions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- Fuel, Medical Supplies, Food, Emergency Supplies, Scientific Equipment, Power Supplies, Communication Equipment
  quantity_available DOUBLE PRECISION NOT NULL DEFAULT 0,
  quantity_reserved DOUBLE PRECISION NOT NULL DEFAULT 0,
  quantity_in_transit DOUBLE PRECISION NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'units',
  critical_threshold DOUBLE PRECISION NOT NULL DEFAULT 10,
  location_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE, LOW, CRITICAL, IN_TRANSIT, RESERVED
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 11. INVENTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  item_name TEXT NOT NULL,
  storage_bin TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  condition TEXT NOT NULL DEFAULT 'GOOD', -- GOOD, INSPECTION_REQUIRED, DAMAGED
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 12. ASSETS (Vehicles & Heavy Equipment)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expedition_id UUID REFERENCES public.expeditions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- Rover, Snowmobile, Generator, Drone, Crane
  status TEXT NOT NULL DEFAULT 'OPERATIONAL', -- OPERATIONAL, MAINTENANCE, IN_USE, DAMAGED
  assigned_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  fuel_level_percent INT DEFAULT 100,
  last_serviced TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 13. RESOURCE ASSIGNMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resource_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES public.missions(id) ON DELETE SET NULL,
  sos_id UUID REFERENCES public.sos_alerts(id) ON DELETE SET NULL,
  assigned_to_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  quantity DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL DEFAULT 'ASSIGNED', -- ASSIGNED, IN_TRANSIT, DELIVERED, RETURNED
  assigned_by TEXT NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 14. MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expedition_id UUID REFERENCES public.expeditions(id) ON DELETE CASCADE,
  sender_id UUID,
  sender_name TEXT NOT NULL,
  recipient_id UUID,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  channel TEXT NOT NULL DEFAULT 'SATELLITE', -- INTERNET, SATELLITE, RADIO, OFFLINE QUEUE
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'NORMAL', -- NORMAL, HIGH, CRITICAL
  status TEXT NOT NULL DEFAULT 'SENT', -- SENT, DELIVERED, ACKNOWLEDGED
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 15. WEATHER CONDITIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.weather_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_name TEXT NOT NULL,
  temperature_celsius DOUBLE PRECISION NOT NULL,
  wind_speed_kmh DOUBLE PRECISION NOT NULL,
  visibility_km DOUBLE PRECISION NOT NULL,
  pressure_hpa DOUBLE PRECISION NOT NULL,
  condition TEXT NOT NULL,
  risk_level TEXT NOT NULL DEFAULT 'MODERATE', -- LOW, MODERATE, HIGH, SEVERE
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 16. NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_id UUID,
  target_type TEXT,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 17. AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 18. DEMO EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.demo_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_personnel_expedition ON public.personnel(expedition_id);
CREATE INDEX IF NOT EXISTS idx_personnel_team ON public.personnel(team_id);
CREATE INDEX IF NOT EXISTS idx_personnel_status ON public.personnel(status);

CREATE INDEX IF NOT EXISTS idx_missions_expedition ON public.missions(expedition_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON public.missions(status);

CREATE INDEX IF NOT EXISTS idx_sos_alerts_status ON public.sos_alerts(status);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_personnel ON public.sos_alerts(personnel_id);

CREATE INDEX IF NOT EXISTS idx_field_updates_status ON public.field_updates(status);
CREATE INDEX IF NOT EXISTS idx_field_updates_priority ON public.field_updates(priority);

CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);

-- ============================================================
-- REALTIME PUBLICATION ENABLEMENT
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.personnel;
ALTER PUBLICATION supabase_realtime ADD TABLE public.missions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sos_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.field_updates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.resources;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.weather_conditions;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expeditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_events ENABLE ROW LEVEL SECURITY;

-- Allow public / authenticated access for Admin HQ operations
CREATE POLICY "Allow public read access" ON public.expeditions FOR SELECT USING (true);
CREATE POLICY "Allow public all access" ON public.personnel FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.teams FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.missions FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.sos_alerts FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.field_updates FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.resources FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.inventory FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.assets FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.messages FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.notifications FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.audit_logs FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.weather_conditions FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.demo_events FOR ALL USING (true);
