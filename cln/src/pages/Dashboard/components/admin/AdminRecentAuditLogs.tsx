import React from 'react'
import { Card, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Skeleton } from '@mui/material'
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff'

// Import Interface ตรงจากไฟล์ AdminDashboard หลัก
import type { SimpleAuditLog } from '../AdminDashboard'

interface AdminRecentAuditLogsProps {
  logs: SimpleAuditLog[]
  isLoading: boolean
}

const getActionStyle = (action: string) => {
  const act = action ? action.toUpperCase() : ''

  // 1. กลุ่มกิจกรรมลบข้อมูล / ความเสี่ยงความปลอดภัย (สีแดง)
  if (act.includes('DELETE') || act.includes('REMOVE') || act.includes('SECURITY')) {
    return { bgcolor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }
  }

  // 2. กลุ่มกิจกรรมสร้างใหม่ / ลงทะเบียน (สีเขียว)
  if (act.includes('CREATE') || act.includes('REGISTER')) {
    return { bgcolor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }
  }

  // 3. กลุ่มกิจกรรมแก้ไขข้อมูล / อัปเดต (สีส้ม)
  if (act.includes('UPDATE') || act.includes('EDIT')) {
    return { bgcolor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }
  }

  // 4. กิจกรรมทั่วไป / การเข้าสู่ระบบ (สีฟ้า)
  return { bgcolor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }
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
                  <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{log.username || 'System'}</TableCell>
                  <TableCell>
                    <Chip
                      label={log.action}
                      size="small"
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        ...getActionStyle(log.action),
                      }}
                    />
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