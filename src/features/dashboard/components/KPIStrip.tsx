import React from 'react';
import { Users, Target, ShieldAlert, AlertTriangle, WifiOff } from 'lucide-react';
import type { NavTab } from '@/components/layout/Sidebar';
import type { Personnel, Mission, SOSAlert, Resource } from '@/types';

interface KPIStripProps {
  personnel: Personnel[];
  missions: Mission[];
  sosAlerts: SOSAlert[];
  resources: Resource[];
  onNavigate: (tab: NavTab) => void;
}

export const KPIStrip: React.FC<KPIStripProps> = ({
  personnel,
  missions,
  sosAlerts,
  resources,
  onNavigate,
}) => {
  const activePersonnelCount = personnel.filter((p) => p.status !== 'OFFLINE').length;
  const activeMissionsCount = missions.filter((m) => m.status === 'ACTIVE' || m.status === 'ASSIGNED' || m.status === 'EMERGENCY').length;
  const emergenciesCount = sosAlerts.filter((s) => s.status !== 'RESOLVED').length;
  const resourceAlertsCount = resources.filter((r) => r.status === 'LOW' || r.status === 'CRITICAL' || r.quantity_available <= r.critical_threshold).length;
  const offlinePersonnelCount = personnel.filter((p) => p.status === 'OFFLINE').length;

  const kpis = [
    {
      id: 'personnel',
      tab: 'personnel' as NavTab,
      label: 'ACTIVE PERSONNEL',
      value: String(activePersonnelCount).padStart(2, '0'),
      icon: Users,
      color: 'text-emerald-400',
      bgColor: 'bg-[#0b1320]',
      borderColor: 'border-slate-800',
      hoverBorder: 'hover:border-cyan-500/60',
    },
    {
      id: 'missions',
      tab: 'operations' as NavTab,
      label: 'ACTIVE MISSIONS',
      value: String(activeMissionsCount).padStart(2, '0'),
      icon: Target,
      color: 'text-sky-400',
      bgColor: 'bg-[#0b1320]',
      borderColor: 'border-slate-800',
      hoverBorder: 'hover:border-cyan-500/60',
    },
    {
      id: 'emergencies',
      tab: 'emergency' as NavTab,
      label: 'EMERGENCIES',
      value: String(emergenciesCount).padStart(2, '0'),
      icon: ShieldAlert,
      color: emergenciesCount > 0 ? 'text-red-400' : 'text-slate-400',
      bgColor: emergenciesCount > 0 ? 'bg-red-950/40 border-red-500/80 animate-pulse' : 'bg-[#0b1320]',
      borderColor: emergenciesCount > 0 ? 'border-red-500/80' : 'border-slate-800',
      hoverBorder: 'hover:border-red-400',
      badge: emergenciesCount > 0 ? 'CRITICAL' : undefined,
    },
    {
      id: 'resources',
      tab: 'logistics' as NavTab,
      label: 'RESOURCE ALERTS',
      value: String(resourceAlertsCount).padStart(2, '0'),
      icon: AlertTriangle,
      color: resourceAlertsCount > 0 ? 'text-amber-400' : 'text-slate-400',
      bgColor: 'bg-[#0b1320]',
      borderColor: 'border-slate-800',
      hoverBorder: 'hover:border-amber-400',
    },
    {
      id: 'offline',
      tab: 'personnel' as NavTab,
      label: 'OFFLINE PERSONNEL',
      value: String(offlinePersonnelCount).padStart(2, '0'),
      icon: WifiOff,
      color: 'text-slate-400',
      bgColor: 'bg-[#0b1320]',
      borderColor: 'border-slate-800',
      hoverBorder: 'hover:border-cyan-500/60',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-sans">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <button
            key={kpi.id}
            onClick={() => onNavigate(kpi.tab)}
            className={`p-3.5 rounded-xl border ${kpi.bgColor} ${kpi.borderColor} ${kpi.hoverBorder} text-left transition-all cursor-pointer shadow-lg group relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase group-hover:text-slate-200 transition-colors">
                {kpi.label}
              </span>
              <Icon className={`w-4 h-4 ${kpi.color}`} />
            </div>

            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-extrabold font-mono tracking-tight ${kpi.color}`}>
                {kpi.value}
              </span>
              {kpi.badge && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/80 uppercase">
                  {kpi.badge}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
