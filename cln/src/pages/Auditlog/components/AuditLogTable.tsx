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
  IconButton,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import { Eye } from 'lucide-react';
import { type AuditLogItem } from '../../../api/auditlogApi';

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
  const getActionChip = (action: string) => {
    if (action.includes('DELETE') || action.includes('REMOVE')) {
      return (
        <Chip
          label={action}
          size="small"
          sx={{ fontSize: '0.75rem', fontWeight: 600, bgcolor: '#fef2f2', color: '#dc2626', borderRadius: '6px' }}
        />
      );
    }
    if (action.includes('UPDATE') || action.includes('MODIFY')) {
      return (
        <Chip
          label={action}
          size="small"
          sx={{ fontSize: '0.75rem', fontWeight: 600, bgcolor: '#fffbeb', color: '#d97706', borderRadius: '6px' }}
        />
      );
    }
    if (action.includes('CREATE') || action.includes('LOGIN')) {
      return (
        <Chip
          label={action}
          size="small"
          sx={{ fontSize: '0.75rem', fontWeight: 600, bgcolor: '#ecfdf5', color: '#047857', borderRadius: '6px' }}
        />
      );
    }
    return (
      <Chip
        label={action}
        size="small"
        sx={{ fontSize: '0.75rem', fontWeight: 600, bgcolor: '#eff6ff', color: '#1d4ed8', borderRadius: '6px' }}
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
            <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>ID / วัน-เวลา</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>ผู้ใช้งาน (Username)</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Action</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Target (Entity)</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: '#64748b' }}>รายละเอียด</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                <CircularProgress size={30} sx={{ color: '#2563eb' }} />
              </TableCell>
            </TableRow>
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94a3b8' }}>
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
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    {new Date(log.createdAt).toLocaleString('th-TH')}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{log.username || 'System'}</TableCell>
                <TableCell>{getActionChip(log.action)}</TableCell>
                <TableCell sx={{ color: '#334155' }}>
                  {log.entity} {log.entityId ? `(#${log.entityId})` : ''}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => onSelectLog(log)}
                    sx={{ bgcolor: '#eff6ff', borderRadius: '8px', '&:hover': { bgcolor: '#dbeafe' } }}
                  >
                    <Eye size={18} color="#2563eb" />
                  </IconButton>
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