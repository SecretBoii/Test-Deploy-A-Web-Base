import React from 'react'
import { Card, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Skeleton } from '@mui/material'
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff'

// Import Interface ตรงจากไฟล์ AdminDashboard หลัก
import type { SimpleAuditLog } from '../AdminDashboard'
import { getActionStyle } from '../../../../api/auditlogApi'

interface AdminRecentAuditLogsProps {
  logs: SimpleAuditLog[]
  isLoading: boolean
}

export const AdminRecentAuditLogs: React.FC<AdminRecentAuditLogsProps> = ({ logs, isLoading }) => {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <HistoryToggleOffIcon sx={{ color: '#4f46e5' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e1b4b' }}>
          ประวัติกิจกรรมล่าสุด (Recent Audit Logs)
        </Typography>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#faf5ff' }}>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', py: 1, borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>ผู้ใช้งาน</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', py: 1 }}>การกระทำ</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', py: 1, borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>เวลา</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={120} /></TableCell>
                  <TableCell><Skeleton width={70} /></TableCell>
                </TableRow>
              ))
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ color: '#94a3b8', py: 3 }}>
                  ยังไม่มีข้อมูลประวัติกิจกรรม
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {log.username || 'System'}
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
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const style = getActionStyle(log.action);
                      return (
                        <Chip
                          label={log.action}
                          size="small"
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            borderRadius: '8px',
                            bgcolor: style.chipBg,
                            color: style.chipColor,
                          }}
                        />
                      );
                    })()}
                  </TableCell>
                  <TableCell sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
                      : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}