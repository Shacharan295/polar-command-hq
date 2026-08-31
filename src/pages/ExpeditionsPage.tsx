import React from 'react';
import { Globe, Plus, Compass, Calendar, User, ShieldCheck } from 'lucide-react';
import { INITIAL_EXPEDITIONS } from '@/lib/mockData';

export const ExpeditionsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1424] border border-cyan-900/60 p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              Expedition Operations
            </span>
          </div>
          <h1 className="text-xl font-extrabold font-heading text-slate-100">
            POLAR EXPEDITIONS DIRECTORY
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active, planned, and archived high-latitude Arctic operational deployments.
          </p>
        </div>

        <button className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold flex items-center space-x-2 shadow-lg transition-colors cursor-pointer self-start md:self-auto">
          <Plus className="w-4 h-4" />
          <span>NEW EXPEDITION</span>
        </button>
      </div>

      {/* Expeditions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {INITIAL_EXPEDITIONS.map((exp) => (
          <div
            key={exp.id}
            className={`bg-[#0b1320] border rounded-xl p-5 space-y-4 transition-all hover:border-cyan-500/50 ${
              exp.status === 'ACTIVE'
                ? 'border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                : 'border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {exp.code}
                </span>
                <h3 className="text-base font-bold font-heading text-slate-100 mt-2">
                  {exp.name}
                </h3>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                exp.status === 'ACTIVE'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : exp.status === 'PLANNING'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {exp.status}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-300 border-t border-b border-slate-800/80 py-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" /> Sector:
                </span>
                <span className="font-semibold text-slate-200">{exp.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-400" /> Lead:
                </span>
                <span className="font-semibold text-slate-200">{exp.leader_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Deployed:
                </span>
                <span className="text-slate-300">{new Date(exp.start_date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" /> 5 Teams Assigned
              </span>
              <button className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 cursor-pointer">
                VIEW DATA &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
