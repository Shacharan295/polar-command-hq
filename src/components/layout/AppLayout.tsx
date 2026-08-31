import React from 'react';
import { Header } from './Header';
import { Sidebar, type NavTab } from './Sidebar';
import type { HQRole } from '@/types';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentRole: HQRole;
  onRoleChange: (role: HQRole) => void;
  sosAlertCount?: number;
  isRealtimeConnected?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  currentRole,
  onRoleChange,
  sosAlertCount = 1,
  isRealtimeConnected = true,
}) => {
  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col overflow-hidden font-sans">
      {/* Top Global Command Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={onRoleChange}
        sosAlertCount={sosAlertCount}
        isRealtimeConnected={isRealtimeConnected}
        onNavigateTab={onTabChange}
      />



      {/* Operational Body: Sidebar + Main Stage */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          sosAlertCount={sosAlertCount}
        />

        <main className="flex-1 overflow-y-auto bg-[#070d18] p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
