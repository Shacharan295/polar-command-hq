import { useEffect, useRef } from 'react';
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
  const callbacksRef = useRef(callbacks);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channelId = `dhruva-hq-realtime-stream-${Math.random().toString(36).substring(7)}`;
    console.log(`[REALTIME] Creating channel: ${channelId}`);
    
    const channel = supabase
      .channel(channelId)

      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sos_alerts' },
        (payload) => {
          console.log('[REALTIME] SOS Alert payload:', payload);
          if (callbacksRef.current.onSOSAlert) callbacksRef.current.onSOSAlert(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'field_updates' },
        (payload) => {
          console.log('[REALTIME] Field Update payload:', payload);
          if (callbacksRef.current.onFieldUpdate) callbacksRef.current.onFieldUpdate(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'locations' },
        (payload) => {
          console.log('[REALTIME] Location payload:', payload);
          if (callbacksRef.current.onLocationUpdate) callbacksRef.current.onLocationUpdate(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'missions' },
        (payload) => {
          console.log('[REALTIME] Mission payload:', payload);
          if (callbacksRef.current.onMissionUpdate) callbacksRef.current.onMissionUpdate(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'resources' },
        (payload) => {
          console.log('[REALTIME] Resource payload:', payload);
          if (callbacksRef.current.onResourceUpdate) callbacksRef.current.onResourceUpdate(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('[REALTIME] Message payload:', payload);
          if (callbacksRef.current.onMessageReceived) callbacksRef.current.onMessageReceived(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'weather_conditions' },
        (payload) => {
          console.log('[REALTIME] Weather payload:', payload);
          if (callbacksRef.current.onWeatherUpdate) callbacksRef.current.onWeatherUpdate(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'audit_logs' },
        (payload) => {
          console.log('[REALTIME] Audit log payload:', payload);
          if (callbacksRef.current.onAuditLog) callbacksRef.current.onAuditLog(payload);
        }
      )
      .subscribe((status, err) => {
        console.log(`[REALTIME] Subscription Status for ${channelId}:`, status);
        if (err) {
          console.error('[REALTIME] Subscription Error:', err);
        }
        if (status === 'SUBSCRIBED') {
          console.log('[REALTIME] Successfully SUBSCRIBED to postgres_changes');
        }
        if (status === 'CLOSED') {
          console.log('[REALTIME] Subscription CLOSED');
        }
        if (status === 'TIMED_OUT') {
          console.log('[REALTIME] Subscription TIMED_OUT');
        }
      });

    return () => {
      console.log(`[REALTIME] Removing channel: ${channelId}`);
      supabase.removeChannel(channel);
    };
  }, []); // Only run once on mount
};
