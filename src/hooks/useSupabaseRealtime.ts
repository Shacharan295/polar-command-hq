import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface RealtimeCallbacks {
  onSOSAlert?: (payload: any) => void;
  onFieldUpdate?: (payload: any) => void;
  onLocationUpdate?: (payload: any) => void;
  onMissionUpdate?: (payload: any) => void;
  onResourceUpdate?: (payload: any) => void;
  onMessageReceived?: (payload: any) => void;
  onWeatherUpdate?: (payload: any) => void;
  onAuditLog?: (payload: any) => void;
}

export const useSupabaseRealtime = (callbacks: RealtimeCallbacks) => {
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('dhruva-hq-realtime-stream')

      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sos_alerts' },
        (payload) => {
          console.log('[REALTIME] SOS Alert payload:', payload);
          if (callbacks.onSOSAlert) callbacks.onSOSAlert(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'field_updates' },
        (payload) => {
          console.log('[REALTIME] Field Update payload:', payload);
          if (callbacks.onFieldUpdate) callbacks.onFieldUpdate(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'locations' },
        (payload) => {
          console.log('[REALTIME] Location payload:', payload);
          if (callbacks.onLocationUpdate) callbacks.onLocationUpdate(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'missions' },
        (payload) => {
          console.log('[REALTIME] Mission payload:', payload);
          if (callbacks.onMissionUpdate) callbacks.onMissionUpdate(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'resources' },
        (payload) => {
          console.log('[REALTIME] Resource payload:', payload);
          if (callbacks.onResourceUpdate) callbacks.onResourceUpdate(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('[REALTIME] Message payload:', payload);
          if (callbacks.onMessageReceived) callbacks.onMessageReceived(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'weather_conditions' },
        (payload) => {
          console.log('[REALTIME] Weather payload:', payload);
          if (callbacks.onWeatherUpdate) callbacks.onWeatherUpdate(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'audit_logs' },
        (payload) => {
          console.log('[REALTIME] Audit log payload:', payload);
          if (callbacks.onAuditLog) callbacks.onAuditLog(payload);
        }
      )
      .subscribe((status) => {
        console.log('[REALTIME] Subscription Status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [callbacks]);
};
