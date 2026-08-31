import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Target,
  CloudSnow,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import type { HQRole, Personnel } from '@/types';
import type { NavTab } from '@/components/layout/Sidebar';
import { KPIStrip } from '@/features/dashboard/components/KPIStrip';
import { LiveMap } from '@/features/dashboard/components/LiveMap';
import { PersonnelDrawer } from '@/features/personnel/components/PersonnelDrawer';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { useAppData } from '@/context/AppDataContext';
import { INITIAL_MISSIONS, INITIAL_WEATHER, INITIAL_AUDIT_LOGS } from '@/lib/mockData';

interface DashboardPageProps {
  currentRole: HQRole;
  onNavigate?: (tab: NavTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentRole,
  onNavigate = () => {},
}) => {
  // ─── Global shared state from AppDataContext ───────────────────────────────
  const {
    personnel,
    setPersonnel,
    sosAlerts,
    setSosAlerts,
    fieldUpdates,
    setFieldUpdates,
    resources,
    activeSOSAlerts,
    resourceAlerts,
  } = useAppData();

  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);

  // Subscribe to Supabase Realtime Stream (updates shared context state)
  useSupabaseRealtime({
    onSOSAlert: (payload) => {
      if (payload.new) {
        setSosAlerts((prev) => [payload.new as any, ...prev]);
      }
    },
    onFieldUpdate: (payload) => {
      if (payload.new) {
        setFieldUpdates((prev) => [payload.new as any, ...prev]);
      }
    },
    onLocationUpdate: (payload) => {
      if (payload.new && payload.new.personnel_id) {
        setPersonnel((prev) =>
          prev.map((p) =>
            p.id === payload.new.personnel_id
              ? { ...p, latitude: payload.new.latitude, longitude: payload.new.longitude }
              : p
          )
        );
      }
    },
  });

  // ─── Derived from shared state ─────────────────────────────────────────────
  // Show the most critical active SOS in the priority card
  const activeSOS =
    activeSOSAlerts.find((s) => s.status === 'REPORTED') ||
    activeSOSAlerts.find((s) => s.status === 'ACKNOWLEDGED') ||
    activeSOSAlerts[0] ||
    null;

  const activeSOSPerson = activeSOS
    ? personnel.find((p) => p.id === activeSOS.personnel_id) || null
    : null;

  // ─── Derived secondary grid content ───────────────────────────────────────
  // Resource shortage: worst critical resource
  const criticalResource =
    resources.find((r) => r.status === 'CRITICAL') ||
    resources.find((r) => r.status === 'LOW') ||
    null;

  // Active missions: highest priority non-completed mission
  const priorityOrder = { CRITICAL: 0, HIGH: 1, NORMAL: 2, LOW: 3 };
  const featuredMission = INITIAL_MISSIONS.filter(
    (m) => m.status !== 'COMPLETED' && m.status !== 'CANCELLED'
  ).sort(
    (a, b) =>
      (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9)
  )[0] || null;

  // Weather: worst risk station
  const worstWeather =
    INITIAL_WEATHER.find((w) => w.risk_level === 'SEVERE') ||
    INITIAL_WEATHER.find((w) => w.risk_level === 'HIGH') ||
    INITIAL_WEATHER[0];

  // Recent audit entry
  const latestAuditLog = INITIAL_AUDIT_LOGS[0] || null;

  return (
    <div className="space-y-5 relative font-sans">
      {/* 1. TOP KPI STRIP — all counts derived from shared context */}
      <KPIStrip
        personnel={personnel}
        missions={INITIAL_MISSIONS}
        sosAlerts={sosAlerts}
        resources={resources}
        onNavigate={onNavigate}
      />

      {/* 2. MAIN OPERATIONAL STAGE: LARGE LIVE MAP + PRIORITY EMERGENCY CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">

        {/* MAP CONTAINER */}
        <div className="lg:col-span-8 bg-[#0b1320] border border-cyan-900/60 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[480px] relative">

          {/* Map Header Toolbar */}
          <div className="bg-[#08101d] border-b border-cyan-900/40 px-4 py-2.5 flex items-center justify-between z-10 select-none">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
                LIVE ANTARCTIC TACTICAL MAP (MCMURDO SECTOR 77.85° S)
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {personnel.length} Personnel Tracked
              </span>
              <span className={`px-2 py-0.5 rounded font-bold border ${
                activeSOSAlerts.length > 0
                  ? 'bg-red-950 text-red-300 border-red-800 animate-sos-flash'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                {activeSOSAlerts.length} SOS Active
              </span>
            </div>
          </div>

          {/* Interactive Leaflet Map Component */}
          <div className="flex-1 min-h-[440px] relative">
            <LiveMap
              personnel={personnel}
              sosAlerts={sosAlerts}
              missions={INITIAL_MISSIONS}
              onSelectPersonnel={(p) => setSelectedPersonnel(p)}
              selectedPersonnelId={selectedPersonnel?.id}
            />
          </div>
        </div>

        {/* RIGHT PANEL: PRIORITY ACTIVE EMERGENCY + OPERATIONS INBOX */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">

          {/* PRIORITY CRITICAL SOS CARD — automatically cycles through active emergencies */}
          {activeSOS ? (
            <div className="bg-red-950/70 border-2 border-red-500/80 rounded-xl p-4 shadow-[0_0_25px_rgba(239,68,68,0.25)] space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-red-300 font-mono font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
                  <span>🚨 CRITICAL EMERGENCY SOS</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-900 text-red-200 border border-red-500 animate-sos-flash uppercase">
                  {activeSOS.status}
                </span>
              </div>

              {/* SOS Detail Summary */}
              <div className="bg-[#0b1320] p-3 rounded-lg border border-red-900/60 space-y-2 text-xs font-mono">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400">Personnel:</span>
                  <button
                    onClick={() => activeSOSPerson && setSelectedPersonnel(activeSOSPerson)}
                    className="text-slate-100 font-bold text-sm hover:text-cyan-300 underline cursor-pointer"
                  >
                    {activeSOSPerson?.full_name || 'Field Unit'} &rarr;
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-200 text-right max-w-[160px] truncate">{activeSOS.location_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Battery / Comms:</span>
                  <span className="text-amber-300 font-bold">
                    {activeSOS.battery_level}% • {activeSOS.comm_channel}
                  </span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">Active Emergencies:</span>
                  <span className="text-red-300 font-bold">{activeSOSAlerts.length} unresolved</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-tight pt-1 border-t border-slate-800">
                  "{activeSOS.description}"
                </p>
              </div>

              {/* Quick Command Actions */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => onNavigate('communications')}
                  className="px-2.5 py-2 rounded bg-cyan-950 border border-cyan-600 hover:bg-cyan-900 text-cyan-200 font-bold cursor-pointer transition-colors text-center"
                >
                  CONTACT
                </button>
                <button
                  onClick={() => onNavigate('emergency')}
                  className="px-2.5 py-2 rounded bg-red-900 border border-red-500 hover:bg-red-800 text-white font-bold cursor-pointer transition-colors text-center"
                >
                  OPEN EMERGENCY &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-950/40 border border-emerald-500/60 rounded-xl p-5 font-mono text-xs text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="font-bold text-slate-100 text-sm">NO ACTIVE UNRESOLVED EMERGENCIES</div>
              <p className="text-slate-400 text-[11px] font-sans">
                All McMurdo Antarctic Sector emergency incidents have been resolved.
              </p>
            </div>
          )}

          {/* OPERATIONS INBOX / FIELD UPDATES SUMMARY */}
          <div className="bg-[#0b1320] border border-slate-800 rounded-xl p-4 flex-1 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 uppercase">
              <span>Operations Inbox</span>
              <button
                onClick={() => onNavigate('operations')}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                {fieldUpdates.length} Updates &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {fieldUpdates.slice(0, 3).map((update) => (
                <div key={update.id} className="p-2.5 rounded bg-[#060c16] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      update.priority === 'HIGH' || update.priority === 'CRITICAL'
                        ? 'bg-red-950 text-red-300'
                        : 'bg-cyan-950 text-cyan-300'
                    }`}>
                      {update.priority}
                    </span>
                    <span className="text-slate-400 truncate max-w-[120px]">{update.location_name}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans line-clamp-1">{update.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECONDARY TACTICAL OPERATIONS GRID — all derived from live data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">

        {/* Resource Shortage Card — derived from live resources */}
        <div
          onClick={() => onNavigate('logistics')}
          className="bg-[#0b1320] border border-slate-800 hover:border-amber-500/60 rounded-xl p-4 space-y-2 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300 uppercase">
            <span>Resource Shortages</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          {criticalResource ? (
            <div className="p-3 bg-[#060c16] rounded border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-slate-100 font-bold truncate">{criticalResource.name}</div>
              <div className={`text-[11px] font-bold ${criticalResource.status === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}`}>
                {criticalResource.quantity_available} / {criticalResource.critical_threshold} {criticalResource.unit} ({criticalResource.status})
              </div>
              <div className="text-[10px] text-slate-500 truncate">{criticalResource.location_name}</div>
            </div>
          ) : (
            <div className="p-3 bg-[#060c16] rounded border border-slate-800 text-xs font-mono text-emerald-400">
              All resources within threshold
            </div>
          )}
          <div className="text-[10px] font-mono text-amber-400/70">
            {resourceAlerts.length} alert{resourceAlerts.length !== 1 ? 's' : ''} total &rarr;
          </div>
        </div>

        {/* Active Missions Card — derived from live missions */}
        <div
          onClick={() => onNavigate('operations')}
          className="bg-[#0b1320] border border-slate-800 hover:border-sky-500/60 rounded-xl p-4 space-y-2 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs font-mono font-bold text-sky-300 uppercase">
            <span>Active Missions</span>
            <Target className="w-4 h-4 text-sky-400" />
          </div>
          {featuredMission ? (
            <div className="p-3 bg-[#060c16] rounded border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-slate-100 font-bold truncate">{featuredMission.title}</div>
              <div className="text-sky-300 text-[11px]">
                Status: {featuredMission.status} • {featuredMission.priority} Priority
              </div>
              <div className="text-[10px] text-slate-500 truncate">{featuredMission.location_name}</div>
            </div>
          ) : (
            <div className="p-3 bg-[#060c16] rounded border border-slate-800 text-xs font-mono text-slate-400">
              No active missions
            </div>
          )}
          <div className="text-[10px] font-mono text-sky-400/70">
            {INITIAL_MISSIONS.filter((m) => m.status !== 'COMPLETED' && m.status !== 'CANCELLED').length} missions active &rarr;
          </div>
        </div>

        {/* Weather Risk Card — derived from live weather data */}
        <div
          onClick={() => onNavigate('weather')}
          className="bg-[#0b1320] border border-slate-800 hover:border-cyan-500/60 rounded-xl p-4 space-y-2 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-300 uppercase">
            <span>Weather Risk</span>
            <CloudSnow className="w-4 h-4 text-cyan-400" />
          </div>
          {worstWeather ? (
            <div className="p-3 bg-[#060c16] rounded border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-slate-100 font-bold truncate">{worstWeather.location_name}</div>
              <div className={`text-[11px] font-bold ${
                worstWeather.risk_level === 'SEVERE' ? 'text-red-400' : 'text-amber-400'
              }`}>
                {worstWeather.temperature_celsius}°C • {worstWeather.wind_speed_kmh} km/h
              </div>
              <div className="text-[10px] text-slate-500 truncate">{worstWeather.condition}</div>
            </div>
          ) : (
            <div className="p-3 bg-[#060c16] rounded border border-slate-800 text-xs font-mono text-slate-400">
              No weather data
            </div>
          )}
          <div className={`text-[10px] font-mono ${
            worstWeather?.risk_level === 'SEVERE' ? 'text-red-400/70' : 'text-amber-400/70'
          }`}>
            Highest Risk: {worstWeather?.risk_level || 'LOW'} &rarr;
          </div>
        </div>

        {/* Recent Activity Card — derived from audit logs */}
        <div
          onClick={() => onNavigate('activity')}
          className="bg-[#0b1320] border border-slate-800 hover:border-emerald-500/60 rounded-xl p-4 space-y-2 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 uppercase">
            <span>Recent Audit Activity</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          {latestAuditLog ? (
            <div className="p-3 bg-[#060c16] rounded border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-cyan-300 font-bold truncate">{latestAuditLog.user_name}</div>
              <div className="text-slate-300 text-[11px] truncate">{latestAuditLog.action}</div>
              <div className="text-[10px] text-slate-500">
                {new Date(latestAuditLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#060c16] rounded border border-slate-800 text-xs font-mono text-slate-400">
              No recent activity
            </div>
          )}
          <div className="text-[10px] font-mono text-emerald-400/70">
            View full audit log &rarr;
          </div>
        </div>
      </div>

      {/* 4. PERSONNEL DETAIL DRAWER */}
      <PersonnelDrawer
        personnel={selectedPersonnel}
        onClose={() => setSelectedPersonnel(null)}
        missions={INITIAL_MISSIONS}
        onContact={() => onNavigate('communications')}
        onAssignMission={() => onNavigate('missions')}
        onViewHistory={() => onNavigate('activity')}
      />
    </div>
  );
};
