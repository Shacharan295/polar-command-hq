import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle2, MessageSquare, PlusCircle, Boxes, Clock, MapPin, User, FileText } from 'lucide-react';
import type { FieldUpdate, Personnel, Team } from '@/types';
import { auditService } from '@/services';
import { useAuth } from '@/context/AuthContext';

interface FieldUpdateModalProps {
  update: FieldUpdate | null;
  personnel?: Personnel;
  team?: Team;
  onClose: () => void;
  onStatusChange?: (updateId: string, newStatus: FieldUpdate['status']) => void;
  onContactTeam?: (teamId?: string) => void;
  onCreateMission?: (update: FieldUpdate) => void;
  onAssignResource?: (update: FieldUpdate) => void;
}

export const FieldUpdateModal: React.FC<FieldUpdateModalProps> = ({
  update,
  personnel,
  team,
  onClose,
  onStatusChange,
  onContactTeam,
  onCreateMission,
  onAssignResource,
}) => {
  const { user, currentRole } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!update) return null;

  const handleUpdateStatus = async (newStatus: FieldUpdate['status']) => {
    if (onStatusChange) {
      onStatusChange(update.id, newStatus);
    }
    update.status = newStatus;

    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      `Field Update ${newStatus}`,
      'FieldUpdate',
      update.id,
      `Changed status of field update from ${update.location_name} to ${newStatus}`
    );

    setFeedback(`Field Update status changed to ${newStatus}. Audit log entry recorded.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b14]/85 backdrop-blur-sm p-4 font-sans">
      <div className="w-full max-w-lg bg-[#09111e] border border-cyan-900/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#060c16] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              update.priority === 'HIGH' || update.priority === 'CRITICAL'
                ? 'bg-red-950 text-red-300 border border-red-500/80'
                : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
            }`}>
              {update.priority} PRIORITY UPDATE
            </span>
            <span className="text-xs font-mono text-slate-400">ID: {update.id.slice(0, 8)}</span>
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
          {/* Title & Status */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold font-heading text-slate-100">
                FIELD REPORT: {update.location_name}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Reported by {personnel?.full_name || 'Field Personnel'} ({team?.name || 'Team Alpha'})
              </p>
            </div>

            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded uppercase ${
              update.status === 'NEW'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                : update.status === 'IN_PROGRESS'
                ? 'bg-sky-950 text-sky-300 border border-sky-500/50'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
            }`}>
              {update.status}
            </span>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-mono flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Description */}
          <div className="p-4 bg-[#060c16] rounded-xl border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono uppercase text-slate-500 font-bold flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Description & Field Telemetry
            </div>
            <p className="text-xs text-slate-200 font-sans leading-relaxed">
              "{update.description}"
            </p>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#060c16] rounded-lg border border-slate-800">
              <div className="text-slate-500 text-[10px]">TIME RECORDED</div>
              <div className="text-slate-200 font-bold mt-0.5">{new Date(update.created_at).toLocaleTimeString()}</div>
            </div>
            <div className="p-3 bg-[#060c16] rounded-lg border border-slate-800">
              <div className="text-slate-500 text-[10px]">ATTACHMENT METADATA</div>
              <div className="text-cyan-300 font-bold mt-0.5">{update.attachment_url || 'Telemetry Log Attached'}</div>
            </div>
          </div>
        </div>

        {/* Action Controls (Section 18) */}
        <div className="p-4 bg-[#060c16] border-t border-slate-800 space-y-2 font-mono text-xs">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleUpdateStatus('IN_PROGRESS')}
              className="py-2 px-3 rounded-lg bg-sky-950 border border-sky-600 hover:bg-sky-900 text-sky-200 font-bold cursor-pointer transition-colors"
            >
              MARK IN PROGRESS
            </button>
            <button
              onClick={() => handleUpdateStatus('RESOLVED')}
              className="py-2 px-3 rounded-lg bg-emerald-950 border border-emerald-600 hover:bg-emerald-900 text-emerald-200 font-bold cursor-pointer transition-colors"
            >
              MARK RESOLVED
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                if (onContactTeam) onContactTeam(update.team_id);
                onClose();
              }}
              className="py-2 px-2 rounded-lg bg-cyan-950 border border-cyan-700 hover:bg-cyan-900 text-cyan-300 text-[11px] font-bold cursor-pointer transition-colors flex items-center justify-center space-x-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>CONTACT</span>
            </button>

            <button
              onClick={() => {
                if (onCreateMission) onCreateMission(update);
                onClose();
              }}
              className="py-2 px-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-[11px] font-bold cursor-pointer transition-colors flex items-center justify-center space-x-1"
            >
              <PlusCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>MISSION</span>
            </button>

            <button
              onClick={() => {
                if (onAssignResource) onAssignResource(update);
                onClose();
              }}
              className="py-2 px-2 rounded-lg bg-amber-950 border border-amber-700 hover:bg-amber-900 text-amber-300 text-[11px] font-bold cursor-pointer transition-colors flex items-center justify-center space-x-1"
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>RESOURCE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
