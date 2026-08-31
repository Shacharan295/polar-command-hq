import React, { useState } from 'react';
import { X, Target, Plus, Calendar, MapPin, Users, Boxes, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { Mission, MissionPriority, MissionStatus } from '@/types';
import { INITIAL_TEAMS, INITIAL_PERSONNEL, INITIAL_RESOURCES } from '@/lib/mockData';
import { missionService, auditService } from '@/services';
import { useAuth } from '@/context/AuthContext';

interface CreateMissionModalProps {
  onClose: () => void;
  onMissionCreated?: (newMission: Mission) => void;
  initialTitle?: string;
  initialLocation?: string;
}

export const CreateMissionModal: React.FC<CreateMissionModalProps> = ({
  onClose,
  onMissionCreated,
  initialTitle = '',
  initialLocation = '',
}) => {
  const { user, currentRole } = useAuth();
  const [title, setTitle] = useState(initialTitle || 'Polar Sector Reconnaissance');
  const [locationName, setLocationName] = useState(initialLocation || 'Camp B - North Ridge');
  const [description, setDescription] = useState('Inspect perimeter sensors and verify generator oil pressure levels.');
  const [priority, setPriority] = useState<MissionPriority>('HIGH');
  const [teamId, setTeamId] = useState<string>(INITIAL_TEAMS[0].id);
  const [selectedPersonnelIds, setSelectedPersonnelIds] = useState<string[]>([INITIAL_PERSONNEL[0].id]);
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([INITIAL_RESOURCES[0].id]);
  const [deadlineHours, setDeadlineHours] = useState<number>(6);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const deadlineIso = new Date(Date.now() + deadlineHours * 3600000).toISOString();

    const newMissionData: Omit<Mission, 'id' | 'created_at' | 'updated_at'> = {
      expedition_id: INITIAL_TEAMS[0].expedition_id,
      team_id: teamId,
      title,
      description,
      location_name: locationName,
      latitude: 78.2450,
      longitude: 15.6820,
      priority,
      status: 'ASSIGNED',
      deadline: deadlineIso,
      assigned_personnel_ids: selectedPersonnelIds,
      required_resource_ids: selectedResourceIds,
      created_by: `${user?.full_name || 'Commander Admin'} (${currentRole})`,
    };

    const createdMission = await missionService.create(newMissionData);

    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      'Created New Mission',
      'Mission',
      createdMission?.id || 'new-mission',
      `Dispatched new mission: "${title}" at ${locationName} with priority ${priority}`
    );

    setIsSubmitting(false);
    setFeedback(`Mission "${title}" created successfully and dispatched.`);

    if (onMissionCreated && createdMission) {
      onMissionCreated(createdMission);
    }

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b14]/85 backdrop-blur-sm p-4 font-sans">
      <div className="w-full max-w-xl bg-[#09111e] border border-cyan-900/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#060c16] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
              DISPATCH NEW FIELD MISSION
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto font-mono text-xs">
          {feedback && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-mono flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Title & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">
                Mission Task / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-[#060c16] border border-slate-700 focus:border-cyan-500 rounded-lg p-2.5 text-xs text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">
                Target Location Name
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required
                className="w-full bg-[#060c16] border border-slate-700 focus:border-cyan-500 rounded-lg p-2.5 text-xs text-slate-100"
              />
            </div>
          </div>

          {/* Description / Instructions */}
          <div>
            <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">
              Detailed Tactical Instructions
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              className="w-full bg-[#060c16] border border-slate-700 focus:border-cyan-500 rounded-lg p-2.5 text-xs text-slate-100 font-sans"
            />
          </div>

          {/* Priority & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as MissionPriority)}
                className="w-full bg-[#060c16] border border-slate-700 focus:border-cyan-500 rounded-lg p-2.5 text-xs text-slate-100"
              >
                <option value="LOW">LOW</option>
                <option value="NORMAL">NORMAL</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">
                Completion Deadline (Hours)
              </label>
              <input
                type="number"
                min={1}
                max={72}
                value={deadlineHours}
                onChange={(e) => setDeadlineHours(Number(e.target.value))}
                className="w-full bg-[#060c16] border border-slate-700 focus:border-cyan-500 rounded-lg p-2.5 text-xs text-slate-100"
              />
            </div>
          </div>

          {/* Assign Team & Personnel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">
                Assigned Team
              </label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full bg-[#060c16] border border-slate-700 focus:border-cyan-500 rounded-lg p-2.5 text-xs text-slate-100"
              >
                {INITIAL_TEAMS.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.callsign})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">
                Assigned Personnel Lead
              </label>
              <select
                value={selectedPersonnelIds[0]}
                onChange={(e) => setSelectedPersonnelIds([e.target.value])}
                className="w-full bg-[#060c16] border border-slate-700 focus:border-cyan-500 rounded-lg p-2.5 text-xs text-slate-100"
              >
                {INITIAL_PERSONNEL.map((p) => (
                  <option key={p.id} value={p.id}>{p.full_name} ({p.role})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'DISPATCHING MISSION...' : 'CREATE & DISPATCH MISSION'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
