import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppDataProvider, useAppData } from '@/context/AppDataContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { type NavTab } from '@/components/layout/Sidebar';
import { DashboardPage } from '@/pages/DashboardPage';
import { OperationsPage } from '@/pages/OperationsPage';
import { LogisticsPage } from '@/pages/LogisticsPage';
import { EmergencyPage } from '@/pages/EmergencyPage';
import { PersonnelPage } from '@/pages/PersonnelPage';
import { MissionsPage } from '@/pages/MissionsPage';
import { CommunicationsPage } from '@/pages/CommunicationsPage';
import { WeatherPage } from '@/pages/WeatherPage';
import { ActivityHistoryPage } from '@/pages/ActivityHistoryPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AdminLoginModal } from '@/components/auth/AdminLoginModal';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('command-center');
  const { isAuthenticated, currentRole, setCurrentRole } = useAuth();

  // Derive live SOS count from global context — never hardcoded
  const { activeSOSAlerts } = useAppData();
  const sosAlertCount = activeSOSAlerts.length;

  if (!isAuthenticated) {
    return <AdminLoginModal />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'command-center':
        return <DashboardPage currentRole={currentRole} onNavigate={setActiveTab} />;
      case 'operations':
        return <OperationsPage />;
      case 'logistics':
        return <LogisticsPage />;
      case 'emergency':
        return <EmergencyPage />;
      case 'personnel':
        return <PersonnelPage />;
      case 'missions':
        return <MissionsPage />;
      case 'communications':
        return <CommunicationsPage />;
      case 'weather':
        return <WeatherPage />;
      case 'activity':
        return <ActivityHistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage currentRole={currentRole} onNavigate={setActiveTab} />;
    }
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      currentRole={currentRole}
      onRoleChange={setCurrentRole}
      sosAlertCount={sosAlertCount}
      isRealtimeConnected={true}
    >
      {renderActivePage()}
    </AppLayout>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      {/* AppDataProvider must wrap MainAppContent so useAppData() works inside it */}
      <AppDataProvider>
        <MainAppContent />
      </AppDataProvider>
    </AuthProvider>
  );
};

export default App;
