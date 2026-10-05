import { apiClient } from './client';

export interface AuditLogItem {
  id: number;
  userId?: number;
  username?: string;
  roleName?: string;
  fullName?: string;
  action: string;
  entity: string;
  entityId?: number;
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface AuditLogStats {
  total: number;
  authCount?: number;
  createCount?: number;
  createOrAuthCount?: number;
  updateCount: number;
  deleteOrSecurityCount: number;
}

export interface AuditLogResponse {
  data: AuditLogItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats?: AuditLogStats;
}

export interface GetAuditLogParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export const fetchAuditLogs = async (params: GetAuditLogParams): Promise<AuditLogResponse> => {
  const response = await apiClient.get('/admin/audit-logs', { params });
  return response.data;
};

/**
 * โครงสร้างข้อมูลสีของ Action Badge
 */
export interface ActionColorConfig {
  chipBg: string;
  chipColor: string;
}

/**
 * ฟังก์ชันกลางสำหรับกำหนดสีของ Action Badge ในทุกคอมโพเนนต์ (Single Source of Truth)
 * ใช้ชุดสี Solid Color พร้อมตัวหนังสือสีขาว #ffffff สอดคล้องกับปุ่มตัวกรองด่วน
 */
export const getActionStyle = (action: string): ActionColorConfig => {
  const upper = (action || '').toUpperCase();
  if (upper.includes('DELETE') || upper.includes('REMOVE') || upper.includes('SECURITY')) {
    return { chipBg: '#dc2626', chipColor: '#ffffff' };
  }
  if (upper.includes('UPDATE') || upper.includes('MODIFY')) {
    return { chipBg: '#b45309', chipColor: '#ffffff' };
  }
  if (upper.includes('CREATE') || upper.includes('ADD') || upper.includes('REGISTER')) {
    return { chipBg: '#047857', chipColor: '#ffffff' };
  }
  if (upper.includes('RUN')) {
    return { chipBg: '#4338ca', chipColor: '#ffffff' };
  }
  if (upper.includes('SUBMIT')) {
    return { chipBg: '#7c3aed', chipColor: '#ffffff' };
  }
  if (upper.includes('LOGOUT')) {
    return { chipBg: '#64748b', chipColor: '#ffffff' };
  }
  // LOGIN และกรณีทั่วไป
  return { chipBg: '#1d4ed8', chipColor: '#ffffff' };
};