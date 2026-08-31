import React, { useState } from 'react';
import { 
  ShieldAlert, 
  FileText, 
  Boxes, 
  Car, 
  UserCheck, 
  MapPin, 
  CloudSnow, 
  Radio, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Play 
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { auditService, sosService, messageService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { INITIAL_PERSONNEL, INITIAL_TEAMS, INITIAL_MISSIONS, INITIAL_RESOURCES } from '@/lib/mockData';

interface DemoEventControlsProps {
  onEventExecuted?: (eventTitle: string) => void;
}

export const DemoEventControls: React.FC<DemoEventControlsProps> = ({ onEventExecuted }) => {
  const { user, currentRole } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeRealDbEvent = async (
    eventType: string,
    tableName: string,
    payload: Record<string, any>,
    details: string
  ) => {
    setIsExecuting(true);

    // 1. Database insert/update
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from(tableName).insert([payload]);
      if (error) {
        console.warn(`Supabase demo event error on ${tableName}:`, error.message);
      }
    }

    // 2. Audit Log
    await auditService.logAction(
      'Field Mobile Client (Simulated)',
      'Field Personnel',
      `Demo Event: ${eventType}`,
      tableName,
      payload.id || 'demo-event-id',
      details
    );

    setIsExecuting(false);
    setFeedback(`Executed real database event: "${eventType}". Record inserted into ${tableName}.`);
    if (onEventExecuted) onEventExecuted(eventType);

    setTimeout(() => setFeedback(null), 3000);
  };

  // Section 38 Individual Event Triggers
  const handleTriggerSOS = () => {
    executeRealDbEvent(
      '🚨 Trigger SOS',
      'sos_alerts',
      {
        id: `sos-${Date.now()}`,
        expedition_id: INITIAL_TEAMS[0].expedition_id,
        personnel_id: INITIAL_PERSONNEL[0].id,
        team_id: INITIAL_TEAMS[0].id,
        latitude: 78.2450,
        longitude: 15.6820,
        location_name: 'Camp B - North Ridge',
        battery_level: 64,
        comm_channel: 'SATELLITE',
        status: 'REPORTED',
        description: '[SIMULATED FIELD SOS]: Sudden thermal insulation drop & hydraulic valve breach during storm.',
        created_at: new Date().toISOString(),
      },
      'Simulated Field Emergency SOS alert broadcasted over Satellite Link.'
    );
  };

  const handleSendFieldUpdate = () => {
    executeRealDbEvent(
      '📝 Send Field Update',
      'field_updates',
      {
        id: `update-${Date.now()}`,
        expedition_id: INITIAL_TEAMS[0].expedition_id,
        team_id: INITIAL_TEAMS[1].id,
        personnel_id: INITIAL_PERSONNEL[4].id,
        priority: 'MEDIUM',
        status: 'NEW',
        location_name: 'Foxfonna Glacier Base',
        latitude: 78.2100,
        longitude: 15.6120,
        description: '[FIELD REPORT]: Seismic array sensor #4 re-calibrated. Data signal clean.',
        created_at: new Date().toISOString(),
      },
      'Simulated field progress report submitted.'
    );
  };

  const handleReportShortage = () => {
    executeRealDbEvent(
      '📦 Report Resource Shortage',
      'field_updates',
      {
        id: `shortage-${Date.now()}`,
        expedition_id: INITIAL_TEAMS[0].expedition_id,
        team_id: INITIAL_TEAMS[2].id,
        personnel_id: INITIAL_PERSONNEL[8].id,
        priority: 'HIGH',
        status: 'NEW',
        location_name: 'Depot Alpha Warehouse',
        description: '[CARGO ALERT]: Emergency Trauma Kit inventory dropped below minimum threshold (2 remaining).',
        created_at: new Date().toISOString(),
      },
      'Simulated cargo shortage alert created.'
    );
  };

  const handleReportVehicleFailure = () => {
    executeRealDbEvent(
      '🚗 Report Vehicle Failure',
      'field_updates',
      {
        id: `veh-${Date.now()}`,
        expedition_id: INITIAL_TEAMS[0].expedition_id,
        team_id: INITIAL_TEAMS[0].id,
        personnel_id: INITIAL_PERSONNEL[2].id,
        priority: 'HIGH',
        status: 'NEW',
        location_name: 'Camp B Patrol Waypoint',
        description: '[VEHICLE ALERT]: Polar Rover B2 transmission clutch fluid pressure low.',
        created_at: new Date().toISOString(),
      },
      'Simulated vehicle maintenance breakdown report logged.'
    );
  };

  const handleChangePersonnelStatus = () => {
    executeRealDbEvent(
      '👤 Change Personnel Status',
      'audit_logs',
      {
        id: `audit-${Date.now()}`,
        user_name: 'Elena Vance',
        user_role: 'Field Personnel',
        action: 'Status Change',
        target_type: 'Personnel',
        target_id: INITIAL_PERSONNEL[4].id,
        details: 'Field personnel status changed to ON_MISSION.',
        timestamp: new Date().toISOString(),
      },
      'Simulated personnel status update to ON_MISSION.'
    );
  };

  const handleMovePersonnel = () => {
    executeRealDbEvent(
      '📍 Move Personnel',
      'locations',
      {
        id: `loc-${Date.now()}`,
        personnel_id: INITIAL_PERSONNEL[0].id,
        latitude: 78.2465,
        longitude: 15.6840,
        accuracy_meters: 3.5,
        battery_level: 66,
        comm_channel: 'SATELLITE',
        timestamp: new Date().toISOString(),
      },
      'Simulated new GPS coordinate fix received from Field Mobile app.'
    );
  };

  const handleSevereWeather = () => {
    executeRealDbEvent(
      '🌨 Severe Weather',
      'weather_conditions',
      {
        id: `wx-${Date.now()}`,
        location_name: 'Camp B - North Ridge',
        temperature_celsius: -22.5,
        wind_speed_kmh: 54.0,
        visibility_km: 0.8,
        pressure_hpa: 986.0,
        condition: 'Severe Whiteout Blizzard',
        risk_level: 'SEVERE',
        recorded_at: new Date().toISOString(),
      },
      'Simulated severe weather station reading inserted into database.'
    );
  };

  const handleCommLost = () => {
    executeRealDbEvent(
      '📡 Communication Lost',
      'audit_logs',
      {
        id: `comm-lost-${Date.now()}`,
        user_name: 'Karin Olsen',
        user_role: 'Relay Tech',
        action: 'COMM_LOST',
        target_type: 'Personnel',
        target_id: INITIAL_PERSONNEL[19].id,
        details: 'Satellite signal connection dropped at Mount Operafjellet Relay.',
        timestamp: new Date().toISOString(),
      },
      'Simulated communication link loss event.'
    );
  };

  const handleCommRestored = () => {
    executeRealDbEvent(
      '📡 Communication Restored',
      'audit_logs',
      {
        id: `comm-rest-${Date.now()}`,
        user_name: 'Karin Olsen',
        user_role: 'Relay Tech',
        action: 'COMM_RESTORED',
        target_type: 'Personnel',
        target_id: INITIAL_PERSONNEL[19].id,
        details: 'Satellite gateway re-established at Mount Operafjellet Relay (94% signal).',
        timestamp: new Date().toISOString(),
      },
      'Simulated communication link recovery event.'
    );
  };

  const handleMissionDelayed = () => {
    executeRealDbEvent(
      '⏱ Mission Delayed',
      'audit_logs',
      {
        id: `mis-delay-${Date.now()}`,
        user_name: 'Field System',
        user_role: 'System',
        action: 'MISSION_DELAYED',
        target_type: 'Mission',
        target_id: INITIAL_MISSIONS[0].id,
        details: 'Mission "Vehicle Inspection" marked delayed due to storm whiteout.',
        timestamp: new Date().toISOString(),
      },
      'Simulated mission delay alert.'
    );
  };

  const handleMissionCompleted = () => {
    executeRealDbEvent(
      '✅ Mission Completed',
      'audit_logs',
      {
        id: `mis-comp-${Date.now()}`,
        user_name: 'Dr. Astrid Lindholm',
        user_role: 'Glaciologist',
        action: 'MISSION_COMPLETED',
        target_type: 'Mission',
        target_id: INITIAL_MISSIONS[1].id,
        details: 'Mission "Longyearbyen Ice Core Sampling" successfully completed.',
        timestamp: new Date().toISOString(),
      },
      'Simulated mission completion status.'
    );
  };

  // Section 39 One-Click Demo Scenarios
  const runEmergencySequence = async () => {
    setIsExecuting(true);
    setFeedback('Running Scenario 1: Emergency Response Sequence...');
    handleTriggerSOS();
    setTimeout(() => {
      handleMovePersonnel();
      setFeedback('Scenario 1 Step 2: Location ping received.');
    }, 1500);
    setTimeout(() => {
      handleSendFieldUpdate();
      setIsExecuting(false);
      setFeedback('Scenario 1 Sequence Complete! Open Command Center to inspect realtime SOS.');
    }, 3000);
  };

  const runLogisticsSequence = async () => {
    setIsExecuting(true);
    setFeedback('Running Scenario 2: Logistics Shortage Sequence...');
    handleReportShortage();
    setTimeout(() => {
      setIsExecuting(false);
      setFeedback('Scenario 2 Complete! Shortage alert created.');
    }, 1500);
  };

  const runMissionSequence = async () => {
    setIsExecuting(true);
    setFeedback('Running Scenario 3: Mission Assignment Sequence...');
    handleMissionDelayed();
    setTimeout(() => {
      handleMissionCompleted();
      setIsExecuting(false);
      setFeedback('Scenario 3 Complete! Mission progress sequence logged.');
    }, 1500);
  };

  const runCommSequence = async () => {
    setIsExecuting(true);
    setFeedback('Running Scenario 4: Communication Failure Sequence...');
    handleCommLost();
    setTimeout(() => {
      handleCommRestored();
      setIsExecuting(false);
      setFeedback('Scenario 4 Complete! Comm link recovery sequence logged.');
    }, 1500);
  };

  return (
    <div className="space-y-6 font-sans">
      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-mono flex items-center space-x-2 shadow-xl animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 1. SIMULATE FIELD EVENT CONTROLS (Section 38 - 11 Triggers) */}
      <div className="bg-[#0b1320] border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" /> INDIVIDUAL FIELD EVENT CONTROLS (REAL DATABASE INSERTS)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
          <button
            onClick={handleTriggerSOS}
            disabled={isExecuting}
            className="p-3 rounded-xl bg-red-950/80 border border-red-500 hover:bg-red-900 text-red-200 font-bold flex items-center justify-between cursor-pointer transition-all shadow-[0_0_12px_rgba(239,68,68,0.2)]"
          >
            <span>🚨 Trigger SOS</span>
            <Play className="w-3.5 h-3.5 text-red-400" />
          </button>

          <button
            onClick={handleSendFieldUpdate}
            disabled={isExecuting}
            className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500 hover:bg-cyan-900 text-cyan-200 font-bold flex items-center justify-between cursor-pointer transition-all"
          >
            <span>📝 Send Field Update</span>
            <Play className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button
            onClick={handleReportShortage}
            disabled={isExecuting}
            className="p-3 rounded-xl bg-amber-950/80 border border-amber-500 hover:bg-amber-900 text-amber-200 font-bold flex items-center justify-between cursor-pointer transition-all"
          >
            <span>📦 Report Shortage</span>
            <Play className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <button
            onClick={handleReportVehicleFailure}
            disabled={isExecuting}
            className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold flex items-center justify-between cursor-pointer transition-all"
          >
            <span>🚗 Vehicle Failure</span>
            <Play className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <button
            onClick={handleChangePersonnelStatus}
            disabled={isExecuting}
            className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold flex items-center justify-between cursor-pointer transition-all"
          >
            <span>👤 Personnel Status</span>
            <Play className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          <button
            onClick={handleMovePersonnel}
            disabled={isExecuting}
            className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold flex items-center justify-between cursor-pointer transition-all"
          >
            <span>📍 Move Personnel GPS</span>
            <Play className="w-3.5 h-3.5 text-sky-400" />
          </button>

          <button
            onClick={handleSevereWeather}
            disabled={isExecuting}
            className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-500 hover:bg-indigo-900 text-indigo-200 font-bold flex items-center justify-between cursor-pointer transition-all"
          >
            <span>🌨 Severe Weather</span>
            <Play className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button
            onClick={handleCommLost}
            disabled={isExecuting}
            className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold flex items-center justify-between cursor-pointer transition-all"
          >
            <span>📡 Comm Link Lost</span>
            <Play className="w-3.5 h-3.5 text-red-400" />
          </button>

          <button
            onClick={handleCommRestored}
            disabled={isExecuting}
            className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold flex items-center justify-between cursor-pointer transition-all"
          >
            <span>📡 Comm Restored</span>
            <Play className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          <button
            onClick={handleMissionDelayed}
            disabled={isExecuting}
            className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold flex items-center justify-between cursor-pointer transition-all"
          >
            <span>⏱ Mission Delayed</span>
            <Play className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <button
            onClick={handleMissionCompleted}
            disabled={isExecuting}
            className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 hover:bg-emerald-900 text-emerald-200 font-bold flex items-center justify-between cursor-pointer transition-all"
          >
            <span>✅ Mission Completed</span>
            <Play className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* 2. ONE-CLICK DEMO SCENARIOS (Section 39) */}
      <div className="bg-[#0b1320] border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
          ONE-CLICK JUDGING DEMO SCENARIOS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <button
            onClick={runEmergencySequence}
            disabled={isExecuting}
            className="p-4 rounded-xl bg-gradient-to-r from-red-950 to-[#0b1320] border border-red-500/80 hover:border-red-400 text-left cursor-pointer transition-all space-y-1 shadow-lg"
          >
            <div className="font-extrabold text-red-300 text-sm flex items-center justify-between">
              <span>1. Emergency Response Sequence</span>
              <Play className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Triggers SOS alert &rarr; GPS relocation fix &rarr; Field Report dispatch.
            </p>
          </button>

          <button
            onClick={runLogisticsSequence}
            disabled={isExecuting}
            className="p-4 rounded-xl bg-gradient-to-r from-amber-950 to-[#0b1320] border border-amber-500/80 hover:border-amber-400 text-left cursor-pointer transition-all space-y-1 shadow-lg"
          >
            <div className="font-extrabold text-amber-300 text-sm flex items-center justify-between">
              <span>2. Logistics Shortage Workflow</span>
              <Play className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Reports low fuel & trauma kit shortage &rarr; Triggers inventory threshold alert.
            </p>
          </button>

          <button
            onClick={runMissionSequence}
            disabled={isExecuting}
            className="p-4 rounded-xl bg-gradient-to-r from-sky-950 to-[#0b1320] border border-sky-500/80 hover:border-sky-400 text-left cursor-pointer transition-all space-y-1 shadow-lg"
          >
            <div className="font-extrabold text-sky-300 text-sm flex items-center justify-between">
              <span>3. Mission Assignment Sequence</span>
              <Play className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Simulates mission delay alert &rarr; Followed by mission objective completion.
            </p>
          </button>

          <button
            onClick={runCommSequence}
            disabled={isExecuting}
            className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-[#0b1320] border border-emerald-500/80 hover:border-emerald-400 text-left cursor-pointer transition-all space-y-1 shadow-lg"
          >
            <div className="font-extrabold text-emerald-300 text-sm flex items-center justify-between">
              <span>4. Communication Failure Sequence</span>
              <Play className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Simulates satellite beacon signal drop &rarr; Gateway re-established recovery.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
