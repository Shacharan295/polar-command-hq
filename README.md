# 🏔️ DHRUVA COMMAND
### Integrated Expedition HQ Command & Control System

DHRUVA COMMAND is a real-time, database-backed HQ Command and Control System built for Expedition Logistics, Field Personnel Telemetry Tracking, Incident Emergency SOS Dispatch, and Closed-Loop Mission Control.


The system communicates asynchronously through **Supabase PostgreSQL** and **Supabase Realtime**, serving as the operational HQ node designed to operate seamlessly alongside remote field personnel mobile applications.

---

## 📐 1. System Architecture & Closed-Loop Principle

```
FIELD MOBILE APP 
       ↓ (Field Update / SOS / GPS Location / Resource Request)
SUPABASE POSTGRESQL & REALTIME ENGINE
       ↓ (Incremental Realtime Broadcast)
HQ COMMAND CENTER
       ↓ (Validation & HQ Operational Action)
SUPABASE POSTGRESQL (DB Update + Audit Log + Notification)
       ↓ (Realtime Broadcast Response)
FIELD MOBILE APP ACKNOWLEDGMENT
```

### The Core Closed-Loop Command Principle
Every operational action taken within POLAR COMMAND strictly executes the following closed-loop pipeline:

$$\text{HQ Action} \longrightarrow \text{DB Validation} \longrightarrow \text{Supabase Update} \longrightarrow \text{Realtime Event} \longrightarrow \text{UI Refresh} \longrightarrow \text{Audit Log} \longrightarrow \text{Notification}$$

No action relies on transient React variables or fake simulation states. Database integrity constraints are enforced at every step (e.g., resource allocations validate actual available stock before allowing assignments).

---

## 👥 2. Role Separation & Operational Focuses

POLAR COMMAND operates with a single **HQ Admin Login** (`Commander Admin`), allowing the administrator to switch operational role focus from the top header navigation bar. While visibility across all operational data remains unrestricted, each role focus emphasizes specific workflows:

| Role Focus | Primary Operational Focus | Key Action Capabilities |
| :--- | :--- | :--- |
| **COMMANDER / ADMIN** | Overall Command & System Administration | Personnel management, team assignments, system status review, immutable audit trail inspection. |
| **OPERATIONS MANAGER** | Mission Execution & Operations Inbox | Review incoming field updates, acknowledge field reports, dispatch new missions, track mission progress, mark delays, complete objectives. |
| **LOGISTICS MANAGER** | Resources, Cargo & Requisitions | Review field resource requests (`PENDING` &rarr; `APPROVED`/`REJECTED`), check database stock levels, dispatch convoy transfers, restock stockpiles, resolve shortages. |
| **EMERGENCY COORDINATOR** | SOS Incidents & Rescue Response | Acknowledge emergency SOS broadcasts, send satellite shelter orders, find and dispatch nearby SAR units, assign emergency cargo, escalate, resolve incidents. |

---

## 🎛️ 3. Primary Workspaces & Feature Details

POLAR COMMAND features **10 primary operational workspaces**:

```
SIDEBAR WORKSPACES
├── 1. COMMAND CENTER         (Tactical overview & OpenStreetMap engine)
├── 2. OPERATIONS             (Field updates inbox & mission execution)
├── 3. LOGISTICS              (Resource requisitions workflow & cargo inventory)
├── 4. EMERGENCY / SOS        (SOS incident control panel & SAR dispatch)
├── 5. PERSONNEL              (Roster 100+ capacity, teams & GPS telemetry)
├── 6. MISSIONS               (Mission directory, dispatch modal & timeline)
├── 7. COMMUNICATIONS         (Satellite Gateway messaging abstraction)
├── 8. WEATHER                (Meteorological stations & weather alerts)
├── 9. AUDIT LOG              (Immutable system audit history trail)
└── 10. SETTINGS              (Supabase credentials & system configuration)
```

### 1. Command Center (`command-center`)
- **Top KPI Strip**: Realtime operational metrics backed directly by Supabase (`Active Personnel`, `Active Missions`, `Active Emergencies`, `Resource Shortages`, `Offline Personnel`). Clicking any KPI navigates directly to the relevant workspace.
- **Large Leaflet Tactical Map**: OpenStreetMap engine centered over the Svalbard Grid (`78.22° N, 15.65° E`). Features geographically distributed team outposts (Team Alpha, Team Bravo, Team Charlie, Team Delta, Team Echo), pulsing red emergency markers, supply route polyline, and status beacon DivIcons.
- **Right-Side Operations Panel**: Displays active critical SOS alerts and incoming field reports.
- **Interactive Personnel Detail Drawer**: Clicking any personnel marker opens a slide-over drawer displaying location coordinates, battery %, satellite channel status, assigned mission, and action triggers (`CONTACT`, `ASSIGN MISSION`, `VIEW HISTORY`).

