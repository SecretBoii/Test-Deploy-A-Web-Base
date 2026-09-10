import { apiClient } from './client';

export interface AuditLogItem {
  id: number;
  userId?: number;
  username?: string;
  action: string;
  entity: string;
  entityId?: number;
  details?: any;
  createdAt: string;
}

export interface AuditLogStats {
  total: number;
  createOrAuthCount: number;
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