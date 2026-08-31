import React, { useState } from 'react';
import { X, CloudSnow, Wind, AlertTriangle, Send, CheckCircle2, PauseCircle, Edit } from 'lucide-react';
import type { WeatherCondition } from '@/types';
import { auditService, messageService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { INITIAL_TEAMS } from '@/lib/mockData';

interface WeatherAlertModalProps {
  weather: WeatherCondition | null;
  actionType: 'NOTIFY' | 'MODIFY' | 'PAUSE' | 'INSTRUCTION' | null;
  onClose: () => void;
}

export const WeatherAlertModal: React.FC<WeatherAlertModalProps> = ({
  weather,
  actionType,
  onClose,
}) => {
  const { user, currentRole } = useAuth();
  const [instructionText, setInstructionText] = useState(
    `WEATHER ADVISORY: Severe storm conditions (-18°C, gale force winds) detected at ${weather?.location_name || 'Camp B'}. Maintain shelter.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!weather || !actionType) return null;

  const handleExecute = async () => {
    setIsSubmitting(true);

    let actionLabel = 'Weather Alert Executed';
    if (actionType === 'NOTIFY') actionLabel = 'Notified Field Team of Severe Weather';
    else if (actionType === 'MODIFY') actionLabel = 'Modified Mission Parameters for Storm Safety';
    else if (actionType === 'PAUSE') actionLabel = 'Paused Field Mission Due to Blizzard';
    else if (actionType === 'INSTRUCTION') actionLabel = 'Issued Polar Weather Safety Order';

    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      actionLabel,
      'WeatherCondition',
      weather.id,
      `Action taken for ${weather.location_name}: ${instructionText}`
    );

    // Send broadcast message
    await messageService.send({
      expedition_id: INITIAL_TEAMS[0].expedition_id,
      sender_id: user?.id || '00000000-0000-0000-0000-000000000001',
      sender_name: `${user?.full_name || 'Commander Admin'} (${currentRole})`,
      channel: 'SATELLITE',
      message: `[WEATHER ADVISORY]: ${instructionText}`,
      priority: 'HIGH',
      status: 'SENT',
    });

    setIsSubmitting(false);
    setFeedback(`Action "${actionLabel}" executed. Audit log & satellite broadcast recorded.`);

    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b14]/85 backdrop-blur-sm p-4 font-sans">
      <div className="w-full max-w-lg bg-[#09111e] border border-cyan-900/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#060c16] border-b border-slate-800 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-2">
            <CloudSnow className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="font-bold text-slate-100 uppercase tracking-wider">
              HQ WEATHER COMMAND ACTION
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
        <div className="p-6 space-y-4 flex-1 overflow-y-auto font-mono text-xs">
          {feedback && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          <div className="p-3 bg-[#060c16] rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400 font-bold uppercase text-[10px]">Location Telemetry:</div>
            <div className="text-slate-100 font-bold text-sm">{weather.location_name}</div>
            <div className="text-red-400 font-bold">
              {weather.temperature_celsius}°C • {weather.wind_speed_kmh} km/h wind • Risk: {weather.risk_level}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">
              Advisory Order Content
            </label>
            <textarea
              value={instructionText}
              onChange={(e) => setInstructionText(e.target.value)}
              rows={4}
              required
              className="w-full bg-[#060c16] border border-slate-700 focus:border-cyan-500 rounded-xl p-3 text-xs font-mono text-slate-100 font-sans"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleExecute}
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold tracking-wider uppercase flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'EXECUTING ACTION...' : `EXECUTE ${actionType} ACTION`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
