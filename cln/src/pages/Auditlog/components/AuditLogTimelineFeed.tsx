import React, { useState } from 'react';
import {
  Box,
  Paper,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Stack,
  IconButton,
  CircularProgress,
  Collapse,
  TablePagination,
  Button,
} from '@mui/material';
import {
  Clock,
  Globe,
  ChevronDown,
  ChevronUp,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Terminal,
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
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedLogId((prev) => (prev === id ? null : id));
  };

  const getActionConfig = (action: string) => {
    if (action.includes('DELETE') || action.includes('REMOVE') || action.includes('SECURITY')) {
      return {
        color: 'error' as const,
        borderColor: '#ef4444',
        bgColor: '#fef2f2',
        chipBg: '#fef2f2',
        chipColor: '#dc2626',
        icon: <XCircle size={18} color="#ef4444" />,
      };
    }
    if (action.includes('UPDATE') || action.includes('MODIFY')) {
      return {
        color: 'warning' as const,
        borderColor: '#f59e0b',
        bgColor: '#fffbeb',
        chipBg: '#fffbeb',
        chipColor: '#d97706',
        icon: <AlertTriangle size={18} color="#f59e0b" />,
      };
    }
    if (action.includes('CREATE') || action.includes('LOGIN') || action.includes('ADD')) {
      return {
        color: 'success' as const,
        borderColor: '#10b981',
        bgColor: '#ecfdf5',
        chipBg: '#ecfdf5',
        chipColor: '#047857',
        icon: <CheckCircle2 size={18} color="#10b981" />,
      };
    }
    return {
      color: 'info' as const,
      borderColor: '#3b82f6',
      bgColor: '#eff6ff',
      chipBg: '#eff6ff',
      chipColor: '#1d4ed8',
      icon: <Info size={18} color="#3b82f6" />,
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
      <Stack spacing={2}>
        {logs.map((log) => {
          const config = getActionConfig(log.action);
          const isExpanded = expandedLogId === log.id;
          const userInitial = (log.username || 'S')[0].toUpperCase();

          return (
            <Card
              key={log.id}
              elevation={0}
              sx={{
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                borderLeft: `5px solid ${config.borderColor}`,
                bgcolor: '#ffffff',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
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
                        bgcolor: config.bgColor,
                        color: config.borderColor,
                        fontWeight: 700,
                        width: 46,
                        height: 46,
                        borderRadius: '12px',
                        border: `1px solid ${config.borderColor}33`,
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

                      {/* Meta Information: Timestamp, IP Address, ID */}
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

                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: '#64748b' }}>
                          <Globe size={14} />
                          <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            {log.ipAddress || 'Internal IP'}
                          </Typography>
                        </Stack>

                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                          ID: #{log.id}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  {/* Right Section: Actions (Expand Payload / Open Modal) */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: 'center',
                      alignSelf: { xs: 'flex-end', sm: 'center' },
                    }}
                  >
                    {log.details && (
                      <Button
                        size="small"
                        variant={isExpanded ? 'contained' : 'outlined'}
                        color="inherit"
                        onClick={() => toggleExpand(log.id)}
                        startIcon={isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        sx={{
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          borderColor: '#cbd5e1',
                          color: isExpanded ? '#ffffff' : '#475569',
                          bgcolor: isExpanded ? '#1e293b' : 'transparent',
                          '&:hover': {
                            bgcolor: isExpanded ? '#0f172a' : '#f1f5f9',
                          },
                        }}
                      >
                        {isExpanded ? 'ซ่อน Details' : 'ดู Payload'}
                      </Button>
                    )}

                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onSelectLog(log)}
                      title="เปิดดูรายละเอียดใน Modal"
                      sx={{
                        bgcolor: '#eff6ff',
                        borderRadius: '10px',
                        '&:hover': { bgcolor: '#dbeafe' },
                      }}
                    >
                      <Eye size={18} color="#2563eb" />
                    </IconButton>
                  </Stack>
                </Stack>

                {/* Collapsible JSON Payload Detail Section */}
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f1f5f9' }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                      <Terminal size={16} color="#64748b" />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        JSON Payload Details & Context
                      </Typography>
                    </Stack>
                    <Box
                      component="pre"
                      sx={{
                        m: 0,
                        p: 2,
                        bgcolor: '#0f172a',
                        color: '#38bdf8',
                        borderRadius: '12px',
                        fontSize: '0.82rem',
                        fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
                        overflowX: 'auto',
                        border: '1px solid #1e293b',
                        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)',
                      }}
                    >
                      {typeof log.details === 'object'
                        ? JSON.stringify(log.details, null, 2)
                        : log.details || 'ไม่มีข้อมูลรายละเอียดเพิ่มเติม'}
                    </Box>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
      )}

      {/* Pagination Container */}
      <Paper
        elevation={0}
        sx={{
          mt: 2.5,
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
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
      </Paper>
    </Box>
  );
};
