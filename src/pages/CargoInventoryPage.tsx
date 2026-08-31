import React from 'react';
import { Package, Truck, Layers, CheckCircle2 } from 'lucide-react';

export const CargoInventoryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1424] border border-cyan-900/60 p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Package className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              Cargo & Inventory Manifest
            </span>
          </div>
          <h1 className="text-xl font-extrabold font-heading text-slate-100">
            WAREHOUSE & CONVOY INVENTORY
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            SKU tracking, storage bin indexing, and convoy shipping manifest management.
          </p>
        </div>
      </div>

      <div className="bg-[#0b1320] border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider">
          Active Cargo Convoys & Warehouse Bins
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-[#060c16] p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="text-cyan-400 font-bold">BIN-ALPHA-01</div>
            <div className="text-slate-200">Trauma Medical Supplies (14 Kits)</div>
            <div className="text-[10px] text-emerald-400">STATUS: INSPECTED & READY</div>
          </div>
          <div className="bg-[#060c16] p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold">CONVOY-BETA-HIGHWAY</div>
            <div className="text-slate-200">Diesel Fuel Transport (1200L)</div>
            <div className="text-[10px] text-sky-400">STATUS: IN TRANSIT (Route Alpha)</div>
          </div>
          <div className="bg-[#060c16] p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="text-indigo-400 font-bold">BIN-WORKSHOP-04</div>
            <div className="text-slate-200">Hydraulic Seals & Repair Kits</div>
            <div className="text-[10px] text-amber-400">STATUS: RESERVED FOR TEAM ALPHA</div>
          </div>
        </div>
      </div>
    </div>
  );
};
