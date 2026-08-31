import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Battery, 
  Target, 
  MessageSquare, 
  Send, 
  Navigation, 
  Boxes, 
  CheckCircle2, 
  User,
  ShieldCheck,
  AlertTriangle,
  X,
  AlertOctagon
} from 'lucide-react';
import type { SOSAlert, Personnel, SOSStatus } from '@/types';
import { INITIAL_PERSONNEL, INITIAL_MISSIONS, INITIAL_TEAMS } from '@/lib/mockData';
import { sosService, auditService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { EmergencyInstructionsModal } from './EmergencyInstructionsModal';
import { DispatchNearbyModal } from './DispatchNearbyModal';
import { AssignResourceModal } from './AssignResourceModal';

interface EmergencyResponsePanelProps {
  sos: SOSAlert | null;
  onNavigateToComms?: () => void;
  onNavigateToHistory?: () => void;
  onSOSResolved?: (sosId: string) => void;
}

export const EmergencyResponsePanel: React.FC<EmergencyResponsePanelProps> = ({
  sos,
  onNavigateToComms,
  onNavigateToHistory,
  onSOSResolved,
}) => {
  const { user, currentRole } = useAuth();
  const [activeModal, setActiveModal] = useState<'instructions' | 'dispatch' | 'resource' | null>(null);
  const [currentStatus, setCurrentStatus] = useState<SOSStatus>(sos?.status || 'REPORTED');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showResolutionError, setShowResolutionError] = useState(false);
  const [isProblemAddressed, setIsProblemAddressed] = useState(false);

  if (!sos) {
    return (
      <div className="bg-[#0b1320] border border-slate-800 rounded-xl p-8 text-center space-y-2 font-sans">
        <ShieldAlert className="w-8 h-8 text-emerald-400 mx-auto" />
        <h3 className="text-base font-bold font-heading text-slate-100">ALL SECTORS SECURE</h3>
        <p className="text-xs text-slate-400 font-mono">No active emergency SOS alerts currently reported in McMurdo Antarctic Sector.</p>
      </div>
    );
  }

  const personnel = INITIAL_PERSONNEL.find((p) => p.id === sos.personnel_id) || INITIAL_PERSONNEL[0];
  const assignedMission = INITIAL_MISSIONS.find((m) => m.id === personnel.assigned_mission_id) || null;
  // Derive team name from SOS team_id rather than hardcoding
  const sosTeam = INITIAL_TEAMS.find((t) => t.id === sos.team_id);
  const teamLabel = sosTeam ? `${sosTeam.name} (${sosTeam.callsign})` : 'Unassigned';

  const timelineSteps: { key: SOSStatus; label: string }[] = [
    { key: 'REPORTED', label: 'Reported' },
    { key: 'ACKNOWLEDGED', label: 'Acknowledged' },
    { key: 'RESPONSE_INITIATED', label: 'Response Initiated' },
    { key: 'TEAM_DISPATCHED', label: 'Team Dispatched' },
    { key: 'RESOURCES_ASSIGNED', label: 'Resources Assigned' },
    { key: 'CONTACT_ESTABLISHED', label: 'Contact Established' },
    { key: 'PERSONNEL_SAFE', label: 'Personnel Safe' },
    { key: 'UNDER_CONTROL', label: 'Under Control' },
    { key: 'RESOLVED', label: 'Resolved' },
  ];

  const currentStepIndex = timelineSteps.findIndex((s) => s.key === currentStatus);

  // Section 11 Prerequisites Check
  const checklist = {
    isAcknowledged: currentStepIndex >= 1,
    isContactEstablished: currentStepIndex >= 5 || currentStatus === 'CONTACT_ESTABLISHED' || currentStatus === 'PERSONNEL_SAFE',
    isInstructionsSent: currentStepIndex >= 2,
    isTeamDispatched: currentStepIndex >= 3,
    isResourceAssigned: currentStepIndex >= 4,
    isPersonnelSafe: currentStepIndex >= 6 || currentStatus === 'PERSONNEL_SAFE',
    isProblemAddressed: isProblemAddressed,
  };

  const missingConditions: string[] = [];
  if (!checklist.isAcknowledged) missingConditions.push('Acknowledge Emergency Incident');
  if (!checklist.isContactEstablished) missingConditions.push('Establish Contact with Field Personnel');
  if (!checklist.isInstructionsSent) missingConditions.push('Transmit Emergency Instructions');
  if (!checklist.isTeamDispatched) missingConditions.push('Dispatch SAR Response Unit');
  if (!checklist.isResourceAssigned) missingConditions.push('Allocate & Deliver Emergency Cargo');
  if (!checklist.isPersonnelSafe) missingConditions.push('Confirm & Mark Personnel Safe');
  if (!checklist.isProblemAddressed) missingConditions.push('Confirm Hardware/Cabin Heating Problem Addressed');

  const handleStatusUpdate = async (newStatus: SOSStatus, actionLabel: string) => {
    setCurrentStatus(newStatus);
    await sosService.updateStatus(sos.id, newStatus, user?.full_name);
    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      actionLabel,
      'SOSAlert',
      sos.id,
      `SOS Emergency Status changed to ${newStatus} for ${personnel.full_name}`
    );

    setFeedback(`Action executed: "${actionLabel}". Database status updated to ${newStatus}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleAttemptResolve = async () => {
    if (missingConditions.length > 0) {
      setShowResolutionError(true);
      return;
    }

    setCurrentStatus('RESOLVED');
    await sosService.updateStatus(sos.id, 'RESOLVED', user?.full_name);
    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      'Resolved Emergency SOS Incident',
      'SOSAlert',
      sos.id,
      `All prerequisite resolution conditions satisfied. Incident ${sos.id} resolved.`
    );

    if (onSOSResolved) {
      onSOSResolved(sos.id);
    }
  };

  return (
    <div className="bg-red-950/40 border-2 border-red-500/80 rounded-2xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.25)] space-y-6 font-sans relative">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-900/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-900/80 border border-red-500 flex items-center justify-center text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-sos-flash">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-extrabold font-heading text-red-200 tracking-wider">
                🚨 CRITICAL EMERGENCY SOS
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-900 text-red-100 border border-red-500 uppercase animate-pulse">
                PRIORITY: CRITICAL
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Reported {new Date(sos.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • McMurdo Antarctic Sector
            </p>
          </div>
        </div>

        {/* Current Status Badge */}
        <div className="px-3.5 py-1.5 rounded-lg bg-red-950 border border-red-500 text-red-200 text-xs font-mono font-extrabold tracking-wide uppercase self-start sm:self-auto">
          STATUS: {currentStatus}
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-mono flex items-center space-x-2 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 2. EMERGENCY DETAILS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 bg-[#08101d] rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-cyan-400" /> Personnel & Team
          </span>
          <div className="font-extrabold text-slate-100 text-sm">{personnel.full_name}</div>
          <div className="text-cyan-300 text-[11px]">{teamLabel}</div>
        </div>

        <div className="p-3.5 bg-[#08101d] rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-400" /> Location Coordinates
          </span>
          <div className="font-bold text-slate-100">{sos.location_name}</div>
          <div className="text-slate-400 text-[11px]">
            {Math.abs(sos.latitude).toFixed(4)}° {sos.latitude < 0 ? 'S' : 'N'},{' '}
            {Math.abs(sos.longitude).toFixed(4)}° {sos.longitude < 0 ? 'W' : 'E'}
          </div>
        </div>

        <div className="p-3.5 bg-[#08101d] rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
            <Battery className="w-3.5 h-3.5 text-amber-400" /> Battery & Comms
          </span>
          <div className="font-extrabold text-amber-400 text-sm">{sos.battery_level}% Battery</div>
          <div className="text-sky-300 text-[11px]">{sos.comm_channel} Gateway Active</div>
        </div>

        <div className="p-3.5 bg-[#08101d] rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-sky-400" /> Active Mission
          </span>
          {assignedMission ? (
            <>
              <div className="font-bold text-slate-100 text-[11px] leading-tight">{assignedMission.title}</div>
              <div className="text-emerald-400 text-[11px]">{assignedMission.priority} Priority</div>
            </>
          ) : (
            <div className="text-slate-400 text-[11px]">No mission assigned</div>
          )}
        </div>
      </div>

      {/* Description Note */}
      <div className="p-4 bg-[#060c16] rounded-xl border border-slate-800 space-y-1">
        <div className="text-[10px] font-mono text-red-400 uppercase font-bold">Field Distress Report Message:</div>
        <p className="text-xs text-slate-200 font-sans leading-relaxed italic">
          "{sos.description}"
        </p>
      </div>

      {/* 3. COMMAND ACTIONS BUTTONS */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
          HQ EMERGENCY ACTION CONTROLS
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs font-mono">
          {/* ACKNOWLEDGE */}
          <button
            onClick={() => handleStatusUpdate('ACKNOWLEDGED', 'HQ Acknowledged SOS Incident')}
            className={`p-2.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-center ${
              checklist.isAcknowledged 
                ? 'bg-emerald-950/50 border-emerald-500/80 text-emerald-300' 
                : 'bg-[#060c16] border-slate-700/80 hover:border-cyan-500/80 text-slate-200'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${checklist.isAcknowledged ? 'text-emerald-400' : 'text-cyan-400'}`} />
            <span className="text-[10px]">{checklist.isAcknowledged ? '✓ ACKNOWLEDGED' : 'ACKNOWLEDGE'}</span>
          </button>

          {/* CONTACT PERSONNEL */}
          <button
            onClick={() => {
              if (onNavigateToComms) onNavigateToComms();
              handleStatusUpdate('CONTACT_ESTABLISHED', 'Initiated Linked Incident Comms');
            }}
            className={`p-2.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-center ${
              checklist.isContactEstablished 
                ? 'bg-emerald-950/50 border-emerald-500/80 text-emerald-300' 
                : 'bg-[#060c16] border-slate-700/80 hover:border-cyan-500/80 text-slate-200'
            }`}
          >
            <MessageSquare className={`w-4 h-4 ${checklist.isContactEstablished ? 'text-emerald-400' : 'text-cyan-400'}`} />
            <span className="text-[10px]">{checklist.isContactEstablished ? '✓ CONTACTED' : 'CONTACT'}</span>
          </button>

          {/* SEND EMERGENCY INSTRUCTIONS */}
          <button
            onClick={() => setActiveModal('instructions')}
            className={`p-2.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-center ${
              checklist.isInstructionsSent 
                ? 'bg-emerald-950/50 border-emerald-500/80 text-emerald-300' 
                : 'bg-[#060c16] border-slate-700/80 hover:border-amber-500/80 text-slate-200'
            }`}
          >
            <Send className={`w-4 h-4 ${checklist.isInstructionsSent ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-[10px]">{checklist.isInstructionsSent ? '✓ INSTRUCTION' : 'INSTRUCTION'}</span>
          </button>

          {/* DISPATCH RESPONSE TEAM */}
          <button
            onClick={() => setActiveModal('dispatch')}
            className={`p-2.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-center ${
              checklist.isTeamDispatched 
                ? 'bg-emerald-950/50 border-emerald-500/80 text-emerald-300' 
                : 'bg-[#060c16] border-slate-700/80 hover:border-cyan-500/80 text-slate-200'
            }`}
          >
            <Navigation className={`w-4 h-4 ${checklist.isTeamDispatched ? 'text-emerald-400' : 'text-cyan-400'}`} />
            <span className="text-[10px]">{checklist.isTeamDispatched ? '✓ SAR DISPATCHED' : 'DISPATCH SAR'}</span>
          </button>

          {/* ASSIGN RESOURCES */}
          <button
            onClick={() => setActiveModal('resource')}
            className={`p-2.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-center ${
              checklist.isResourceAssigned 
                ? 'bg-emerald-950/50 border-emerald-500/80 text-emerald-300' 
                : 'bg-[#060c16] border-slate-700/80 hover:border-cyan-500/80 text-slate-200'
            }`}
          >
            <Boxes className={`w-4 h-4 ${checklist.isResourceAssigned ? 'text-emerald-400' : 'text-cyan-400'}`} />
            <span className="text-[10px]">{checklist.isResourceAssigned ? '✓ CARGO DELIVERED' : 'ASSIGN CARGO'}</span>
          </button>

          {/* MARK PERSONNEL SAFE */}
          <button
            onClick={() => handleStatusUpdate('PERSONNEL_SAFE', 'Marked Field Personnel Safe')}
            className={`p-2.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-center ${
              checklist.isPersonnelSafe 
                ? 'bg-emerald-950/50 border-emerald-500/80 text-emerald-300' 
                : 'bg-[#060c16] border-slate-700/80 hover:border-cyan-500/80 text-slate-200'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${checklist.isPersonnelSafe ? 'text-emerald-400' : 'text-cyan-400'}`} />
            <span className="text-[10px]">{checklist.isPersonnelSafe ? '✓ SAFE' : 'MARK SAFE'}</span>
          </button>

          {/* CONFIRM PROBLEM ADDRESSED */}
          <button
            onClick={() => {
              setIsProblemAddressed(true);
              setFeedback('Confirmed: Cabin heating hardware problem addressed.');
              setTimeout(() => setFeedback(null), 3000);
            }}
            className={`p-2.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-center ${
              isProblemAddressed 
                ? 'bg-emerald-950/50 border-emerald-500/80 text-emerald-300' 
                : 'bg-[#060c16] border-slate-700/80 hover:border-cyan-500/80 text-slate-200'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isProblemAddressed ? 'text-emerald-400' : 'text-cyan-400'}`} />
            <span className="text-[10px]">{isProblemAddressed ? '✓ FIXED' : 'FIX PROBLEM'}</span>
          </button>

          {/* RESOLVE INCIDENT */}
          <button
            onClick={handleAttemptResolve}
            className="p-2.5 rounded-xl bg-red-950/80 border-2 border-red-500 hover:bg-red-900 text-red-200 font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-center shadow-[0_0_15px_rgba(239,68,68,0.25)]"
          >
            <CheckCircle2 className="w-4 h-4 text-red-400" />
            <span className="text-[10px]">RESOLVE</span>
          </button>
        </div>

      </div>

      {/* 4. STATUS TIMELINE */}
      <div className="space-y-2 pt-2 border-t border-red-900/60 font-mono text-xs">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          STATUS WORKFLOW TIMELINE
        </div>
        <div className="flex items-center justify-between overflow-x-auto py-2 gap-2">
          {timelineSteps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={step.key} className="flex items-center space-x-2 shrink-0">
                <div className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center space-x-1 ${
                  isCurrent
                    ? 'bg-red-900 text-red-100 border border-red-500 animate-pulse'
                    : isCompleted
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                    : 'bg-[#060c16] text-slate-500 border border-slate-800'
                }`}>
                  <span>{isCompleted ? '✓' : idx + 1}.</span>
                  <span>{step.label}</span>
                </div>
                {idx < timelineSteps.length - 1 && (
                  <span className={`text-[10px] ${isCompleted ? 'text-emerald-500' : 'text-slate-700'}`}>&rarr;</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Resolution Prerequisites Failed Modal (Section 11) */}
      {showResolutionError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b14]/90 backdrop-blur-md p-4 font-sans">
          <div className="w-full max-w-md bg-[#0c1626] border-2 border-red-500/90 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-red-400 font-extrabold text-base font-heading">
                <AlertOctagon className="w-6 h-6" />
                <span>INCIDENT CANNOT BE RESOLVED YET</span>
              </div>
              <button onClick={() => setShowResolutionError(false)} className="text-slate-400 hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-mono">
              In accordance with Polar Command HQ Safety Protocols, an emergency incident cannot be resolved until all operational checklist conditions are satisfied:
            </p>

            <div className="space-y-2 bg-[#060c16] p-4 rounded-xl border border-red-900/60 font-mono text-xs">
              <div className="text-[10px] text-red-400 uppercase font-bold">Remaining Required Actions:</div>
              {missingConditions.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-red-200">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowResolutionError(false)}
                className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white text-xs font-mono font-bold rounded-xl cursor-pointer"
              >
                RETURN TO ACTION PANEL & COMPLETE WORKFLOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {activeModal === 'instructions' && (
        <EmergencyInstructionsModal
          sos={sos}
          personnel={personnel}
          onClose={() => setActiveModal(null)}
          onSuccess={() => handleStatusUpdate('RESPONSE_INITIATED', 'Issued Emergency Orders')}
        />
      )}

      {activeModal === 'dispatch' && (
        <DispatchNearbyModal
          sos={sos}
          onClose={() => setActiveModal(null)}
          onDispatched={() => handleStatusUpdate('TEAM_DISPATCHED', 'Dispatched Nearby SAR Unit')}
        />
      )}

      {activeModal === 'resource' && (
        <AssignResourceModal
          sos={sos}
          onClose={() => setActiveModal(null)}
          onAssigned={() => handleStatusUpdate('RESOURCES_ASSIGNED', 'Assigned Emergency Resources')}
        />
      )}
    </div>
  );
};
