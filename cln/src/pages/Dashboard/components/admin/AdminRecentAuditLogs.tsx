import React from 'react'
import { Card, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Skeleton } from '@mui/material'
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff'

// Import Interface ตรงจากไฟล์ AdminDashboard หลัก
import type { SimpleAuditLog } from '../AdminDashboard'

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
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <HistoryToggleOffIcon sx={{ color: '#2563eb' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>
          ประวัติกิจกรรมล่าสุด (Recent Audit Logs)
        </Typography>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>ผู้ใช้งาน</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>การกระทำ</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>เวลา</TableCell>
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
                  <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{log.username}</TableCell>
                  <TableCell>
                    <Chip
                      label={log.action}
                      size="small"
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        bgcolor: log.action.includes('CREATE') ? '#ecfdf5' : '#eff6ff',
                        color: log.action.includes('CREATE') ? '#047857' : '#1d4ed8',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                    {new Date(log.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
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