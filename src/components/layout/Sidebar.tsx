import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Boxes, 
  ShieldAlert, 
  Users, 
  Target, 
  MessageSquare, 
  CloudSnow, 
  History, 
  Settings 
} from 'lucide-react';

export type NavTab = 
  | 'command-center'
  | 'operations'
  | 'logistics'
  | 'emergency'
  | 'personnel'
  | 'missions'
  | 'communications'
  | 'weather'
  | 'activity'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  sosAlertCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  sosAlertCount = 0,
}) => {
  const mainNavItems = [
    { id: 'command-center', label: 'COMMAND CENTER', icon: LayoutDashboard },
    { id: 'operations', label: 'OPERATIONS', icon: Activity },
    { id: 'logistics', label: 'LOGISTICS', icon: Boxes },
    { id: 'emergency', label: 'EMERGENCY / SOS', icon: ShieldAlert, badge: sosAlertCount },
    { id: 'personnel', label: 'PERSONNEL', icon: Users },
    { id: 'missions', label: 'MISSIONS', icon: Target },
    { id: 'communications', label: 'COMMUNICATIONS', icon: MessageSquare },
    { id: 'weather', label: 'WEATHER', icon: CloudSnow },
  ];

  const secondaryNavItems = [
    { id: 'activity', label: 'AUDIT LOG', icon: History },
    { id: 'settings', label: 'SETTINGS', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#08101d] border-r border-slate-800/80 flex flex-col justify-between select-none shrink-0 h-[calc(100vh-4rem)]">
      {/* Primary Navigation Section */}
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-mono font-semibold tracking-widest text-slate-500 uppercase">
          HQ Workspaces
        </div>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as NavTab)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-red-900/80 border border-red-500/60 text-red-300 rounded animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Secondary Bottom Navigation */}
      <div className="p-3 border-t border-slate-800/80 space-y-1 bg-[#060c16]">
        <div className="px-3 py-1 text-[10px] font-mono font-semibold tracking-widest text-slate-500 uppercase">
          Administration
        </div>
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as NavTab)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Telemetry Status Footer */}
        <div className="mt-3 p-2 rounded bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400">
          <div className="flex justify-between items-center mb-1">
            <span>GRID: ARCTIC-SECTOR-9</span>
            <span className="text-emerald-400">ONLINE</span>
          </div>
          <div className="text-[9px] text-slate-500 truncate">
            LAT 78.22°N • LON 15.65°E
          </div>
        </div>
      </div>
    </aside>
  );
};
