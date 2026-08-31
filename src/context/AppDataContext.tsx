/**
 * AppDataContext — DHRUVA COMMAND Single Source of Truth
 *
 * All mutable application data (personnel, missions, SOS alerts, resources,
 * field updates) lives here. Every page reads from and writes to this context
 * so that any state change — e.g. resolving an emergency — is immediately
 * reflected across the KPI strip, map markers, notification badge, and every
 * other component without any manual prop threading.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  Personnel,
  Mission,
  SOSAlert,
  Resource,
  FieldUpdate,
  AuditLog,
  NotificationItem,
} from '@/types';
import {
  INITIAL_PERSONNEL,
  INITIAL_MISSIONS,
  INITIAL_RESOURCES,
  INITIAL_FIELD_UPDATES,
  INITIAL_AUDIT_LOGS,
} from '@/lib/mockData';
import { sosService } from '@/services';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface AppDataContextValue {
  // Data
  personnel: Personnel[];
  missions: Mission[];
  sosAlerts: SOSAlert[];
  resources: Resource[];
  fieldUpdates: FieldUpdate[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];

  // Setters
  setPersonnel: React.Dispatch<React.SetStateAction<Personnel[]>>;
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
  setSosAlerts: React.Dispatch<React.SetStateAction<SOSAlert[]>>;
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  setFieldUpdates: React.Dispatch<React.SetStateAction<FieldUpdate[]>>;
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLog[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;

  // Derived convenience helpers
  activeSOSAlerts: SOSAlert[];
  activeMissions: Mission[];
  activePersonnel: Personnel[];
  offlinePersonnel: Personnel[];
  resourceAlerts: Resource[];

  // Actions
  resolveSOSAlert: (sosId: string) => void;
  acknowledgeSOSAlert: (sosId: string) => void;
  updatePersonnelStatus: (personnelId: string, status: Personnel['status']) => void;
  markNotificationRead: (notificationId: string) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AppDataContext = createContext<AppDataContextValue | null>(null);

// ---------------------------------------------------------------------------
// Seeded initial notifications derived from mock data
// ---------------------------------------------------------------------------

const buildInitialNotifications = (): NotificationItem[] => {
  const now = Date.now();
  return [

    {
      id: 'notif-resource-001',
      type: 'RESOURCE_SHORTAGE',
      title: '⚠ Resource Alert — Heavy Vehicle Repair Toolset',
      message: 'Available units (2) below critical threshold (3) at McMurdo Depot Workshop.',
      target_id: '77777777-7777-7777-7777-000000000004',
      target_type: 'Resource',
      read: false,
      created_at: new Date(now - 1800000).toISOString(),
    },
    {
      id: 'notif-resource-002',
      type: 'RESOURCE_SHORTAGE',
      title: '⚠ Resource Alert — Portable Generator 5kW',
      message: 'CRITICAL: Only 1 unit at Mount Erebus Ridge Camp B. Threshold is 2.',
      target_id: '77777777-7777-7777-7777-000000000006',
      target_type: 'Resource',
      read: false,
      created_at: new Date(now - 900000).toISOString(),
    },
    {
      id: 'notif-comm-001',
      type: 'COMM_LOST',
      title: '📡 Comms Lost — Karin Olsen',
      message: 'Personnel offline for 2+ hours. Satellite signal unavailable at Erebus Outpost Relay.',
      target_id: '33333333-3333-3333-3333-000000000020',
      target_type: 'Personnel',
      read: true,
      created_at: new Date(now - 7200000).toISOString(),
    },
    {
      id: 'notif-mission-001',
      type: 'MISSION_DELAY',
      title: '🎯 Mission — Fuel Supply Depot Transport',
      message: 'Heavy convoy en-route via Ross Ice Shelf Transit Corridor. ETA 4 hours.',
      target_id: '44444444-4444-4444-4444-000000000004',
      target_type: 'Mission',
      read: true,
      created_at: new Date(now - 7200000).toISOString(),
    },
  ];
};

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personnel, setPersonnel] = useState<Personnel[]>(INITIAL_PERSONNEL);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [fieldUpdates, setFieldUpdates] = useState<FieldUpdate[]>(INITIAL_FIELD_UPDATES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(buildInitialNotifications);

  // ---------------------------------------------------------------------------
  // Initialize and Realtime Subscription
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const fetchInitialData = async () => {
      const activeSOS = await sosService.getAll();
      setSosAlerts(prev => {
        // Safe merge: keep any realtime records that arrived before the fetch completed
        const existingIds = new Set(prev.map(s => s.id));
        const missingFromPrev = activeSOS.filter(s => !existingIds.has(s.id));
        console.log('[SOS_REALTIME] Initial fetch completed. Fetched:', activeSOS.length, 'Merged:', missingFromPrev.length);
        return [...missingFromPrev, ...prev];
      });
    };
    fetchInitialData();
  }, []);

  useSupabaseRealtime({
    onSOSAlert: (payload) => {
      if (payload.eventType === 'INSERT') {
        console.log('[SOS_REALTIME] SOS INSERT received:', payload.new);
        const newSos = payload.new as SOSAlert;
        
        console.log('[SOS_REALTIME] BEFORE STATE UPDATE');
        setSosAlerts((prev) => {
          if (prev.find((s) => s.id === newSos.id)) {
            console.log('[SOS_REALTIME] AFTER STATE UPDATE - Ignored (duplicate), Count:', prev.length);
            return prev;
          }
          console.log('[SOS_REALTIME] SOS state updated (INSERT). AFTER STATE UPDATE - Count:', prev.length + 1);
          return [newSos, ...prev];
        });
        
        // Generate a notification for the new SOS
        const personnelName = personnel.find(p => p.id === newSos.personnel_id)?.full_name || 'Field Unit';
        setNotifications((prev) => [
          {
            id: `notif-sos-${newSos.id}`,
            type: 'NEW_SOS',
            title: `🚨 SOS — ${personnelName}`,
            message: newSos.description,
            target_id: newSos.id,
            target_type: 'SOSAlert',
            read: false,
            created_at: newSos.created_at,
          },
          ...prev
        ]);
      } else if (payload.eventType === 'UPDATE') {
        console.log('[SOS_REALTIME] SOS UPDATE received:', payload.new);
        const updatedSos = payload.new as SOSAlert;
        setSosAlerts((prev) => {
          console.log('[SOS_REALTIME] SOS state updated (UPDATE)');
          return prev.map((s) => (s.id === updatedSos.id ? updatedSos : s));
        });
      } else if (payload.eventType === 'DELETE') {
        console.log('[SOS_REALTIME] SOS DELETE received:', payload.old);
        const deletedSos = payload.old as SOSAlert;
        setSosAlerts((prev) => {
          console.log('[SOS_REALTIME] SOS state updated (DELETE)');
          return prev.filter((s) => s.id !== deletedSos.id);
        });
      }
    },
    onFieldUpdate: (payload) => {
      if (payload.eventType === 'INSERT') {
        setFieldUpdates((prev) => [payload.new as any, ...prev]);
      }
    },
    onLocationUpdate: (payload) => {
      if (payload.eventType === 'INSERT' && payload.new.personnel_id) {
        setPersonnel((prev) =>
          prev.map((p) =>
            p.id === payload.new.personnel_id
              ? { ...p, latitude: payload.new.latitude, longitude: payload.new.longitude }
              : p
          )
        );
      }
    },
  });

  // ---------------------------------------------------------------------------
  // Derived values (computed, not stored — always fresh)
  // ---------------------------------------------------------------------------

  const activeSOSAlerts = sosAlerts.filter((s) => s.status !== 'RESOLVED');
  const activeMissions = missions.filter(
    (m) => m.status !== 'COMPLETED' && m.status !== 'CANCELLED'
  );
  const activePersonnel = personnel.filter((p) => p.status !== 'OFFLINE');
  const offlinePersonnel = personnel.filter((p) => p.status === 'OFFLINE');
  const resourceAlerts = resources.filter(
    (r) => r.status === 'LOW' || r.status === 'CRITICAL' || r.quantity_available <= r.critical_threshold
  );

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const resolveSOSAlert = useCallback(
    (sosId: string) => {
      setSosAlerts((prev) =>
        prev.map((s) =>
          s.id === sosId
            ? { ...s, status: 'RESOLVED' as const, resolved_at: new Date().toISOString() }
            : s
        )
      );

      // Dismiss the matching notification
      setNotifications((prev) =>
        prev.map((n) =>
          n.target_id === sosId ? { ...n, read: true } : n
        )
      );

      // Update personnel status back to ACTIVE if they were in EMERGENCY
      const resolved = sosAlerts.find((s) => s.id === sosId);
      if (resolved) {
        setPersonnel((prev) =>
          prev.map((p) =>
            p.id === resolved.personnel_id && p.status === 'EMERGENCY'
              ? { ...p, status: 'ACTIVE' as const }
              : p
          )
        );
      }

      // Append audit log
      setAuditLogs((prev) => [
        {
          id: `audit-resolve-${sosId}-${Date.now()}`,
          user_id: '00000000-0000-0000-0000-000000000001',
          user_name: 'Commander Admin',
          user_role: 'Commander',
          action: 'Emergency Incident Resolved',
          target_type: 'SOSAlert',
          target_id: sosId,
          details: `All resolution checklist conditions satisfied. SOS incident ${sosId} resolved by HQ.`,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    },
    [sosAlerts]
  );

  const acknowledgeSOSAlert = useCallback((sosId: string) => {
    setSosAlerts((prev) =>
      prev.map((s) =>
        s.id === sosId && s.status === 'REPORTED'
          ? { ...s, status: 'ACKNOWLEDGED' as const, acknowledged_at: new Date().toISOString() }
          : s
      )
    );
  }, []);

  const updatePersonnelStatus = useCallback(
    (personnelId: string, status: Personnel['status']) => {
      setPersonnel((prev) =>
        prev.map((p) => (p.id === personnelId ? { ...p, status } : p))
      );
    },
    []
  );

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  // ---------------------------------------------------------------------------
  // Context value
  // ---------------------------------------------------------------------------

  const value: AppDataContextValue = {
    // Data
    personnel,
    missions,
    sosAlerts,
    resources,
    fieldUpdates,
    auditLogs,
    notifications,

    // Setters
    setPersonnel,
    setMissions,
    setSosAlerts,
    setResources,
    setFieldUpdates,
    setAuditLogs,
    setNotifications,

    // Derived
    activeSOSAlerts,
    activeMissions,
    activePersonnel,
    offlinePersonnel,
    resourceAlerts,

    // Actions
    resolveSOSAlert,
    acknowledgeSOSAlert,
    updatePersonnelStatus,
    markNotificationRead,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useAppData = (): AppDataContextValue => {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return ctx;
};
