import React from 'react'
import { Box, Card, Typography, Skeleton } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import CodeIcon from '@mui/icons-material/Code'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import type { DashboardStats } from '../AdminDashboard'
import type { TimeRangeType } from './DashboardTimeFilter'

interface AdminStatCardsProps {
  stats: DashboardStats | null
  isLoading: boolean
  timeRange?: TimeRangeType
}

export const AdminStatCards: React.FC<AdminStatCardsProps> = ({ stats, isLoading, timeRange = 'daily' }) => {
  const submissionTitle = timeRange === 'weekly' 
    ? 'ทดลองรันโค้ดสัปดาห์นี้'
    : timeRange === 'monthly'
    ? 'ทดลองรันโค้ดเดือนนี้'
    : timeRange === 'yearly'
    ? 'ทดลองรันโค้ดปีนี้'
    : 'ทดลองรันโค้ดวันนี้'

  const cardItems = [
    {
      title: 'ผู้ใช้งานทั้งหมด',
      value: stats?.totalUsers ?? 0,
      unit: 'คน',
      icon: <PeopleIcon sx={{ color: '#2563eb' }} />,
      bgColor: '#eff6ff',
    },
    {
      title: 'แบบฝึกหัดทั้งหมด',
      value: stats?.totalExercises ?? 0,
      unit: 'ข้อ',
      icon: <MenuBookIcon sx={{ color: '#059669' }} />,
      bgColor: '#ecfdf5',
    },
    {
      title: submissionTitle,
      value: stats?.totalSubmissionsToday ?? 0,
      unit: 'ครั้ง',
      icon: <CodeIcon sx={{ color: '#d97706' }} />,
      bgColor: '#fffbeb',
    },
    {
      title: 'อัตราตรวจผ่านสำเร็จ',
      value: `${stats?.passRatePercentage ?? 0}%`,
      unit: '',
      icon: <CheckCircleIcon sx={{ color: '#7c3aed' }} />,
      bgColor: '#f5f3ff',
    },
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: 2.5,
      }}
    >
      {cardItems.map((item, index) => (
        <Card
          key={index}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              bgcolor: item.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {item.icon}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}>
              {item.title}
            </Typography>
            {isLoading ? (
              <Skeleton width={80} height={32} animation="wave" />
            ) : (
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
                {item.value} <Typography component="span" variant="caption" sx={{ color: '#94a3b8' }}>{item.unit}</Typography>
              </Typography>
            )}
          </Box>
        </Card>
      ))}
    </Box>
  )
}