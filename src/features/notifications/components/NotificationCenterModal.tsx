import React from 'react';
import { X, Bell, ShieldAlert, AlertTriangle, WifiOff, CloudSnow, Target, CheckCircle2 } from 'lucide-react';
import type { NotificationItem } from '@/types';
import type { NavTab } from '@/components/layout/Sidebar';
import { useAppData } from '@/context/AppDataContext';

interface NotificationCenterModalProps {
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

const getNotificationIcon = (type: NotificationItem['type']) => {
  switch (type) {
    case 'NEW_SOS':
      return <ShieldAlert className="w-4 h-4 text-red-400" />;
    case 'RESOURCE_SHORTAGE':
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    case 'COMM_LOST':
    case 'COMM_RESTORED':
      return <WifiOff className="w-4 h-4 text-sky-400" />;
    case 'SEVERE_WEATHER':
      return <CloudSnow className="w-4 h-4 text-cyan-400" />;
    case 'MISSION_COMPLETED':
    case 'MISSION_DELAY':
      return <Target className="w-4 h-4 text-sky-300" />;
    default:
      return <Bell className="w-4 h-4 text-slate-400" />;
  }
};

const navigateForNotification = (
  type: NotificationItem['type'],
  onNavigateTab: (tab: NavTab) => void
) => {
  if (type === 'NEW_SOS') onNavigateTab('emergency');
  else if (type === 'RESOURCE_SHORTAGE' || type === 'CARGO_DELAY') onNavigateTab('logistics');
  else if (type === 'NEW_FIELD_UPDATE') onNavigateTab('operations');
  else if (type === 'SEVERE_WEATHER') onNavigateTab('weather');
  else if (type === 'COMM_LOST' || type === 'COMM_RESTORED') onNavigateTab('communications');
  else if (type === 'MISSION_COMPLETED' || type === 'MISSION_DELAY') onNavigateTab('missions');
  else if (type === 'LOW_BATTERY') onNavigateTab('personnel');
  else onNavigateTab('command-center');
};

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  onClose,
  onNavigateTab,
}) => {
  // ─── Read from shared context — reflects live state ───────────────────────
  const { notifications, markNotificationRead } = useAppData();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notif: NotificationItem) => {
    markNotificationRead(notif.id);
    navigateForNotification(notif.type, onNavigateTab);
    onClose();
  };

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      if (!n.read) markNotificationRead(n.id);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b14]/85 backdrop-blur-sm p-4 font-sans">
      <div className="w-full max-w-lg bg-[#09111e] border border-cyan-900/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-[#060c16] border-b border-slate-800 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-slate-100 uppercase tracking-wider">
              REALTIME NOTIFICATION DISPATCH FEED
            </span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-950 border border-red-500/80 text-red-300 text-[9px] font-bold">
                {unreadCount} NEW
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] text-cyan-400 hover:text-cyan-200 font-mono cursor-pointer"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto font-mono text-xs">
          {notifications.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-slate-400">No notifications</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  notif.type === 'NEW_SOS' && !notif.read
                    ? 'bg-red-950/70 border-red-500/80 hover:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    : notif.read
                    ? 'bg-[#060c16] border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-300'
                    : 'bg-cyan-950/30 border-cyan-700/60 text-slate-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {getNotificationIcon(notif.type)}
                    <span className={`text-[10px] uppercase font-bold truncate ${
                      notif.type === 'NEW_SOS' && !notif.read
                        ? 'text-red-300'
                        : notif.read
                        ? 'text-slate-400'
                        : 'text-cyan-300'
                    }`}>
                      {notif.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!notif.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                    <span className="text-[10px] text-slate-500">
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <p className="text-xs font-sans leading-relaxed text-slate-300">
                  {notif.message}
                </p>
                <div className="flex justify-end pt-0.5">
                  <span className="text-[10px] text-cyan-400 font-semibold hover:underline flex items-center gap-1">
                    VIEW ITEM &rarr;
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer summary */}
        <div className="p-3 bg-[#060c16] border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
          <span>{notifications.length} total notifications</span>
          <span className={unreadCount > 0 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All read'}
          </span>
        </div>
      </div>
    </div>
  );
};
