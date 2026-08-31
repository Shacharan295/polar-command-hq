import React, { useState } from 'react';
import { X, Navigation, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { SOSAlert, Personnel } from '@/types';
import { INITIAL_PERSONNEL } from '@/lib/mockData';
import { auditService, sosService } from '@/services';
import { useAuth } from '@/context/AuthContext';

interface DispatchNearbyModalProps {
  sos: SOSAlert | null;
  onClose: () => void;
  onDispatched?: (dispatchedPersonnel: Personnel) => void;
}

export const DispatchNearbyModal: React.FC<DispatchNearbyModalProps> = ({
  sos,
  onClose,
  onDispatched,
}) => {
  const { user, currentRole } = useAuth();
  const [selectedPersonId, setSelectedPersonId] = useState<string>('33333333-3333-3333-3333-000000000017'); // Captain Bjørn Hansen SAR
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!sos) return null;

  // Nearby candidates (excluding the emergency personnel)
  const nearbyCandidates = INITIAL_PERSONNEL.filter(
    (p) => p.id !== sos.personnel_id && p.status !== 'OFFLINE'
  ).slice(0, 4);

  const handleDispatch = async () => {
    const target = nearbyCandidates.find((p) => p.id === selectedPersonId) || nearbyCandidates[0];
    setIsSubmitting(true);

    // 1. Update SOS Status in Database
    await sosService.updateStatus(sos.id, 'TEAM_DISPATCHED', user?.full_name);

    // 2. Create Audit Log Entry
    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      'Dispatched Nearby SAR Team',
      'SOSAlert',
      sos.id,
      `Dispatched ${target.full_name} (${target.role}) to Emergency SOS location at ${sos.location_name}`
    );

    setIsSubmitting(false);
    setFeedback(`Dispatched ${target.full_name} to ${sos.location_name}. Status updated to TEAM_DISPATCHED.`);

    if (onDispatched) onDispatched(target);

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b14]/85 backdrop-blur-sm p-4 font-sans">
      <div className="w-full max-w-lg bg-[#09111e] border border-cyan-900/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#060c16] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <span className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
              DISPATCH NEARBY PERSONNEL / SAR TEAM
            </span>
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
          {feedback && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-mono flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl text-xs font-mono space-y-1">
            <div className="text-red-300 font-bold">EMERGENCY TARGET LOCATION:</div>
            <div className="text-slate-100">{sos.location_name} ({sos.latitude.toFixed(4)}° N, {sos.longitude.toFixed(4)}° E)</div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-2 font-bold">
              Available Nearby Units (Ranked by Proximity)
            </label>
            <div className="space-y-2">
              {nearbyCandidates.map((candidate, idx) => (
                <div
                  key={candidate.id}
                  onClick={() => setSelectedPersonId(candidate.id)}
                  className={`p-3 rounded-xl border text-xs font-mono cursor-pointer transition-all flex items-center justify-between ${
                    selectedPersonId === candidate.id
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'bg-[#060c16] border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-100 flex items-center gap-2">
                      <span>{candidate.full_name}</span>
                      <span className="text-[9px] bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded">
                        {(1.8 + idx * 1.6).toFixed(1)} km away
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{candidate.role} • {candidate.location_name}</div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">{candidate.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#060c16] border-t border-slate-800">
          <button
            onClick={handleDispatch}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
          >
            <Navigation className="w-4 h-4" />
            <span>{isSubmitting ? 'DISPATCHING TEAM...' : 'CONFIRM & DISPATCH SELECTED UNIT'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
