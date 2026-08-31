// DHRUVA COMMAND Data Models & Type Definitions


export type HQRole = 
  | 'Commander' 
  | 'Operations Manager' 
  | 'Logistics Manager' 
  | 'Emergency Coordinator';

export type PersonnelStatus = 
  | 'ACTIVE' 
  | 'IDLE' 
  | 'ON_MISSION' 
  | 'OFFLINE' 
  | 'EMERGENCY' 
  | 'DELAYED';

export type MissionStatus = 
  | 'PLANNED' 
  | 'ASSIGNED' 
  | 'ACCEPTED' 
  | 'ACTIVE' 
  | 'DELAYED' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'EMERGENCY';

export type MissionPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export type SOSStatus = 
  | 'REPORTED' 
  | 'ACKNOWLEDGED' 
  | 'UNDER_REVIEW' 
  | 'RESPONSE_INITIATED' 
  | 'TEAM_DISPATCHED' 
  | 'RESOURCES_ASSIGNED' 
  | 'CONTACT_ESTABLISHED'
  | 'PERSONNEL_SAFE'
  | 'UNDER_CONTROL'
  | 'ESCALATED' 
  | 'RESOLVED';

export type FieldUpdatePriority = 'LOW' | 'NORMAL' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type FieldUpdateStatus = 'NEW' | 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED';

export type ResourceCategory = 
  | 'Fuel' 
  | 'Medical Supplies' 
  | 'Food' 
  | 'Emergency Supplies' 
  | 'Scientific Equipment' 
  | 'Power Supplies' 
  | 'Communication Equipment';

export type ResourceStatus = 'AVAILABLE' | 'LOW' | 'CRITICAL' | 'IN_TRANSIT' | 'RESERVED';

export type ResourceRequestStatus = 
  | 'PENDING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'ASSIGNED' 
  | 'IN_TRANSIT' 
  | 'DELIVERED' 
  | 'CANCELLED';

export interface ResourceRequest {
  id: string;
  expedition_id: string;
  team_id: string;
  personnel_id: string;
  resource_id: string;
  resource_name: string;
  quantity_requested: number;
  unit: string;
  priority: FieldUpdatePriority;
  location_name: string;
  status: ResourceRequestStatus;
  reviewed_by?: string;
  created_at: string;
  updated_at?: string;
}

export type CargoStatus = 'PREPARING' | 'DISPATCHED' | 'IN_TRANSIT' | 'ARRIVED' | 'DELIVERED';

export interface Cargo {
  id: string;
  expedition_id: string;
  contents: string;
  quantity: number;
  unit: string;
  origin: string;
  destination: string;
  assigned_team_id: string;
  priority: FieldUpdatePriority;
  status: CargoStatus;
  eta: string;
  created_at: string;
}

export type CommChannel = 'INTERNET' | 'SATELLITE' | 'RADIO' | 'OFFLINE QUEUE';



export type SatelliteStatus = 'SATELLITE AVAILABLE' | 'SATELLITE DEGRADED' | 'SATELLITE UNAVAILABLE';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: HQRole;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Expedition {
  id: string;
  name: string;
  code: string;
  location: string;
  status: 'PLANNING' | 'ACTIVE' | 'DELAYED' | 'PAUSED' | 'COMPLETED' | 'EMERGENCY';
  start_date: string;
  end_date?: string;
  leader_name?: string;
  created_at: string;
}

export interface Team {
  id: string;
  expedition_id: string;
  name: string;
  callsign: string;
  leader_id?: string;
  color_code: string;
  created_at: string;
}

export interface Personnel {
  id: string;
  expedition_id: string;
  team_id?: string;
  full_name: string;
  role: string;
  status: PersonnelStatus;
  latitude: number;
  longitude: number;
  location_name: string;
  battery_level: number;
  comm_channel: CommChannel;
  satellite_status: SatelliteStatus;
  last_ping: string;
  assigned_mission_id?: string;
  created_at: string;
}

export interface Mission {
  id: string;
  expedition_id: string;
  team_id?: string;
  title: string;
  description: string;
  location_name: string;
  latitude: number;
  longitude: number;
  priority: MissionPriority;
  status: MissionStatus;
  deadline?: string;
  assigned_personnel_ids: string[];
  required_resource_ids?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SOSAlert {
  id: string;
  expedition_id: string;
  personnel_id: string;
  team_id?: string;
  latitude: number;
  longitude: number;
  location_name: string;
  battery_level: number;
  comm_channel: CommChannel;
  status: SOSStatus;
  description: string;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  created_at: string;
}

export interface FieldUpdate {
  id: string;
  expedition_id: string;
  team_id?: string;
  personnel_id: string;
  priority: FieldUpdatePriority;
  status: FieldUpdateStatus;
  location_name: string;
  latitude?: number;
  longitude?: number;
  description: string;
  attachment_url?: string;
  related_mission_id?: string;
  related_incident_id?: string;
  created_at: string;
}

export interface Resource {
  id: string;
  expedition_id: string;
  name: string;
  category: ResourceCategory;
  quantity_available: number;
  quantity_reserved: number;
  quantity_in_transit: number;
  unit: string;
  critical_threshold: number;
  location_name: string;
  status: ResourceStatus;
  created_at: string;
}

export interface Message {
  id: string;
  expedition_id: string;
  sender_id: string;
  sender_name: string;
  recipient_id?: string;
  team_id?: string;
  personnel_id?: string;
  mission_id?: string;
  incident_id?: string;
  cargo_id?: string;
  channel: CommChannel;
  message: string;
  priority: 'NORMAL' | 'HIGH' | 'CRITICAL';
  status: 'SENT' | 'DELIVERED' | 'READ' | 'ACKNOWLEDGED';
  created_at: string;
}


export interface WeatherCondition {
  id: string;
  location_name: string;
  temperature_celsius: number;
  wind_speed_kmh: number;
  visibility_km: number;
  pressure_hpa: number;
  condition: string;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  recorded_at: string;
}

export interface NotificationItem {
  id: string;
  type: 
    | 'NEW_SOS' 
    | 'NEW_FIELD_UPDATE' 
    | 'RESOURCE_SHORTAGE' 
    | 'MISSION_DELAY' 
    | 'SEVERE_WEATHER' 
    | 'LOW_BATTERY' 
    | 'COMM_LOST' 
    | 'COMM_RESTORED' 
    | 'MISSION_COMPLETED' 
    | 'CARGO_DELAY';
  title: string;
  message: string;
  target_id?: string;
  target_type?: string;
  read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: HQRole;
  action: string;
  target_type: string;
  target_id: string;
  details: string;
  timestamp: string;
}
