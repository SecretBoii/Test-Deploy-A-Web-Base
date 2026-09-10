import React from 'react';
import {
  Box,
  Paper,
  Card,
  Typography,
  Chip,
  Avatar,
  Stack,
  Button,
  CircularProgress,
  TablePagination,
  Divider,
} from '@mui/material';
import {
  Clock,
  Eye,
  Info,
} from 'lucide-react';
import { type AuditLogItem } from '../../../api/auditlogApi';

interface AuditLogTimelineFeedProps {
  logs: AuditLogItem[];
  loading: boolean;
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newLimit: number) => void;
  onSelectLog: (log: AuditLogItem) => void;
}

export const AuditLogTimelineFeed: React.FC<AuditLogTimelineFeedProps> = ({
  logs,
  loading,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSelectLog,
}) => {
  const getActionConfig = (action: string) => {
    if (action.includes('DELETE') || action.includes('REMOVE') || action.includes('SECURITY')) {
      return {
        chipBg: '#fef2f2',
        chipColor: '#dc2626',
      };
    }
    if (action.includes('UPDATE') || action.includes('MODIFY')) {
      return {
        chipBg: '#fffbeb',
        chipColor: '#b45309',
      };
    }
    if (action.includes('CREATE') || action.includes('ADD')) {
      return {
        chipBg: '#ecfdf5',
        chipColor: '#047857',
      };
    }
    if (action.includes('RUN')) {
      return {
        chipBg: '#eef2ff',
        chipColor: '#4338ca',
      };
    }
    if (action.includes('SUBMIT')) {
      return {
        chipBg: '#f5f3ff',
        chipColor: '#7c3aed',
      };
    }
    if (action.includes('LOGOUT')) {
      return {
        chipBg: '#f1f5f9',
        chipColor: '#64748b',
      };
    }
    return {
      chipBg: '#eff6ff',
      chipColor: '#1d4ed8',
    };
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <CircularProgress size={36} sx={{ color: '#2563eb' }} />
        <Typography variant="body2" sx={{ mt: 2, color: '#64748b', fontWeight: 500 }}>
          กำลังโหลดประวัติการใช้งานระบบ...
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {logs.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          <Info size={44} color="#94a3b8" />
          <Typography variant="h6" sx={{ mt: 1.5, fontWeight: 700, color: '#0f172a' }}>
            ไม่พบประวัติการใช้งาน (Audit Logs)
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            ลองปรับเงื่อนไขการค้นหาหรือช่วงเวลาในตัวกรองข้อมูลด้านบน
          </Typography>
        </Paper>
      ) : (
      <Card
        elevation={0}
        sx={{
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
      >
        <Stack divider={<Divider sx={{ borderColor: '#f1f5f9' }} />}>
          {logs.map((log) => {
            const config = getActionConfig(log.action);
            const userInitial = (log.username || 'S')[0].toUpperCase();

            return (
              <Box
                key={log.id}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  transition: 'background-color 0.15s ease-in-out',
                  '&:hover': { bgcolor: '#f8fafc' },
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                  }}
                  spacing={2}
                >
                  {/* Left Section: User Avatar & Activity Title */}
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: '#f8fafc',
                        color: '#475569',
                        fontWeight: 700,
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      {userInitial}
                    </Avatar>
                    <Box>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                          {log.username || 'System Administrator'}
                        </Typography>
                        <Chip
                          label={log.action}
                          size="small"
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            bgcolor: config.chipBg,
                            color: config.chipColor,
                            height: 24,
                            borderRadius: '6px',
                          }}
                        />
                        <Chip
                          label={`${log.entity} ${log.entityId ? `(#${log.entityId})` : ''}`}
                          variant="outlined"
                          size="small"
                          sx={{
                            fontSize: '0.75rem',
                            height: 24,
                            bgcolor: '#f8fafc',
                            borderColor: '#cbd5e1',
                            borderRadius: '6px',
                            color: '#475569',
                          }}
                        />
                      </Stack>

                      {/* Meta Information: Timestamp, ID */}
                      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mt: 0.8, flexWrap: 'wrap' }}>
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: '#64748b' }}>
                          <Clock size={14} />
                          <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            {new Date(log.createdAt).toLocaleString('th-TH', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </Typography>
                        </Stack>

                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                          ID: #{log.id}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  {/* Right Section: View Details Modal Action */}
                  <Button
                    size="small"
                    startIcon={<Eye size={16} />}
                    onClick={() => onSelectLog(log)}
                    sx={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#2563eb',
                      bgcolor: '#eff6ff',
                      borderRadius: '8px',
                      px: 1.75,
                      py: 0.6,
                      textTransform: 'none',
                      whiteSpace: 'nowrap',
                      alignSelf: { xs: 'flex-start', sm: 'center' },
                      '&:hover': { bgcolor: '#dbeafe' },
                    }}
                  >
                    ดูรายละเอียด
                  </Button>
                </Stack>
              </Box>
            );
          })}
        </Stack>

        {/* ส่วนท้าย Card: Pagination รวมอยู่ใน Card เดียวกัน */}
        <Box sx={{ borderTop: '1px solid #f1f5f9', px: 1, py: 0.5, bgcolor: '#ffffff' }}>
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => onPageChange(newPage)}
            onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
            labelRowsPerPage="จำนวนรายการต่อหน้า:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count !== -1 ? count : `มากกว่า ${to}`}`}
          />
        </Box>
      </Card>
      )}
    </Box>
  );
};