### 2. Operations Workspace (`operations`)
- **Incoming Field Report Inbox**: Displays field reports sent from expedition teams.
- **Field Update Lifecycle**: `NEW` &rarr; `ACKNOWLEDGED` &rarr; `ACTION ASSIGNED` &rarr; `IN_PROGRESS` &rarr; `RESOLVED`.
- **Mission Execution Trail**: Tracks live tactical missions, priorities, assigned teams, and status milestones.

### 3. Logistics Workspace (`logistics`)
- **Field Resource Requisitions Table**: Reviews supply requests submitted by field personnel.
- **Requisition Lifecycle**: `PENDING` &rarr; `APPROVED` / `REJECTED` &rarr; `ASSIGNED` &rarr; `IN_TRANSIT` &rarr; `DELIVERED`.
- **Database Inventory Validation**: Before approving any request, HQ validates actual available stockpile levels. If requested quantity exceeds available stock, an error alert prevents impossible assignments.
- **Stockpile Management Modal**: Restock supply levels, dispatch convoy transfers to outposts, and update inventory states (`AVAILABLE`, `LOW`, `CRITICAL`, `IN_TRANSIT`, `RESERVED`).

### 4. Emergency / SOS Workspace (`emergency`)
- **SOS Incident Control Panel**: Manages critical emergency broadcasts.
- **7-Stage Emergency Response Lifecycle**:
  `REPORTED` &rarr; `ACKNOWLEDGED` &rarr; `RESPONSE_INITIATED` &rarr; `TEAM_DISPATCHED` &rarr; `RESOURCES_ASSIGNED` &rarr; `UNDER_CONTROL` &rarr; `RESOLVED`.
- **SAR Dispatch Finder**: Identifies nearby personnel and rescue teams based on actual latitude/longitude coordinates and distance metrics.
- **Emergency Order Dispatch**: Transmits emergency survival orders over satellite link.

### 5. Personnel Workspace (`personnel`)
- **100+ Roster Capacity**: Filterable and searchable roster supporting up to 200 field personnel with pagination.
- **Search & Multi-Column Sorting**: Search by name, role, or location. Filter by team or status (`ACTIVE`, `ON_MISSION`, `EMERGENCY`, `IDLE`, `OFFLINE`). Sort by Name, Status, Battery Level, or Last Ping.
- **Telemetry Drawer Integration**: Clicking any row opens full personnel telemetry details.

### 6. Missions Workspace (`missions`)
- **Mission Directory**: Inspect all planned, active, delayed, and completed missions.
- **Dispatch New Mission Modal**: Form to dispatch tactical missions with fields: Title, Target Location Coordinates, Priority (`LOW`, `NORMAL`, `HIGH`, `CRITICAL`), Assigned Team & Personnel Lead, Deadline (Hours), and Required Cargo Resources.
- **Mission Status Updates**: HQ can mark missions active, indicate environmental delays, complete objectives, or cancel missions.

### 7. Communications Workspace (`communications`)
- **Satellite Gateway Abstraction Model**: Models HQ &rarr; Satellite Gateway &rarr; Satellite Network &rarr; Field Personnel.
- **Gateway Health Selector**: Switch satellite communication state between `SATELLITE AVAILABLE` (98%), `SATELLITE DEGRADED` (45%), and `SATELLITE UNAVAILABLE` (0%).
- **Group & Direct Messaging**: Broadcast messages to team channels (`HQ Operations`, `Team Alpha`, `Team Bravo`, etc.) or individual personnel. Displays delivery state (`SENT`, `DELIVERED`, `ACKNOWLEDGED`).

### 8. Weather Workspace (`weather`)
- **High Arctic Meteorological Telemetry**: Monitor polar weather station telemetry: Temperature (°C), Wind Speed (km/h), Visibility (km), Atmospheric Pressure (hPa), Weather Condition, and Risk Level (`LOW`, `MODERATE`, `HIGH`, `SEVERE`).
- **HQ Weather Actions**: Take tactical actions on storm warnings:
  - **`NOTIFY TEAM`**: Transmit weather warning.
  - **`MODIFY MISSION`**: Adjust mission schedules for storm safety.
  - **`PAUSE MISSION`**: Halts operations during whiteout blizzards.
  - **`SEND INSTRUCTION`**: Broadcast emergency shelter orders.

