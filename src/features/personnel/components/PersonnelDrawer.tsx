import React, { useState } from 'react';
import { X, MapPin, Battery, Radio, Target, MessageSquare, PlusCircle, History, ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { Personnel, Mission } from '@/types';

interface PersonnelDrawerProps {
  personnel: Personnel | null;
  onClose: () => void;
  missions?: Mission[];
  onContact?: (personnel: Personnel) => void;
  onAssignMission?: (personnel: Personnel) => void;
  onViewHistory?: (personnel: Personnel) => void;
}

export const PersonnelDrawer: React.FC<PersonnelDrawerProps> = ({
  personnel,
  onClose,
  missions = [],
  onContact,
  onAssignMission,
  onViewHistory,
}) => {
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!personnel) return null;

  const assignedMission = missions.find((m) => m.id === personnel.assigned_mission_id || m.assigned_personnel_ids.includes(personnel.id));

  const handleAction = (type: 'contact' | 'assign' | 'history') => {
    if (type === 'contact') {
      if (onContact) onContact(personnel);
      setActionSuccess(`Initiating direct satellite link with ${personnel.full_name}...`);
    } else if (type === 'assign') {
      if (onAssignMission) onAssignMission(personnel);
      setActionSuccess(`Opening mission dispatch drawer for ${personnel.full_name}...`);
    } else if (type === 'history') {
      if (onViewHistory) onViewHistory(personnel);
      setActionSuccess(`Loading telemetry history for ${personnel.full_name}...`);
    }

    setTimeout(() => {
      setActionSuccess(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#09111e] border-l border-cyan-900/80 shadow-2xl flex flex-col justify-between font-sans">
      {/* Header */}
      <div className="p-4 bg-[#060c16] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
            FIELD PERSONNEL TELEMETRY
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="p-5 space-y-5 flex-1 overflow-y-auto">
        {/* Personnel Profile Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase">
              ID: {personnel.id.slice(0, 8)}
            </span>
            <h2 className="text-xl font-bold font-heading text-slate-100 mt-1">
              {personnel.full_name}
            </h2>
            <p className="text-xs text-cyan-300 font-mono mt-0.5">{personnel.role}</p>
          </div>

          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded uppercase ${
            personnel.status === 'EMERGENCY'
              ? 'bg-red-950 text-red-300 border border-red-500/80 animate-sos-flash'
              : personnel.status === 'ACTIVE'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
              : personnel.status === 'ON_MISSION'
              ? 'bg-sky-950 text-sky-300 border border-sky-500/40'
              : 'bg-slate-900 text-slate-400 border border-slate-700'
          }`}>
            ● {personnel.status}
          </span>
        </div>

        {/* Feedback Alert Banner */}
        {actionSuccess && (
          <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-mono flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          {/* Coordinates */}
          <div className="p-3 bg-[#060c16] rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>LOCATION</span>
            </div>
            <div className="font-bold text-slate-100">{personnel.latitude.toFixed(4)}° N</div>
            <div className="text-[11px] text-slate-400">{personnel.longitude.toFixed(4)}° E</div>
            <div className="text-[10px] text-cyan-300 truncate pt-1">{personnel.location_name}</div>
          </div>

          {/* Battery */}
          <div className="p-3 bg-[#060c16] rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 flex items-center space-x-1">
              <Battery className={`w-3.5 h-3.5 ${personnel.battery_level < 30 ? 'text-red-400' : 'text-emerald-400'}`} />
              <span>BATTERY</span>
            </div>
            <div className={`text-xl font-bold ${personnel.battery_level < 30 ? 'text-red-400 font-extrabold' : 'text-slate-100'}`}>
              {personnel.battery_level}%
            </div>
            <div className="text-[10px] text-slate-400">Power Bank Attached</div>
          </div>

          {/* Comms */}
          <div className="p-3 bg-[#060c16] rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 flex items-center space-x-1">
              <Radio className="w-3.5 h-3.5 text-sky-400" />
              <span>COMMUNICATION</span>
            </div>
            <div className="font-bold text-sky-300">{personnel.comm_channel}</div>
            <div className="text-[10px] text-slate-400">{personnel.satellite_status}</div>
          </div>

          {/* Last Update */}
          <div className="p-3 bg-[#060c16] rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 flex items-center space-x-1">
              <History className="w-3.5 h-3.5 text-indigo-400" />
              <span>LAST PING</span>
            </div>
            <div className="font-bold text-slate-200">
              {new Date(personnel.last_ping).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-[10px] text-slate-400">Interval: 120s</div>
          </div>
        </div>

        {/* Mission Status Card */}
        <div className="p-4 bg-[#060c16] rounded-xl border border-slate-800 space-y-2">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center space-x-1.5">
            <Target className="w-3.5 h-3.5 text-sky-400" />
            <span>ASSIGNED MISSION</span>
          </div>
          {assignedMission ? (
            <div>
              <div className="text-sm font-bold text-slate-100">{assignedMission.title}</div>
              <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">{assignedMission.description}</p>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800">
                <span>Priority: <strong className="text-cyan-300">{assignedMission.priority}</strong></span>
                <span className="text-emerald-400 font-bold">{assignedMission.status}</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">No mission currently assigned to this personnel.</div>
          )}
        </div>
      </div>

      {/* Action Footer Buttons (Section 15: CONTACT, ASSIGN MISSION, VIEW HISTORY) */}
      <div className="p-4 bg-[#060c16] border-t border-slate-800 grid grid-cols-3 gap-2 text-xs font-mono">
        <button
          onClick={() => handleAction('contact')}
          className="px-3 py-2.5 rounded-lg bg-cyan-950 border border-cyan-600 hover:bg-cyan-900 text-cyan-200 font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>CONTACT</span>
        </button>

        <button
          onClick={() => handleAction('assign')}
          className="px-3 py-2.5 rounded-lg bg-sky-950 border border-sky-600 hover:bg-sky-900 text-sky-200 font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-sky-400" />
          <span>ASSIGN MISSION</span>
        </button>

        <button
          onClick={() => handleAction('history')}
          className="px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <History className="w-4 h-4 text-indigo-400" />
          <span>VIEW HISTORY</span>
        </button>
      </div>
    </div>
  );
};
