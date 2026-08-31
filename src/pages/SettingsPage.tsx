import React from 'react';
import { Settings, Shield, Database, Radio, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export const SettingsPage: React.FC = () => {
  const isConfigured = isSupabaseConfigured();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1424] border border-cyan-900/60 p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Settings className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              System Settings & Integrations
            </span>
          </div>
          <h1 className="text-xl font-extrabold font-heading text-slate-100">
            COMMAND CENTER CONFIGURATION
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supabase connection parameters, Realtime subscription channels, and Leaflet map settings.
          </p>
        </div>
      </div>

      <div className="bg-[#0b1320] border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" /> SUPABASE DATABASE CONNECTION
        </h3>

        <div className="p-4 bg-[#060c16] rounded-lg border border-slate-800 text-xs font-mono space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Connection Status:</span>
            <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
              isConfigured ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
            }`}>
              {isConfigured ? 'LIVE SUPABASE CONNECTED' : 'IN-MEMORY DEMO FALLBACK ACTIVE'}
            </span>
          </div>
          <div className="text-slate-500 text-[11px]">
            Target URL: <code className="text-slate-300">{import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-polar-command.supabase.co'}</code>
          </div>
        </div>
      </div>
    </div>
  );
};
