import React, { useState } from 'react';
import { X, Target, Clock, MapPin, Users, Boxes, CheckCircle2, AlertTriangle, Send, XCircle } from 'lucide-react';
import type { Mission, MissionStatus } from '@/types';
import { INITIAL_TEAMS, INITIAL_PERSONNEL, INITIAL_RESOURCES } from '@/lib/mockData';
import { missionService, auditService } from '@/services';
import { useAuth } from '@/context/AuthContext';

interface MissionDetailModalProps {
  mission: Mission | null;
  onClose: () => void;
  onStatusChange?: (missionId: string, newStatus: MissionStatus) => void;
}

export const MissionDetailModal: React.FC<MissionDetailModalProps> = ({
  mission,
  onClose,
  onStatusChange,
}) => {
  const { user, currentRole } = useAuth();
  const [currentStatus, setCurrentStatus] = useState<MissionStatus>(mission?.status || 'ASSIGNED');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!mission) return null;

  const assignedTeam = INITIAL_TEAMS.find((t) => t.id === mission.team_id) || INITIAL_TEAMS[0];
  const assignedPersonnel = INITIAL_PERSONNEL.filter((p) => mission.assigned_personnel_ids.includes(p.id));

  const handleUpdateStatus = async (newStatus: MissionStatus, actionText: string) => {
    setCurrentStatus(newStatus);
    mission.status = newStatus;

    if (onStatusChange) {
      onStatusChange(mission.id, newStatus);
    }

    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      actionText,
      'Mission',
      mission.id,
      `Updated mission status for "${mission.title}" to ${newStatus}`
    );

    setFeedback(`Mission status updated to ${newStatus}. Audit log recorded.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b14]/85 backdrop-blur-sm p-4 font-sans">
      <div className="w-full max-w-xl bg-[#09111e] border border-cyan-900/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#060c16] border-b border-slate-800 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-slate-100 uppercase tracking-wider">
              MISSION TELEMETRY DETAIL
            </span>
            <span className="text-slate-400">({mission.id.slice(0, 8)})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          {/* Title & Status */}
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                mission.priority === 'CRITICAL' || mission.priority === 'HIGH'
                  ? 'bg-red-950 text-red-300 border border-red-500/80'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              }`}>
                {mission.priority} PRIORITY
              </span>
              <h2 className="text-lg font-bold font-heading text-slate-100 mt-1">
                {mission.title}
              </h2>
            </div>

            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded uppercase ${
              currentStatus === 'EMERGENCY'
                ? 'bg-red-950 text-red-300 border border-red-500/80 animate-pulse'
                : currentStatus === 'ACTIVE'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                : currentStatus === 'COMPLETED'
                ? 'bg-slate-800 text-slate-400'
                : 'bg-amber-950 text-amber-300 border border-amber-500/40'
            }`}>
              STATUS: {currentStatus}
            </span>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-mono flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Description */}
          <div className="p-4 bg-[#060c16] rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Tactical Instructions:</div>
            <p className="text-xs text-slate-200 font-sans leading-relaxed">{mission.description}</p>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#060c16] rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px]">ASSIGNED TEAM</div>
              <div className="font-bold text-cyan-300">{assignedTeam.name}</div>
              <div className="text-[10px] text-slate-400">{assignedTeam.callsign}</div>
            </div>

            <div className="p-3 bg-[#060c16] rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px]">TARGET LOCATION</div>
              <div className="font-bold text-slate-100">{mission.location_name}</div>
              <div className="text-[10px] text-slate-400">{mission.latitude.toFixed(4)}° N, {mission.longitude.toFixed(4)}° E</div>
            </div>
          </div>
        </div>

        {/* Action Controls (Section 27) */}
        <div className="p-4 bg-[#060c16] border-t border-slate-800 font-mono text-xs space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase">COMMAND ACTIONS:</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleUpdateStatus('ACTIVE', 'Marked Mission Active')}
              className="py-2 px-2 rounded-lg bg-sky-950 border border-sky-600 hover:bg-sky-900 text-sky-200 font-bold cursor-pointer transition-colors"
            >
              MARK ACTIVE
            </button>

            <button
              onClick={() => handleUpdateStatus('DELAYED', 'Marked Mission Delayed')}
              className="py-2 px-2 rounded-lg bg-amber-950 border border-amber-600 hover:bg-amber-900 text-amber-200 font-bold cursor-pointer transition-colors"
            >
              MARK DELAYED
            </button>

            <button
              onClick={() => handleUpdateStatus('COMPLETED', 'Marked Mission Completed')}
              className="py-2 px-2 rounded-lg bg-emerald-950 border border-emerald-600 hover:bg-emerald-900 text-emerald-200 font-bold cursor-pointer transition-colors"
            >
              COMPLETED
            </button>

            <button
              onClick={() => handleUpdateStatus('CANCELLED', 'Cancelled Mission')}
              className="py-2 px-2 rounded-lg bg-red-950 border border-red-700 hover:bg-red-900 text-red-300 font-bold cursor-pointer transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
