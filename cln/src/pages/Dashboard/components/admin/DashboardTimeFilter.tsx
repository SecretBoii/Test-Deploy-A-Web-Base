import React, { useRef } from 'react'
import { Box, Typography } from '@mui/material'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'

export interface DashboardTimeFilterProps {
  value: string // รูปแบบ YYYY-MM-DD
  onChange: (date: string) => void
}

const formatToDDMMYYYY = (isoDate: string): string => {
  if (!isoDate) return 'dd/mm/yyyy'
  const parts = isoDate.split('-')
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }
  return isoDate
}

export const DashboardTimeFilter: React.FC<DashboardTimeFilterProps> = ({
  value,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // คำนวณวันปัจจุบันรูปแบบ YYYY-MM-DD ตามเวลาท้องถิ่น
  const getTodayStr = () => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

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
        borderRadius: '12px',
        px: 1.6,
        py: 0.65,
        minWidth: 155,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        '&:hover': {
          borderColor: '#cbd5e1',
          bgcolor: '#f8fafc',
        },
        '&:focus-within': {
          borderColor: '#3b82f6',
          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
        },
      }}
    >
      {/* ไอคอนปฏิทินฝั่งซ้าย */}
      <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: '#64748b' }} />

      {/* ข้อความวันที่ลำดับ วัน/เดือน/ปี (dd/mm/yyyy) */}
      <Typography
        sx={{
          fontSize: '0.85rem',
          fontWeight: value ? 600 : 500,
          color: value ? '#1e293b' : '#94a3b8',
          letterSpacing: '0.02em',
        }}
      >
        {formatToDDMMYYYY(value)}
      </Typography>

      {/* ไอคอนปฏิทินฝั่งขวา */}
      <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: '#64748b', opacity: 0.8 }} />

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
