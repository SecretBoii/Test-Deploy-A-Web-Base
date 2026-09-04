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

/**
 * Subcomponent ตารางแสดงรายการ Log พร้อม Pagination
 */
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
    let color: 'success' | 'warning' | 'error' | 'info' | 'default' = 'default';
    if (action.includes('CREATE') || action.includes('LOGIN')) color = 'success';
    else if (action.includes('UPDATE')) color = 'warning';
    else if (action.includes('DELETE')) color = 'error';
    return <Chip label={action} color={color} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />;
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ID / วัน-เวลา</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>ผู้ใช้งาน (Username)</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Target (Entity)</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>IP Address</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>รายละเอียด</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                <CircularProgress size={30} />
              </TableCell>
            </TableRow>
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'gray' }}>
                ไม่พบข้อมูล Audit Log
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>#{log.id}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(log.createdAt).toLocaleString('th-TH')}
                  </Typography>
                </TableCell>
                <TableCell>{log.username || 'System'}</TableCell>
                <TableCell>{getActionChip(log.action)}</TableCell>
                <TableCell>
                  {log.entity} {log.entityId ? `(#${log.entityId})` : ''}
                </TableCell>
                <TableCell>{log.ipAddress || '-'}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => onSelectLog(log)}>
                    <Eye size={18} />
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
      />
    </TableContainer>
  );
};