import React from 'react';
import { Sliders, AlertTriangle } from 'lucide-react';
import { DemoEventControls } from '@/features/demo/components/DemoEventControls';

export const DemoModePage: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-950/40 border border-amber-500/60 p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
              Hackathon Simulation Environment
            </span>
          </div>
          <h1 className="text-xl font-extrabold font-heading text-slate-100">
            DEMO MODE & SIMULATED FIELD EVENT CONTROLS
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Trigger real database events to simulate field mobile application activities during hackathon judging.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded bg-amber-900/60 border border-amber-500 text-amber-200 text-xs font-mono font-bold">
          ● REAL DATABASE EVENTS ACTIVE
        </div>
      </div>

      {/* Demo Event Controls */}
      <DemoEventControls />
    </div>
  );
};
