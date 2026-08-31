import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { INITIAL_SOS_ALERTS, INITIAL_FIELD_UPDATES } from '@/lib/mockData';
import { EmergencyResponsePanel } from '@/features/emergencies/components/EmergencyResponsePanel';

export const IncidentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1424] border border-cyan-900/60 p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
              Emergency & Incident Response HQ
            </span>
          </div>
          <h1 className="text-xl font-extrabold font-heading text-slate-100">
            INCIDENTS & SOS ALERTS COMMAND CENTER
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time emergency status workflow, dispatch order assignment, and field report inbox.
          </p>
        </div>
      </div>

      {/* Active Emergency SOS Command Panel */}
      <EmergencyResponsePanel sos={INITIAL_SOS_ALERTS[0] || null} />

      {/* Historical Incident Log */}
      <div className="bg-[#0b1320] border border-slate-800 rounded-xl p-5 space-y-3 font-sans">
        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          Recent Field Updates & Incident Operations Inbox
        </h3>
        <div className="space-y-3">
          {INITIAL_FIELD_UPDATES.map((update) => (
            <div key={update.id} className="p-4 rounded-lg bg-[#060c16] border border-slate-800 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    update.priority === 'HIGH' ? 'bg-red-950 text-red-300 border border-red-700' : 'bg-cyan-950 text-cyan-300'
                  }`}>
                    {update.priority}
                  </span>
                  <span className="text-slate-200 font-bold">{update.location_name}</span>
                </div>
                <p className="text-xs text-slate-300 font-sans">{update.description}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {new Date(update.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
