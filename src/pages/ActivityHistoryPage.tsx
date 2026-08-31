import React from 'react';
import { History, Shield, UserCheck, Clock } from 'lucide-react';
import { INITIAL_AUDIT_LOGS } from '@/lib/mockData';

export const ActivityHistoryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1424] border border-cyan-900/60 p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <History className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              Audit & Activity Log
            </span>
          </div>
          <h1 className="text-xl font-extrabold font-heading text-slate-100">
            SYSTEM AUDIT TRAIL & EVENT LOGS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log of all HQ command decisions, emergency dispatches, resource allocations, and field reports.
          </p>
        </div>
      </div>

      <div className="bg-[#0b1320] border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="space-y-3 font-mono text-xs">
          {INITIAL_AUDIT_LOGS.map((log) => (
            <div key={log.id} className="p-4 rounded-lg bg-[#060c16] border border-slate-800 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-cyan-400 font-bold">{log.user_name}</span>
                  <span className="text-[10px] bg-cyan-950 px-2 py-0.5 rounded text-cyan-300 border border-cyan-800">
                    {log.user_role}
                  </span>
                  <span className="text-emerald-400 font-bold">• {log.action}</span>
                </div>
                <p className="text-slate-300 font-sans text-xs pt-1">{log.details}</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
