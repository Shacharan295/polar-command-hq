// Data access layer abstraction for DHRUVA COMMAND HQ

import { supabase } from '@/lib/supabase';
import type { Personnel, Mission, SOSAlert, FieldUpdate, Resource, Message, AuditLog } from '@/types';

export const personnelService = {
  async getAll(): Promise<Personnel[]> {
    const { data, error } = await supabase.from('personnel').select('*');
    if (error) {
      console.warn('personnelService.getAll error:', error.message);
      return [];
    }
    return data || [];
  },
  async updateStatus(id: string, status: string): Promise<boolean> {
    const { error } = await supabase.from('personnel').update({ status }).eq('id', id);
    return !error;
  }
};

export const sosService = {
  async getActive(): Promise<SOSAlert[]> {
    const { data, error } = await supabase.from('sos_alerts').select('*').neq('status', 'RESOLVED');
    if (error) {
      console.warn('sosService.getActive error:', error.message);
      return [];
    }
    return data || [];
  },
  async updateStatus(id: string, status: string, acknowledgedBy?: string): Promise<boolean> {
    const updates: Record<string, any> = { status };
    if (acknowledgedBy) {
      updates.acknowledged_by = acknowledgedBy;
      updates.acknowledged_at = new Date().toISOString();
    }
    if (status === 'RESOLVED') {
      updates.resolved_at = new Date().toISOString();
    }
    const { error } = await supabase.from('sos_alerts').update(updates).eq('id', id);
    return !error;
  }
};

export const fieldUpdateService = {
  async getAll(): Promise<FieldUpdate[]> {
    const { data, error } = await supabase.from('field_updates').select('*');
    if (error) {
      console.warn('fieldUpdateService.getAll error:', error.message);
      return [];
    }
    return data || [];
  },
  async updateStatus(id: string, status: string): Promise<boolean> {
    const { error } = await supabase.from('field_updates').update({ status }).eq('id', id);
    return !error;
  }
};

export const missionService = {

  async getAll(): Promise<Mission[]> {
    const { data, error } = await supabase.from('missions').select('*');
    if (error) {
      console.warn('missionService.getAll error:', error.message);
      return [];
    }
    return data || [];
  },
  async create(mission: Omit<Mission, 'id' | 'created_at' | 'updated_at'>): Promise<Mission | null> {
    const newMission: Mission = {
      ...mission,
      id: `44444444-4444-4444-4444-${String(Date.now()).slice(-12)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('missions').insert(newMission);
    if (error) {
      console.warn('missionService.create warning:', error.message);
    }
    return newMission;
  },
  async updateStatus(id: string, status: string): Promise<boolean> {
    const { error } = await supabase.from('missions').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    return !error;
  }
};


export const resourceService = {
  async getAll(): Promise<Resource[]> {
    const { data, error } = await supabase.from('resources').select('*');
    if (error) {
      console.warn('resourceService.getAll error:', error.message);
      return [];
    }
    return data || [];
  },
  validateAvailability(resource: Resource, quantityRequested: number): { valid: boolean; message?: string } {
    if (quantityRequested <= 0) {
      return { valid: false, message: 'Requested quantity must be greater than zero.' };
    }
    if (resource.quantity_available < quantityRequested) {
      return { 
        valid: false, 
        message: `Insufficient inventory! Requested ${quantityRequested} ${resource.unit}, but only ${resource.quantity_available} ${resource.unit} available.` 
      };
    }
    return { valid: true };
  }
};

export const resourceRequestService = {
  async getAll(): Promise<any[]> {
    const { data, error } = await supabase.from('resource_requests').select('*');
    if (error) {
      console.warn('resourceRequestService.getAll error:', error.message);
      return [];
    }
    return data || [];
  },
  async updateStatus(id: string, status: string, reviewedBy?: string): Promise<boolean> {
    const updates: Record<string, any> = { status, updated_at: new Date().toISOString() };
    if (reviewedBy) updates.reviewed_by = reviewedBy;
    const { error } = await supabase.from('resource_requests').update(updates).eq('id', id);
    return !error;
  }
};


export const messageService = {
  async send(msg: Omit<Message, 'id' | 'created_at'>): Promise<boolean> {
    const { error } = await supabase.from('messages').insert({
      ...msg,
      created_at: new Date().toISOString(),
    });
    if (error) {
      console.warn('messageService.send error:', error.message);
    }
    return !error;
  }
};

export const auditService = {
  async logAction(user_name: string, user_role: string, action: string, target_type: string, target_id: string, details: string): Promise<void> {
    await supabase.from('audit_logs').insert({
      user_name,
      user_role,
      action,
      target_type,
      target_id,
      details,
      timestamp: new Date().toISOString()
    });
  }
};

