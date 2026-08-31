import React, { useState } from 'react';
import { Activity, Target, Plus, CheckCircle2, History } from 'lucide-react';
import { INITIAL_FIELD_UPDATES, INITIAL_MISSIONS, INITIAL_TEAMS, INITIAL_PERSONNEL } from '@/lib/mockData';
import type { FieldUpdate, Mission, FieldUpdateStatus } from '@/types';
import { CreateMissionModal } from '@/features/missions/components/CreateMissionModal';
import { MissionDetailModal } from '@/features/missions/components/MissionDetailModal';
import { FieldUpdateModal } from '@/features/dashboard/components/FieldUpdateModal';
import { auditService, fieldUpdateService } from '@/services';
import { useAuth } from '@/context/AuthContext';

export const OperationsPage: React.FC = () => {
  const { user, currentRole } = useAuth();
  const [fieldUpdates, setFieldUpdates] = useState<FieldUpdate[]>(INITIAL_FIELD_UPDATES);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [selectedUpdate, setSelectedUpdate] = useState<FieldUpdate | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isCreateMissionOpen, setIsCreateMissionOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Active vs History Filtering (Section 18 & 25)
  const activeMissions = missions.filter((m) => m.status !== 'COMPLETED');
  const completedMissions = missions.filter((m) => m.status === 'COMPLETED');

  const handleAcknowledgeUpdate = async (updateId: string) => {
    const updated = fieldUpdates.map((u) => u.id === updateId ? { ...u, status: 'ACKNOWLEDGED' as FieldUpdateStatus } : u);
    setFieldUpdates(updated);
    await fieldUpdateService.updateStatus(updateId, 'ACKNOWLEDGED');
    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      'Acknowledged Operations Field Report',
      'FieldUpdate',
      updateId,
      'Commander Admin acknowledged field update report.'
    );
    setFeedback('Operations field report acknowledged successfully.');
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1424] border border-cyan-900/60 p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              Operations & Mission Control Workspace
            </span>
          </div>
          <h1 className="text-xl font-extrabold font-heading text-slate-100">
            FIELD OPERATIONS & TACTICAL MISSION EXECUTION
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming field update reports, dispatch tactical missions, monitor progress, and complete objectives.
          </p>
        </div>

        <button
          onClick={() => setIsCreateMissionOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white rounded-xl text-xs font-mono font-bold flex items-center space-x-2 shadow-lg cursor-pointer transition-all uppercase"
        >
          <Plus className="w-4 h-4" />
          <span>DISPATCH NEW MISSION</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-mono flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid: 2 Main Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Operations Inbox / Field Reports (6 cols) */}
        <div className="lg:col-span-6 bg-[#0b1320] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>INCOMING FIELD REPORT INBOX ({fieldUpdates.length})</span>
            </h2>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
              OPERATIONS FEED
            </span>
          </div>

          <div className="space-y-3">
            {fieldUpdates.map((update) => {
              const person = INITIAL_PERSONNEL.find((p) => p.id === update.personnel_id);
              return (
                <div
                  key={update.id}
                  onClick={() => setSelectedUpdate(update)}
                  className="p-4 rounded-xl bg-[#060c16] border border-slate-800 hover:border-cyan-500/60 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-100">{person?.full_name || 'Field Unit'}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      update.status === 'NEW'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/60 animate-pulse'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {update.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans">{update.description}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>{update.location_name}</span>
                    <div className="flex items-center space-x-2">
                      {update.status === 'NEW' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcknowledgeUpdate(update.id);
                          }}
                          className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 hover:border-cyan-400 text-cyan-300 cursor-pointer font-bold"
                        >
                          ACKNOWLEDGE
                        </button>
                      )}
                      <span>{new Date(update.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Missions Execution & Completed Missions History (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Missions Card */}
          <div className="bg-[#0b1320] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
                <Target className="w-4 h-4 text-sky-400" />
                <span>ACTIVE MISSIONS EXECUTION ({activeMissions.length})</span>
              </h2>
              <span className="text-[10px] font-mono bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3">
              {activeMissions.map((mission) => {
                const team = INITIAL_TEAMS.find((t) => t.id === mission.team_id);
                return (
                  <div
                    key={mission.id}
                    onClick={() => setSelectedMission(mission)}
                    className="p-4 rounded-xl bg-[#060c16] border border-slate-800 hover:border-sky-500/60 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-sky-300">{team?.name || 'Assigned Team'}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mission.status === 'EMERGENCY'
                          ? 'bg-red-950 text-red-300 border border-red-500/80 animate-pulse'
                          : mission.status === 'ACTIVE'
                          ? 'bg-sky-950 text-sky-300 border border-sky-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {mission.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold font-heading text-slate-100">{mission.title}</h3>
                    <p className="text-xs text-slate-400 font-sans line-clamp-2">{mission.description}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>{mission.location_name}</span>
                      <span className="text-cyan-400 font-bold">PRIORITY: {mission.priority}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completed Missions History Card (Section 18 & 25) */}
          <div className="bg-[#0b1320] border border-slate-800 rounded-xl p-5 space-y-3 font-sans">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 text-xs font-mono font-bold text-emerald-400">
              <History className="w-4 h-4" />
              <span>COMPLETED MISSIONS HISTORY ({completedMissions.length})</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-xs">
              {completedMissions.map((m) => (
                <div key={m.id} className="p-3 bg-[#060c16] rounded-lg border border-slate-800/80 space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-200">{m.title}</span>
                    <span className="text-emerald-400 text-[10px] font-bold">✓ COMPLETED</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans line-clamp-1">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Mission Modal */}
      {isCreateMissionOpen && (
        <CreateMissionModal
          onClose={() => setIsCreateMissionOpen(false)}
          onMissionCreated={(newM) => setMissions((prev) => [newM, ...prev])}
        />
      )}

      {/* Field Update Modal */}
      {selectedUpdate && (
        <FieldUpdateModal
          update={selectedUpdate}
          onClose={() => setSelectedUpdate(null)}
          onStatusChange={(id, newStatus) => {
            setFieldUpdates((prev) => prev.map((u) => u.id === id ? { ...u, status: newStatus } : u));
          }}
        />
      )}

      {/* Mission Detail Modal */}
      {selectedMission && (
        <MissionDetailModal
          mission={selectedMission}
          onClose={() => setSelectedMission(null)}
          onStatusChange={(id, newStatus) => {
            setMissions((prev) => prev.map((m) => m.id === id ? { ...m, status: newStatus } : m));
          }}
        />
      )}
    </div>
  );
};
