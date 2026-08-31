import React, { useState } from 'react';
import { X, Send, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { SOSAlert, Personnel } from '@/types';
import { auditService, messageService } from '@/services';
import { useAuth } from '@/context/AuthContext';

interface EmergencyInstructionsModalProps {
  sos: SOSAlert | null;
  personnel?: Personnel;
  onClose: () => void;
  onSuccess?: (instruction: string) => void;
}

export const EmergencyInstructionsModal: React.FC<EmergencyInstructionsModalProps> = ({
  sos,
  personnel,
  onClose,
  onSuccess,
}) => {
  const { user, currentRole } = useAuth();
  const [instructionText, setInstructionText] = useState(
    'HQ Emergency Order: Remain inside Polar Rover cabin. Heating backup unit activated. SAR Response Team dispatched.'
  );
  const [priority, setPriority] = useState<'CRITICAL' | 'HIGH'>('CRITICAL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!sos) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save message to database / store
    await messageService.send({
      expedition_id: sos.expedition_id,
      sender_id: user?.id || '00000000-0000-0000-0000-000000000001',
      sender_name: `${user?.full_name || 'Commander Admin'} (${currentRole})`,
      recipient_id: sos.personnel_id,
      team_id: sos.team_id,
      channel: sos.comm_channel || 'SATELLITE',
      message: `[EMERGENCY INSTRUCTION]: ${instructionText}`,
      priority: priority,
      status: 'SENT',
    });


    // Create Audit Log
    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      'Sent Emergency Instructions',
      'SOSAlert',
      sos.id,
      `Issued critical emergency orders to ${personnel?.full_name || 'Field Personnel'} at ${sos.location_name}`
    );

    setIsSubmitting(false);
    setFeedback('Emergency Instructions transmitted via Satellite Gateway.');
    if (onSuccess) onSuccess(instructionText);

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b14]/85 backdrop-blur-sm p-4 font-sans">
      <div className="w-full max-w-lg bg-[#09111e] border border-red-900/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-red-950/80 border-b border-red-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-red-200 uppercase tracking-wider">
              SEND EMERGENCY INSTRUCTIONS
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-red-300 hover:text-white hover:bg-red-900/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {feedback && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-mono flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          <div className="p-3 bg-[#060c16] rounded-xl border border-slate-800 text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Target Personnel:</span>
              <strong className="text-slate-100">{personnel?.full_name || 'Arjun Kumar'}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Target Location:</span>
              <strong className="text-cyan-300">{sos.location_name}</strong>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
              Emergency Instruction Content
            </label>
            <textarea
              value={instructionText}
              onChange={(e) => setInstructionText(e.target.value)}
              rows={4}
              required
              className="w-full bg-[#060c16] border border-slate-700 focus:border-red-500 rounded-xl p-3 text-xs font-mono text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
              Transmission Priority
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPriority('CRITICAL')}
                className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                  priority === 'CRITICAL'
                    ? 'bg-red-950 border border-red-500 text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                    : 'bg-[#060c16] border border-slate-700 text-slate-400'
                }`}
              >
                🚨 CRITICAL (IMMEDIATE BROADCAST)
              </button>
              <button
                type="button"
                onClick={() => setPriority('HIGH')}
                className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                  priority === 'HIGH'
                    ? 'bg-amber-950 border border-amber-500 text-amber-200'
                    : 'bg-[#060c16] border border-slate-700 text-slate-400'
                }`}
              >
                HIGH PRIORITY
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'TRANSMITTING...' : 'TRANSMIT EMERGENCY ORDER'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
