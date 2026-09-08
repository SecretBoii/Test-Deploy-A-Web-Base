import React from 'react'
import { Box, Stack, Button } from '@mui/material'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import HistoryIcon from '@mui/icons-material/History'
import AssessmentIcon from '@mui/icons-material/Assessment'

interface AdminQuickActionsProps {
  onNavigate: (path: string) => void
}

export const AdminQuickActions: React.FC<AdminQuickActionsProps> = ({ onNavigate }) => {
  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button
          variant="outlined"
          startIcon={<ManageAccountsIcon />}
          onClick={() => onNavigate('/users')}
          sx={{ borderRadius: '10px', textTransform: 'none', px: 2.5, py: 1, borderColor: '#cbd5e1', color: '#334155', bgcolor: '#ffffff' }}
        >
          จัดการผู้ใช้งานระบบ
        </Button>
        <Button
          variant="outlined"
          startIcon={<AssessmentIcon />}
          onClick={() => onNavigate('/reports')}
          sx={{ borderRadius: '10px', textTransform: 'none', px: 2.5, py: 1, borderColor: '#cbd5e1', color: '#334155', bgcolor: '#ffffff' }}
        >
          ดูรายงานสถิติระบบ
        </Button>
        <Button
          variant="outlined"
          startIcon={<HistoryIcon />}
          onClick={() => onNavigate('/audit-logs')}
          sx={{ borderRadius: '10px', textTransform: 'none', px: 2.5, py: 1, borderColor: '#cbd5e1', color: '#334155', bgcolor: '#ffffff' }}
        >
          ตรวจสอบ Audit Logs
        </Button>
      </Stack>
    </Box>
  )
}