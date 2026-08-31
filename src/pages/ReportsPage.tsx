import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1424] border border-cyan-900/60 p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              Executive Analytics & Operational Reports
            </span>
          </div>
          <h1 className="text-xl font-extrabold font-heading text-slate-100">
            EXPEDITION PERFORMANCE & SAFETY AUDIT SUMMARY
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Lightweight operational reporting metrics, mission success rate, emergency frequency, and cargo availability ratios.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="bg-[#0b1320] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="text-xs text-slate-400 uppercase">Mission Completion Rate</div>
          <div className="text-3xl font-bold text-cyan-300">83.3%</div>
          <p className="text-[11px] text-slate-500">10 Total Missions (5 Active, 1 Completed, 1 Emergency)</p>
        </div>

        <div className="bg-[#0b1320] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="text-xs text-slate-400 uppercase">Resource Health Index</div>
          <div className="text-3xl font-bold text-emerald-300">91.5%</div>
          <p className="text-[11px] text-slate-500">1 Shortage Alert (Generator 5kW at Camp B)</p>
        </div>

        <div className="bg-[#0b1320] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="text-xs text-slate-400 uppercase">Personnel Readiness</div>
          <div className="text-3xl font-bold text-sky-300">95.0%</div>
          <p className="text-[11px] text-slate-500">20 Total Field Personnel (1 Emergency SOS active)</p>
        </div>
      </div>
    </div>
  );
};
