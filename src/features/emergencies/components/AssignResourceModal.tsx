import React, { useState } from 'react';
import { X, Boxes, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { SOSAlert, Resource } from '@/types';
import { INITIAL_RESOURCES } from '@/lib/mockData';
import { auditService, sosService } from '@/services';
import { useAuth } from '@/context/AuthContext';

interface AssignResourceModalProps {
  sos: SOSAlert | null;
  onClose: () => void;
  onAssigned?: (resource: Resource, quantity: number) => void;
}

export const AssignResourceModal: React.FC<AssignResourceModalProps> = ({
  sos,
  onClose,
  onAssigned,
}) => {
  const { user, currentRole } = useAuth();
  const [selectedResourceId, setSelectedResourceId] = useState<string>('77777777-7777-7777-7777-000000000004'); // Vehicle Repair Toolset
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!sos) return null;

  const handleAssign = async () => {
    const resource = INITIAL_RESOURCES.find((r) => r.id === selectedResourceId) || INITIAL_RESOURCES[0];
    setIsSubmitting(true);

    // Update SOS Status in Database
    await sosService.updateStatus(sos.id, 'RESOURCES_ASSIGNED', user?.full_name);

    // Audit Log Entry
    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      'Assigned Emergency Resource',
      'Resource',
      resource.id,
      `Allocated ${quantity} ${resource.unit} of ${resource.name} to Emergency SOS at ${sos.location_name}`
    );

    setIsSubmitting(false);
    setFeedback(`Assigned ${quantity} ${resource.unit} of ${resource.name}. Status updated to RESOURCES_ASSIGNED.`);

    if (onAssigned) onAssigned(resource, quantity);

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
            <Boxes className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
              ASSIGN EMERGENCY CARGO / RESOURCE
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

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-2 font-bold">
              Select Resource Item to Dispatch
            </label>
            <div className="space-y-2">
              {INITIAL_RESOURCES.map((res) => (
                <div
                  key={res.id}
                  onClick={() => setSelectedResourceId(res.id)}
                  className={`p-3 rounded-xl border text-xs font-mono cursor-pointer transition-all flex items-center justify-between ${
                    selectedResourceId === res.id
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-[#060c16] border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-100">{res.name}</div>
                    <div className="text-[10px] text-slate-400">{res.category} • Location: {res.location_name}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-cyan-300 font-bold">{res.quantity_available} {res.unit}</span>
                    <div className="text-[9px] text-slate-500 uppercase">{res.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
              Quantity to Allocate
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-[#060c16] border border-slate-700 focus:border-amber-500 rounded-xl p-3 text-xs font-mono text-slate-100"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#060c16] border-t border-slate-800">
          <button
            onClick={handleAssign}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:to-yellow-500 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
          >
            <Boxes className="w-4 h-4" />
            <span>{isSubmitting ? 'ALLOCATING RESOURCE...' : 'ALLOCATE & ASSIGN RESOURCE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
