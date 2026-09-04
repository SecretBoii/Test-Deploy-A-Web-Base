import React from 'react'
import { Card, Typography, Stack, Button } from '@mui/material'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import HistoryIcon from '@mui/icons-material/History'

interface AdminQuickActionsProps {
  onNavigate: (path: string) => void
}

export const AdminQuickActions: React.FC<AdminQuickActionsProps> = ({ onNavigate }) => {
  return (
    <Card
      sx={{
        p: 2.5,
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        bgcolor: '#f8fafc',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 1.5 }}>
        เมนูด่วนสำหรับผู้ดูแลระบบ (Quick Actions)
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button
          variant="contained"
          startIcon={<ManageAccountsIcon />}
          onClick={() => onNavigate('/users')}
          sx={{ borderRadius: '10px', textTransform: 'none', px: 2.5, py: 1, bgcolor: '#2563eb' }}
        >
          จัดการผู้ใช้งานระบบ
        </Button>
        <Button
          variant="outlined"
          startIcon={<HistoryIcon />}
          onClick={() => onNavigate('/audit-logs')}
          sx={{ borderRadius: '10px', textTransform: 'none', px: 2.5, py: 1, borderColor: '#cbd5e1', color: '#334155' }}
        >
          ตรวจสอบ Audit Logs
        </Button>
      </Stack>
    </Card>
  )
}