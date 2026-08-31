import React, { useState } from 'react';
import { 
  Compass, 
  Wifi, 
  Bell, 
  MessageSquare, 
  ShieldAlert 
} from 'lucide-react';
import type { HQRole } from '@/types';
import type { NavTab } from '@/components/layout/Sidebar';
import { NotificationCenterModal } from '@/features/notifications/components/NotificationCenterModal';
import { useAppData } from '@/context/AppDataContext';

interface HeaderProps {
  currentExpeditionName?: string;
  isRealtimeConnected?: boolean;
  sosAlertCount?: number;
  notificationCount?: number;
  unreadMessageCount?: number;
  currentAdminName?: string;
  currentRole: HQRole;
  onRoleChange: (role: HQRole) => void;
  onNavigateTab?: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentExpeditionName = 'Arctic Expedition Alpha',
  isRealtimeConnected = true,
  sosAlertCount = 0,
  unreadMessageCount = 3,
  currentAdminName = 'Commander Admin',
  onNavigateTab = () => {},
}) => {
  const [showNotifModal, setShowNotifModal] = useState(false);
  // Derive live notification count from shared context
  const { notifications } = useAppData();
  const notificationCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-[#09111e] border-b border-cyan-900/40 px-4 flex items-center justify-between shadow-lg relative z-30 font-sans select-none">
      {/* Brand & System Title */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading font-extrabold tracking-wider text-lg bg-gradient-to-r from-slate-100 via-cyan-100 to-sky-400 bg-clip-text text-transparent">
                DHRUVA COMMAND
              </span>

              <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 uppercase">
                HQ COMMAND CENTER
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <span>{currentExpeditionName}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-mono text-[11px]">77.85° S 166.67° E (McMurdo Sector)</span>

            </p>
          </div>
        </div>
      </div>

      {/* Center Operational Status Badges */}
      <div className="hidden lg:flex items-center space-x-4">
        {/* Realtime Status */}
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-mono font-medium ${
          isRealtimeConnected 
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
            : 'bg-amber-950/60 border-amber-500/40 text-amber-300 animate-pulse'
        }`}>
          <Wifi className="w-3.5 h-3.5" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>{isRealtimeConnected ? 'REALTIME CONNECTED' : 'RECONNECTING...'}</span>
        </div>

        {/* SOS Emergency Indicator */}
        <button
          onClick={() => onNavigateTab('emergency')}
          className={`flex items-center space-x-2 px-3 py-1 rounded-md border text-xs font-mono font-bold transition-all cursor-pointer ${
            sosAlertCount > 0 
              ? 'bg-red-950/80 border-red-500/80 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.35)] animate-sos-flash' 
              : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>🚨 {sosAlertCount}</span>
        </button>

        {/* Notifications */}
        <button 
          onClick={() => setShowNotifModal(true)}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 text-xs font-mono transition-colors cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5 text-cyan-400" />
          <span>🔔 {notificationCount}</span>
        </button>

        {/* Unread Messages */}
        <button 
          onClick={() => onNavigateTab('communications')}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-sky-500/50 hover:text-sky-300 text-xs font-mono transition-colors cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
          <span>💬 {unreadMessageCount}</span>
        </button>
      </div>

      {/* HQ Admin Avatar */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-cyan-500/40 flex items-center justify-center text-xs font-bold font-mono text-cyan-300">
            HQ
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-medium text-slate-200">{currentAdminName}</p>
            <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Commander Admin
            </p>
          </div>
        </div>
      </div>

      {/* Notification Center Modal */}
      {showNotifModal && (
        <NotificationCenterModal
          onClose={() => setShowNotifModal(false)}
          onNavigateTab={onNavigateTab}
        />
      )}
    </header>
  );
};
