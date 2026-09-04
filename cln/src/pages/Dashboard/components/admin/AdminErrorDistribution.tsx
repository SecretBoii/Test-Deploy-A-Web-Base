import React from 'react'
import { Card, Typography, Box, LinearProgress, Skeleton } from '@mui/material'
import BugReportIcon from '@mui/icons-material/BugReport'

// Import Interface ตรงจากไฟล์ AdminDashboard หลัก
import type { PythonErrorStat } from '../AdminDashboard'

interface AdminErrorDistributionProps {
  errors: PythonErrorStat[]
  isLoading: boolean
}

export const AdminErrorDistribution: React.FC<AdminErrorDistributionProps> = ({ errors, isLoading }) => {
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <BugReportIcon sx={{ color: '#ef4444' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>
          ข้อผิดพลาด Python ที่พบบ่อย (Top Errors)
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={28} sx={{ borderRadius: '6px' }} />
          ))}
        </Box>
      ) : errors.length === 0 ? (
        <Typography variant="body2" sx={{ color: '#94a3b8', py: 4, textAlign: 'center' }}>
          ไม่พบข้อมูลข้อผิดพลาดในขณะนี้
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {errors.map((item, idx) => (
            <Box key={idx}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                  {item.errorType}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {item.count} ครั้ง ({item.percentage.toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={item.percentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#f1f5f9',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: idx === 0 ? '#ef4444' : idx === 1 ? '#f97316' : '#eab308',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Card>
  )
}