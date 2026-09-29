import React from 'react'
import { Card, Typography, Box, Skeleton } from '@mui/material'
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined'
import type { PythonErrorStat } from '../TeacherDashboard'

interface TeacherErrorDistributionProps {
  errors: PythonErrorStat[]
  isLoading: boolean
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
  isLoading,
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <BugReportOutlinedIcon sx={{ color: '#dc2626', fontSize: 20 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
          ข้อผิดพลาดที่พบบ่อย (Common Python Errors)
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2.5 }}>
        สถิติประเภท Error ที่ผู้เรียนรันติดบ่อยที่สุดตามช่วงเวลาที่เลือก
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[...Array(4)].map((_, i) => (
            <Box key={i}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Skeleton width="45%" height={20} />
                <Skeleton width="25%" height={20} />
              </Box>
              <Skeleton width="100%" height={6} sx={{ borderRadius: 3 }} />
            </Box>
          ))}
        </Box>
      ) : errors.length === 0 ? (
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
