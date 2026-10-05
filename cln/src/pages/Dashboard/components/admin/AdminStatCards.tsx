import React from 'react'
import { Box, Card, Typography, Skeleton } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import CodeIcon from '@mui/icons-material/Code'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import type { DashboardStats } from '../AdminDashboard'
import { getTodayStr, formatDisplayDate } from '../../../../utils/dateUtils'

interface AdminStatCardsProps {
  stats: DashboardStats | null
  isLoading: boolean
  isOverviewLoading?: boolean
  selectedDate?: string
}

export const AdminStatCards: React.FC<AdminStatCardsProps> = ({
  stats,
  isLoading,
  isOverviewLoading,
  selectedDate,
}) => {
  const todayStr = getTodayStr()
  const isToday = !selectedDate || selectedDate === todayStr

  const submissionTitle = isToday
    ? 'ทดลองรันโค้ดวันนี้'
    : `ทดลองรันโค้ด (${formatDisplayDate(selectedDate)})`

  const cardItems = [
    {
      title: 'ผู้ใช้งานทั้งหมด',
      value: stats?.totalUsers ?? 0,
      unit: 'คน',
      icon: <PeopleIcon sx={{ color: '#4f46e5' }} />,
      bgColor: '#eef2ff',
      isOverview: true,
    },
    {
      title: 'แบบฝึกหัดทั้งหมด',
      value: stats?.totalExercises ?? 0,
      unit: 'ข้อ',
      icon: <MenuBookIcon sx={{ color: '#059669' }} />,
      bgColor: '#ecfdf5',
      isOverview: true,
    },
    {
      title: submissionTitle,
      value: stats?.totalSubmissions ?? 0,
      unit: 'ครั้ง',
      icon: <CodeIcon sx={{ color: '#d97706' }} />,
      bgColor: '#fffbeb',
      isOverview: false,
    },
    {
      title: 'อัตราตรวจผ่านสำเร็จ',
      value: `${stats?.passRatePercentage ?? 0}%`,
      unit: '',
      icon: <CheckCircleIcon sx={{ color: '#7c3aed' }} />,
      bgColor: '#f5f3ff',
      isOverview: false,
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
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px 0 rgba(79, 70, 229, 0.06)',
              borderColor: '#ddd6fe',
            },
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
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
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.85rem', mb: 0.5 }}>
              {item.title}
            </Typography>
            {(item.isOverview ? (isOverviewLoading ?? isLoading) : isLoading) ? (
              <Skeleton width={80} height={32} animation="wave" />
            ) : (
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e1b4b', letterSpacing: '-0.02em' }}>
                {item.value} <Typography component="span" variant="caption" sx={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.8rem' }}>{item.unit}</Typography>
              </Typography>
            )}
          </Box>
        </Card>
      ))}
    </Box>
  )
}