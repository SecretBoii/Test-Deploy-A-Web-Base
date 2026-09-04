import React from 'react'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'

export type TimeRangeType = 'daily' | 'weekly' | 'monthly' | 'yearly'

interface DashboardTimeFilterProps {
  value: TimeRangeType
  onChange: (value: TimeRangeType) => void
}

/**
 * คอมโพเนนต์ตัวกรองช่วงเวลา (รายวัน, สัปดาห์, เดือน, ปี) ประจำหน้า AdminDashboard
 */
export const DashboardTimeFilter: React.FC<DashboardTimeFilterProps> = ({ value, onChange }) => {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, val) => val && onChange(val)}
      size="small"
      sx={{
        bgcolor: '#f1f5f9',
        p: '3px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        '& .MuiToggleButton-root': {
          border: 'none',
          borderRadius: '9px',
          px: 2,
          py: 0.6,
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#64748b',
          textTransform: 'none',
          transition: 'all 0.15s ease-in-out',
          '&.Mui-selected': {
            bgcolor: '#ffffff',
            color: '#2563eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
            fontWeight: 700,
            '&:hover': {
              bgcolor: '#ffffff',
            },
          },
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.5)',
          },
        },
      }}
    >
      <ToggleButton value="daily">📅 รายวัน</ToggleButton>
      <ToggleButton value="weekly">📆 สัปดาห์</ToggleButton>
      <ToggleButton value="monthly">📊 เดือน</ToggleButton>
      <ToggleButton value="yearly">🗓️ ปี</ToggleButton>
    </ToggleButtonGroup>
  )
}

export default DashboardTimeFilter
