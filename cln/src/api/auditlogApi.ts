import { apiClient } from './client';

export interface AuditLogItem {
  id: number;
  userId?: number;
  username?: string;
  action: string;
  entity: string;
  entityId?: number;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export type AuditLogitem = AuditLogItem;

export interface AuditLogResponse {
  data: AuditLogItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

export const fetchAuditlogs = fetchAuditLogs;
