import React, { useState } from 'react';
import { X, Boxes, ArrowRightLeft, Truck, PlusCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { Resource, ResourceStatus } from '@/types';
import { resourceService, auditService } from '@/services';
import { useAuth } from '@/context/AuthContext';

interface ManageResourceModalProps {
  resource: Resource | null;
  onClose: () => void;
  onResourceUpdated?: (updated: Resource) => void;
}

export const ManageResourceModal: React.FC<ManageResourceModalProps> = ({
  resource,
  onClose,
  onResourceUpdated,
}) => {
  const { user, currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'restock' | 'transfer' | 'status'>('restock');
  const [amount, setAmount] = useState<number>(100);
  const [targetLocation, setTargetLocation] = useState<string>('Camp B - North Ridge');
  const [newStatus, setNewStatus] = useState<ResourceStatus>(resource?.status || 'AVAILABLE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!resource) return null;

  const handleRestock = async () => {
    setIsSubmitting(true);
    const updatedAvailable = resource.quantity_available + amount;
    const isBelowThreshold = updatedAvailable <= resource.critical_threshold;
    const computedStatus: ResourceStatus = isBelowThreshold ? 'CRITICAL' : 'AVAILABLE';

    resource.quantity_available = updatedAvailable;
    resource.status = computedStatus;

    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      'Restocked Resource Stockpile',
      'Resource',
      resource.id,
      `Restocked ${amount} ${resource.unit} of ${resource.name}. New total available: ${updatedAvailable} ${resource.unit}`
    );

    setIsSubmitting(false);
    setFeedback(`Restocked ${amount} ${resource.unit} successfully.`);

    if (onResourceUpdated) onResourceUpdated({ ...resource });
    setTimeout(() => onClose(), 1500);
  };

  const handleTransfer = async () => {
    setIsSubmitting(true);
    const transferQty = Math.min(amount, resource.quantity_available);
    resource.quantity_available -= transferQty;
    resource.quantity_in_transit += transferQty;
    resource.status = 'IN_TRANSIT';

    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      'Initiated Resource Cargo Transfer',
      'Resource',
      resource.id,
      `Transferred ${transferQty} ${resource.unit} of ${resource.name} to ${targetLocation}`
    );

    setIsSubmitting(false);
    setFeedback(`Initiated transfer of ${transferQty} ${resource.unit} to ${targetLocation}. Status: IN_TRANSIT.`);

    if (onResourceUpdated) onResourceUpdated({ ...resource });
    setTimeout(() => onClose(), 1500);
  };

  const handleStatusChange = async () => {
    setIsSubmitting(true);
    resource.status = newStatus;

    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      'Updated Resource Status',
      'Resource',
      resource.id,
      `Changed status of ${resource.name} to ${newStatus}`
    );

    setIsSubmitting(false);
    setFeedback(`Resource status changed to ${newStatus}.`);

    if (onResourceUpdated) onResourceUpdated({ ...resource });
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b14]/85 backdrop-blur-sm p-4 font-sans">
      <div className="w-full max-w-lg bg-[#09111e] border border-cyan-900/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#060c16] border-b border-slate-800 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-2">
            <Boxes className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-slate-100 uppercase tracking-wider">
              MANAGE CARGO STOCKPILE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          {/* Resource Info */}
          <div className="p-4 bg-[#060c16] rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between items-baseline">
              <span className="text-slate-400 uppercase text-[10px]">{resource.category}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                resource.status === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-500' : 'bg-emerald-950 text-emerald-300'
              }`}>
                {resource.status}
              </span>
            </div>
            <h2 className="text-lg font-bold font-heading text-slate-100">{resource.name}</h2>
            <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
              <span>Available Level:</span>
              <strong className="text-cyan-300">{resource.quantity_available} {resource.unit}</strong>
            </div>
          </div>

          {feedback && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-mono flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Action Tabs */}
          <div className="flex border-b border-slate-800 font-mono text-xs">
            <button
              onClick={() => setActiveTab('restock')}
              className={`flex-1 py-2 font-bold text-center border-b-2 cursor-pointer transition-colors ${
                activeTab === 'restock' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400'
              }`}
            >
              RESTOCK
            </button>
            <button
              onClick={() => setActiveTab('transfer')}
              className={`flex-1 py-2 font-bold text-center border-b-2 cursor-pointer transition-colors ${
                activeTab === 'transfer' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400'
              }`}
            >
              TRANSFER
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`flex-1 py-2 font-bold text-center border-b-2 cursor-pointer transition-colors ${
                activeTab === 'status' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400'
              }`}
            >
              UPDATE STATUS
            </button>
          </div>

          {/* Tab 1: Restock */}
          {activeTab === 'restock' && (
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">
                  Quantity to Add ({resource.unit})
                </label>
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-[#060c16] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100"
                />
              </div>
              <button
                onClick={handleRestock}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase cursor-pointer transition-colors"
              >
                CONFIRM RESTOCK
              </button>
            </div>
          )}

          {/* Tab 2: Transfer */}
          {activeTab === 'transfer' && (
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">
                  Transfer Quantity ({resource.unit})
                </label>
                <input
                  type="number"
                  min={1}
                  max={resource.quantity_available}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-[#060c16] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">
                  Target Destination Outpost
                </label>
                <input
                  type="text"
                  value={targetLocation}
                  onChange={(e) => setTargetLocation(e.target.value)}
                  className="w-full bg-[#060c16] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100"
                />
              </div>
              <button
                onClick={handleTransfer}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold uppercase cursor-pointer transition-colors"
              >
                DISPATCH TRANSFER CONVOY
              </button>
            </div>
          )}

          {/* Tab 3: Status */}
          {activeTab === 'status' && (
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">
                  Set State
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ResourceStatus)}
                  className="w-full bg-[#060c16] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="LOW">LOW</option>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="IN_TRANSIT">IN TRANSIT</option>
                  <option value="RESERVED">RESERVED</option>
                </select>
              </div>
              <button
                onClick={handleStatusChange}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold uppercase cursor-pointer transition-colors"
              >
                UPDATE STATE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
