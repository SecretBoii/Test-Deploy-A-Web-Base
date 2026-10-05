import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Chip,
  Button,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import { type AuditLogItem, getActionStyle } from '../../../api/auditlogApi';

interface AuditLogTableProps {
  logs: AuditLogItem[];
  loading: boolean;
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  onSelectLog: (log: AuditLogItem) => void;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({
  logs,
  loading,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSelectLog,
}) => {
  // กำหนดสีของ Action Badge ในตารางให้ตรงกับชุดสีกลาง Solid Color (Single Source of Truth)
  const getActionChip = (action: string) => {
    const config = getActionStyle(action);
    return (
      <Chip
        label={action}
        size="small"
        sx={{ fontSize: '0.75rem', fontWeight: 700, bgcolor: config.chipBg, color: config.chipColor, borderRadius: '6px' }}
      />
    );
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ backgroundColor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ width: '22%', fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>
              ID / วัน-เวลา
            </TableCell>
            <TableCell sx={{ width: '26%', fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>
              ผู้ใช้งาน (Username)
            </TableCell>
            <TableCell sx={{ width: '18%', fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>
              Action
            </TableCell>
            <TableCell sx={{ width: '20%', fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>
              Target (Entity)
            </TableCell>
            <TableCell align="center" sx={{ width: '14%', fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>
              รายละเอียด
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                <CircularProgress size={30} sx={{ color: '#2563eb' }} />
              </TableCell>
            </TableRow>
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                ไม่พบข้อมูล Audit Log
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    #{log.id}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, display: 'block', mt: 0.25 }}>
                    {new Date(log.createdAt).toLocaleString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {log.fullName || log.username || 'System'}
                    {log.roleName && (
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 500,
                          color: '#64748b',
                          fontSize: '0.8rem',
                          ml: 0.5,
                        }}
                      >
                        ({log.roleName})
                      </Typography>
                    )}
                  </Typography>
                </TableCell>
                <TableCell>{getActionChip(log.action)}</TableCell>
                <TableCell>
                  <Chip
                    label={`${log.entity}${log.entityId ? ` (#${log.entityId})` : ''}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: '0.75rem',
                      height: 24,
                      fontWeight: 600,
                      bgcolor: '#f8fafc',
                      borderColor: '#cbd5e1',
                      borderRadius: '6px',
                      color: '#475569',
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onSelectLog(log)}
                    sx={{
                      borderRadius: '8px',
                      bgcolor: '#0f172a',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '12px',
                      textTransform: 'none',
                      boxShadow: 'none',
                      py: 0.5,
                      px: 1.5,
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        bgcolor: '#1e293b',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    ดูประวัติการทำ
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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
    </TableContainer>
  );
};