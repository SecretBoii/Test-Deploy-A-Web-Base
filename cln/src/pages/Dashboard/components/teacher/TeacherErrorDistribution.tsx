import React from 'react'
import { Card, Typography, Box } from '@mui/material'
import type { PythonErrorStat } from '../TeacherDashboard'

interface TeacherErrorDistributionProps {
  errors: PythonErrorStat[]
}

const ERROR_COLOR_MAP: Record<string, string> = {
  IndentationError: '#ef4444',
  SyntaxError: '#f59e0b',
  NameError: '#3b82f6',
  TypeError: '#8b5cf6',
  ValueError: '#ec4899',
  IndexError: '#14b8a6',
  ZeroDivisionError: '#f97316',
}

export const TeacherErrorDistribution: React.FC<TeacherErrorDistributionProps> = ({
  errors,
}) => {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
        ข้อผิดพลาดที่พบบ่อย (Common Python Errors)
      </Typography>
      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2.5 }}>
        สถิติประเภท Error ที่ผู้เรียนรันติดบ่อยที่สุดตามช่วงเวลาที่เลือก
      </Typography>

      {errors.length === 0 ? (
        <Box
          sx={{
            py: 6,
            textAlign: 'center',
            bgcolor: '#f8fafc',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1',
          }}
        >
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            ไม่พบประวัติข้อผิดพลาด (Error) ในช่วงเวลาที่เลือก
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxHeight: 380,
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f8fafc',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#cbd5e1',
              borderRadius: '4px',
              '&:hover': {
                background: '#94a3b8',
              },
            },
          }}
        >
          {errors.map((err) => {
            const barColor = err.color || ERROR_COLOR_MAP[err.errorType] || '#64748b'
            return (
              <Box key={err.errorType}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.6 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {err.errorType}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    {err.count} ครั้ง
                  </Typography>
                </Box>
                <Box sx={{ height: 6, bgcolor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      height: '100%',
                      width: `${Math.min(100, Math.max(0, err.percentage))}%`,
                      bgcolor: barColor,
                      borderRadius: 3,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </Box>
              </Box>
            )
          })}
        </Box>
      )}
    </Card>
  )
}

export default TeacherErrorDistribution
