import React, { useState } from 'react';
import { CloudSnow, Wind, Thermometer, Gauge, Eye, AlertTriangle, Send, PauseCircle, Edit3, Bell } from 'lucide-react';
import { INITIAL_WEATHER } from '@/lib/mockData';
import type { WeatherCondition } from '@/types';
import { WeatherAlertModal } from '@/features/weather/components/WeatherAlertModal';

export const WeatherPage: React.FC = () => {
  const [selectedWeather, setSelectedWeather] = useState<WeatherCondition | null>(null);
  const [actionType, setActionType] = useState<'NOTIFY' | 'MODIFY' | 'PAUSE' | 'INSTRUCTION' | null>(null);

  const openAction = (w: WeatherCondition, type: 'NOTIFY' | 'MODIFY' | 'PAUSE' | 'INSTRUCTION') => {
    setSelectedWeather(w);
    setActionType(type);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1424] border border-cyan-900/60 p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <CloudSnow className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              Antarctic Weather & Environmental Telemetry
            </span>
          </div>
          <h1 className="text-xl font-extrabold font-heading text-slate-100">
            ANTARCTICA HIGH PLATEAU METEOROLOGICAL TELEMETRY ({INITIAL_WEATHER.length} STATIONS)
          </h1>

          <p className="text-xs text-slate-400 mt-1">
            Real-time weather station alerts, wind chill metrics, visibility indices, and storm warnings.
          </p>
        </div>
      </div>

      {/* Weather Station Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {INITIAL_WEATHER.map((w) => (
          <div key={w.id} className="bg-[#0b1320] border border-slate-800 rounded-xl p-5 space-y-4 font-sans">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold font-heading text-slate-100">{w.location_name}</h3>
                <p className="text-xs text-cyan-300 font-mono mt-0.5">{w.condition}</p>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded uppercase ${
                w.risk_level === 'SEVERE' || w.risk_level === 'HIGH'
                  ? 'bg-red-950 text-red-300 border border-red-500/80 animate-pulse'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
              }`}>
                {w.risk_level} RISK
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2 border-t border-slate-800">
              <div className="bg-[#060c16] p-2.5 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-[10px] flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-cyan-400" /> Temp
                </div>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{w.temperature_celsius}°C</div>
              </div>

              <div className="bg-[#060c16] p-2.5 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-[10px] flex items-center gap-1">
                  <Wind className="w-3 h-3 text-sky-400" /> Wind
                </div>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{w.wind_speed_kmh} km/h</div>
              </div>

              <div className="bg-[#060c16] p-2.5 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-[10px] flex items-center gap-1">
                  <Eye className="w-3 h-3 text-indigo-400" /> Visibility
                </div>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{w.visibility_km} km</div>
              </div>

              <div className="bg-[#060c16] p-2.5 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-[10px] flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-emerald-400" /> Pressure
                </div>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{w.pressure_hpa} hPa</div>
              </div>
            </div>

            {/* HQ Weather Command Actions (Section 33: NOTIFY TEAM, MODIFY MISSION, PAUSE MISSION, SEND INSTRUCTION) */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5 font-mono text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">HQ Weather Actions:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => openAction(w, 'NOTIFY')}
                  className="py-2 px-2 rounded-lg bg-cyan-950 border border-cyan-700 hover:bg-cyan-900 text-cyan-200 text-[11px] font-bold cursor-pointer transition-colors flex items-center justify-center space-x-1"
                >
                  <Bell className="w-3 h-3 text-cyan-400" />
                  <span>NOTIFY TEAM</span>
                </button>

                <button
                  onClick={() => openAction(w, 'MODIFY')}
                  className="py-2 px-2 rounded-lg bg-sky-950 border border-sky-700 hover:bg-sky-900 text-sky-200 text-[11px] font-bold cursor-pointer transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit3 className="w-3 h-3 text-sky-400" />
                  <span>MODIFY</span>
                </button>

                <button
                  onClick={() => openAction(w, 'PAUSE')}
                  className="py-2 px-2 rounded-lg bg-amber-950 border border-amber-700 hover:bg-amber-900 text-amber-200 text-[11px] font-bold cursor-pointer transition-colors flex items-center justify-center space-x-1"
                >
                  <PauseCircle className="w-3 h-3 text-amber-400" />
                  <span>PAUSE</span>
                </button>

                <button
                  onClick={() => openAction(w, 'INSTRUCTION')}
                  className="py-2 px-2 rounded-lg bg-red-950 border border-red-700 hover:bg-red-900 text-red-200 text-[11px] font-bold cursor-pointer transition-colors flex items-center justify-center space-x-1"
                >
                  <Send className="w-3 h-3 text-red-400" />
                  <span>INSTRUCT</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedWeather && actionType && (
        <WeatherAlertModal
          weather={selectedWeather}
          actionType={actionType}
          onClose={() => {
            setSelectedWeather(null);
            setActionType(null);
          }}
        />
      )}
    </div>
  );
};
