import React, { useRef } from 'react'
import { Box, Typography } from '@mui/material'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import { getTodayStr, formatDisplayDate } from '../../../../utils/dateUtils'

export interface DashboardTimeFilterProps {
  value: string // รูปแบบ YYYY-MM-DD
  onChange: (date: string) => void
}

export const DashboardTimeFilter: React.FC<DashboardTimeFilterProps> = ({
  value,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const todayStr = getTodayStr()

  const handleClick = () => {
    if (inputRef.current) {
      try {
        inputRef.current.showPicker()
      } catch {
        inputRef.current.focus()
      }
    }
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.2,
        bgcolor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        px: 1.8,
        py: 0.75,
        minWidth: 160,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        '&:hover': {
          borderColor: '#c7d2fe',
          bgcolor: '#faf5ff',
        },
        '&:focus-within': {
          borderColor: '#4f46e5',
          boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.12)',
        },
      }}
    >
      {/* ไอคอนปฏิทินฝั่งซ้ายโทนสีม่วง Indigo ตามธีมระบบ */}
      <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: '#4f46e5' }} />

      {/* ข้อความวันที่ลำดับ วัน/เดือน/ปี (dd/mm/yyyy) */}
      <Typography
        sx={{
          fontSize: '0.85rem',
          fontWeight: value ? 600 : 500,
          color: value ? '#1e1b4b' : '#94a3b8',
          letterSpacing: '0.02em',
        }}
      >
        {formatDisplayDate(value, 'dd/mm/yyyy')}
      </Typography>

      {/* Input type date ซ่อนไว้เพื่อเรียกใช้ Native Date Picker */}
      <input
        ref={inputRef}
        type="date"
        value={value}
        max={todayStr}
        onChange={(e) => {
          if (e.target.value) {
            onChange(e.target.value)
          }
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
    </Box>
  )
}

export default DashboardTimeFilter
