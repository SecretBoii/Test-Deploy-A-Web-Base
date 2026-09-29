import React from 'react'
import { Box, Card, Typography, Skeleton } from '@mui/material'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import type { TeacherStats } from '../TeacherDashboard'

interface TeacherStatCardsProps {
  stats: TeacherStats | null
  isLoading: boolean
  isOverviewLoading?: boolean
}

export const TeacherStatCards: React.FC<TeacherStatCardsProps> = ({
  stats,
  isLoading,
  isOverviewLoading,
}) => {
  const cardItems = [
    {
      title: 'ชุดบทเรียน',
      value: stats?.totalSessions ?? 0,
      unit: 'ชุด',
      icon: <FolderOutlinedIcon sx={{ fontSize: 20, color: '#4f46e5' }} />,
      bgColor: '#eef2ff',
      isOverview: true,
    },
    {
      title: 'โจทย์ทั้งหมด',
      value: stats?.totalExercises ?? 0,
      unit: 'ข้อ',
      icon: <MenuBookOutlinedIcon sx={{ fontSize: 20, color: '#059669' }} />,
      bgColor: '#ecfdf5',
      isOverview: true,
    },
    {
      title: 'ผู้เรียนที่เข้าทำ',
      value: stats?.activeStudents ?? 0,
      unit: 'คน',
      icon: <PeopleAltOutlinedIcon sx={{ fontSize: 20, color: '#0284c7' }} />,
      bgColor: '#f0f9ff',
      isOverview: false,
    },
    {
      title: 'ยอดรันโค้ด',
      value: stats?.totalRuns ?? 0,
      unit: 'ครั้ง',
      icon: <CodeOutlinedIcon sx={{ fontSize: 20, color: '#d97706' }} />,
      bgColor: '#fffbeb',
      isOverview: false,
    },
    {
      title: 'อัตราตรวจผ่าน',
      value: `${stats?.passRatePercentage ?? 0}%`,
      unit: '',
      icon: <CheckCircleIcon sx={{ fontSize: 20, color: '#7c3aed' }} />,
      bgColor: '#f5f3ff',
      isOverview: false,
    },
    {
      title: 'ติดปัญหา',
      value: stats?.stuckCount ?? 0,
      unit: 'คน',
      icon: <WarningAmberOutlinedIcon sx={{ fontSize: 20, color: '#dc2626' }} />,
      bgColor: '#fef2f2',
      isOverview: false,
      isWarning: true,
    },
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(6, 1fr)',
        },
        gap: 2,
      }}
    >
      {cardItems.map((card) => {
        const loading = card.isOverview ? (isOverviewLoading ?? isLoading) : isLoading
        return (
          <Card
            key={card.title}
            sx={{
              p: 2,
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px 0 rgba(79, 70, 229, 0.08)',
              },
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                bgcolor: card.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {card.icon}
            </Box>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography
                variant="caption"
                noWrap
                sx={{
                  color: '#64748b',
                  fontWeight: 500,
                  fontSize: '0.78rem',
                  display: 'block',
                  mb: 0.2,
                }}
              >
                {card.title}
              </Typography>
              {loading ? (
                <Skeleton width={60} height={28} animation="wave" />
              ) : (
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: card.isWarning && (stats?.stuckCount ?? 0) > 0 ? '#dc2626' : '#1e293b',
                    fontSize: '1.25rem',
                    lineHeight: 1.2,
                  }}
                >
                  {card.value}{' '}
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 500 }}
                  >
                    {card.unit}
                  </Typography>
                </Typography>
              )}
            </Box>
          </Card>
        )
      })}
    </Box>
  )
}

export default TeacherStatCards
