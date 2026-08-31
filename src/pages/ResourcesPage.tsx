import React, { useState } from 'react';
import { Boxes, AlertTriangle, Plus, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { INITIAL_RESOURCES } from '@/lib/mockData';
import type { Resource } from '@/types';
import { ManageResourceModal } from '@/features/resources/components/ManageResourceModal';

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1424] border border-cyan-900/60 p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Boxes className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              Logistics & Resource Management
            </span>
          </div>
          <h1 className="text-xl font-extrabold font-heading text-slate-100">
            EXPEDITION RESOURCE STOCKPILES ({resources.length} TRACKED)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor fuel reserves, medical supplies, rations, and emergency equipment thresholds.
          </p>
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((res) => (
          <div key={res.id} className="bg-[#0b1320] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  {res.category}
                </span>
                <h3 className="text-base font-bold font-heading text-slate-100 mt-0.5">
                  {res.name}
                </h3>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                res.status === 'CRITICAL'
                  ? 'bg-red-950 text-red-300 border border-red-500/80 animate-pulse'
                  : res.status === 'LOW'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/60'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
              }`}>
                {res.status}
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Available Level:</span>
                <span className="text-sm font-bold text-cyan-300">{res.quantity_available} {res.unit}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>In Transit / Reserved:</span>
                <span>{res.quantity_in_transit} / {res.quantity_reserved} {res.unit}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-[10px]">
                <span>Critical Threshold:</span>
                <span className="text-amber-400">{res.critical_threshold} {res.unit}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">{res.location_name}</span>
              <button
                onClick={() => setSelectedResource(res)}
                className="px-2.5 py-1 bg-cyan-950 border border-cyan-800 hover:border-cyan-400 text-cyan-300 rounded text-xs font-mono cursor-pointer"
              >
                MANAGE &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedResource && (
        <ManageResourceModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onResourceUpdated={(updated) => {
            setResources((prev) => prev.map((r) => r.id === updated.id ? updated : r));
          }}
        />
      )}
    </div>
  );
};
