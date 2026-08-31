import React, { useState } from 'react';
import { Target, Plus, Clock, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { INITIAL_MISSIONS } from '@/lib/mockData';
import type { Mission } from '@/types';
import { CreateMissionModal } from '@/features/missions/components/CreateMissionModal';
import { MissionDetailModal } from '@/features/missions/components/MissionDetailModal';

export const MissionsPage: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const handleMissionCreated = (newMission: Mission) => {
    setMissions((prev) => [newMission, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1424] border border-cyan-900/60 p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              Tactical Operations Dispatch
            </span>
          </div>
          <h1 className="text-xl font-extrabold font-heading text-slate-100">
            FIELD MISSIONS MANAGEMENT ({missions.length} ACTIVE & PLANNED)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch field assignments, set deadlines, allocate required cargo resources, and track progress.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold flex items-center space-x-2 shadow-lg transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE MISSION</span>
        </button>
      </div>

      {/* Missions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {missions.map((mission) => (
          <div key={mission.id} className="bg-[#0b1320] border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  mission.priority === 'CRITICAL' || mission.priority === 'HIGH'
                    ? 'bg-red-950 text-red-300 border border-red-500/60'
                    : 'bg-cyan-950 text-cyan-300 border border-cyan-700/60'
                }`}>
                  {mission.priority} PRIORITY
                </span>
                <h3 className="text-base font-bold font-heading text-slate-100 mt-1.5">
                  {mission.title}
                </h3>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                mission.status === 'EMERGENCY'
                  ? 'bg-red-950 text-red-300 border border-red-500/80 animate-sos-flash'
                  : mission.status === 'ACTIVE'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : mission.status === 'COMPLETED'
                  ? 'bg-slate-800 text-slate-400'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}>
                {mission.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {mission.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{mission.location_name}</span>
              </div>
              {mission.deadline && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Deadline: {new Date(mission.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-slate-400">
                Created by: <strong className="text-slate-200">{mission.created_by}</strong>
              </span>
              <button
                onClick={() => setSelectedMission(mission)}
                className="px-3 py-1 bg-cyan-950 border border-cyan-800 hover:border-cyan-400 rounded text-xs font-mono text-cyan-300 cursor-pointer"
              >
                MISSION DETAILS &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateMissionModal
          onClose={() => setIsCreateModalOpen(false)}
          onMissionCreated={handleMissionCreated}
        />
      )}

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