### 9. Audit Log Workspace (`activity`)
- **Immutable System History**: Displays chronological log entries for every HQ action, field update, SOS dispatch, logistics approval, and mission status change.
- **Log Fields**: Timestamp, User Name, Role, Action, Target Entity, Target ID, Description.

### 10. Settings Workspace (`settings`)
- **System & Supabase Configuration**: Displays active Supabase project URL, RLS status, table subscriptions, and environment settings.

---

## 🗄️ 4. Supabase Database Schema (15 PostgreSQL Tables)

POLAR COMMAND uses a relational PostgreSQL database schema defined in [`supabase/schema.sql`](file:///C:/Users/Admin/.gemini/antigravity/scratch/polar-command/supabase/schema.sql):

```sql
users                -- HQ Admin and User Profiles
teams                -- Tactical Field Teams (Alpha, Bravo, Charlie, Delta, Echo)
personnel            -- Field Personnel Roster & Realtime GPS Telemetry
missions             -- Tactical Operational Missions
locations            -- Historical GPS Telemetry Logs
field_updates        -- Operations Inbox Reports
incidents            -- General Incident Records
sos_alerts           -- Emergency SOS Broadcasts
resources            -- Inventory Stockpiles & Supply Levels
resource_requests    -- Field Requisition Workflow Requests
resource_assignments -- Cargo Allocations & Convoy Transfers
messages             -- Channel & Direct Satellite Messages
notifications        -- Priority Notification Feed
weather_conditions   -- Weather Station Readings
audit_logs           -- Immutable Action Logs
```

---

## 🔄 5. Step-by-Step Operational Workflows & Process

### Process 1: Emergency SOS Response Workflow
1. **Field Event**: An SOS alert is logged in Supabase (`sos_alerts`).
2. **HQ Notification**: The Header Emergency badge pulses **`🚨 1`** and the Emergency Panel updates via Supabase Realtime without reloading the page.
3. **Acknowledge**: Emergency Coordinator clicks **`ACKNOWLEDGE`**. Status updates from `REPORTED` &rarr; `ACKNOWLEDGED`.
4. **Send Order**: Click **`INSTRUCTIONS`**, enter survival instructions, and transmit. Status updates to `RESPONSE_INITIATED`.
5. **Dispatch SAR**: Click **`DISPATCH SAR`**. System calculates nearby units by GPS distance. Select Captain Bjørn Hansen (2.1 km away) and confirm. Status updates to `TEAM_DISPATCHED`.
6. **Assign Cargo**: Click **`ASSIGN CARGO`**, allocate Heavy Vehicle Repair Toolset, and confirm. Status updates to `RESOURCES_ASSIGNED`.
7. **Resolve**: Click **`RESOLVE SOS`**. Incident status changes to `RESOLVED`.
8. **Audit Trail**: Action is recorded in `audit_logs`.

### Process 2: Resource Requisition Workflow
1. **Field Request**: Field personnel request 200L Diesel Fuel (`resource_requests`).
2. **Logistics Review**: Logistics Manager inspects request in `LOGISTICS` workspace.
3. **Database Inventory Check**: System validates requested quantity against available stock in `resources`.
4. **Approve / Reject**:
   - If stock is sufficient: Request marked `APPROVED`, available stock decreases, reserved stock increases, audit log created.
   - If stock is insufficient: Action blocked with error alert.
5. **Convoy Dispatch**: Mark `IN_TRANSIT` &rarr; `DELIVERED`.

---

## 🚀 6. Installation & Execution

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# Clone or navigate to the project directory
cd C:\Users\Admin\.gemini\antigravity\scratch\polar-command

# Install dependencies
npm install
```

### Running Locally
```bash
# Start local Vite development server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Verifying Production Build
```bash
# Execute TypeScript type check & Vite production build
npm run build
```

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Custom Arctic Visual Language (`#070d18` foundation, ice-blue accents)
- **Icons**: Lucide React
- **Mapping**: Leaflet, React-Leaflet, OpenStreetMap
- **Backend & Database**: Supabase (PostgreSQL DDL, Supabase Realtime Stream, Supabase Auth)
