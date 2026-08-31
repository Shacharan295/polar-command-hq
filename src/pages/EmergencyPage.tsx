import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, History } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { INITIAL_PERSONNEL } from '@/lib/mockData';
import type { SOSAlert } from '@/types';
import { EmergencyResponsePanel } from '@/features/emergencies/components/EmergencyResponsePanel';

export const EmergencyPage: React.FC = () => {
  // ─── Use shared context — changes here propagate to Dashboard, map, badge ──
  const { sosAlerts, resolveSOSAlert } = useAppData();

  const activeAlerts = sosAlerts.filter((s) => s.status !== 'RESOLVED');
  const resolvedAlerts = sosAlerts.filter((s) => s.status === 'RESOLVED');

  // Default to the most critical unresolved alert
  const [selectedSOS, setSelectedSOS] = useState<SOSAlert | null>(activeAlerts[0] || null);

  // When resolved via the response panel, use the shared context action
  // then auto-select the next active alert
  const handleSOSResolved = (resolvedId: string) => {
    resolveSOSAlert(resolvedId);

    // Find remaining active alerts after this resolution
    const remaining = activeAlerts.filter((s) => s.id !== resolvedId);
    setSelectedSOS(remaining.length > 0 ? remaining[0] : null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-red-950/40 border border-red-500/60 p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="text-xs font-mono font-bold text-red-300 uppercase tracking-widest">
              Emergency Response &amp; Incident Control Center
            </span>
          </div>
          <h1 className="text-xl font-extrabold font-heading text-slate-100">
            CRITICAL SOS EMERGENCY DISPATCH &amp; RESOLUTION LIFECYCLE
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Closed-loop emergency dispatch lifecycle: Acknowledge &rarr; Instructions &rarr; Dispatch SAR &rarr; Assign Emergency Cargo &rarr; Resolve.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-red-950 border border-red-500/80 text-red-300 font-mono text-xs font-bold flex items-center space-x-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-sos-flash">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span>🚨 ACTIVE UNRESOLVED SOS: {activeAlerts.length}</span>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active SOS Alerts Feed + Resolved History */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Emergencies Card List */}
          <div className="bg-[#0b1320] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-red-400 uppercase">
                Active Emergency Incidents ({activeAlerts.length})
              </span>
              <span className="text-[10px] font-mono bg-red-950 text-red-200 px-2 py-0.5 rounded border border-red-800 font-bold">
                REALTIME
              </span>
            </div>

            {activeAlerts.length === 0 ? (
              <div className="p-6 text-center font-mono space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-xs text-emerald-400 bg-emerald-950/20 rounded-xl border border-emerald-800/40 p-3">
                  ✓ NO ACTIVE UNRESOLVED EMERGENCIES IN McMURDO SECTOR
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeAlerts.map((sos) => {
                  const person = INITIAL_PERSONNEL.find((p) => p.id === sos.personnel_id);
                  const isSelected = selectedSOS?.id === sos.id;
                  return (
                    <div
                      key={sos.id}
                      onClick={() => setSelectedSOS(sos)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-red-950/80 border-red-500 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                          : 'bg-[#060c16] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-red-300">🚨 {person?.full_name || 'Field Personnel'}</span>
                        <span className="text-[10px] bg-red-900/80 px-2 py-0.5 rounded text-red-200 uppercase font-bold">
                          {sos.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-sans">{sos.description}</p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                        <span className="truncate max-w-[120px]">{sos.location_name}</span>
                        <span>BATTERY: {sos.battery_level}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Resolved Incident History */}
          <div className="bg-[#0b1320] border border-slate-800 rounded-xl p-4 space-y-3 font-sans">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs font-mono font-bold text-emerald-400">
              <History className="w-4 h-4" />
              <span>RESOLVED INCIDENT HISTORY ({resolvedAlerts.length})</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-xs">
              {resolvedAlerts.map((sos) => {
                const person = INITIAL_PERSONNEL.find((p) => p.id === sos.personnel_id);
                return (
                  <div key={sos.id} className="p-3 bg-[#060c16] rounded-lg border border-slate-800/80 space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-200">{person?.full_name}</span>
                      <span className="text-emerald-400 text-[10px] font-bold">✓ RESOLVED</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans line-clamp-1">{sos.description}</p>
                    <div className="text-[9px] text-slate-500 flex justify-between">
                      <span className="truncate max-w-[100px]">{sos.location_name}</span>
                      <span>
                        Resolved {sos.resolved_at
                          ? new Date(sos.resolved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Recently'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: SOS Response Lifecycle Control Panel */}
        <div className="lg:col-span-8 bg-[#0b1320] border border-slate-800 rounded-xl p-5">
          <EmergencyResponsePanel
            sos={selectedSOS}
            onSOSResolved={handleSOSResolved}
          />
        </div>
      </div>
    </div>
  );
};
