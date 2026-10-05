import React from 'react'
import { Box, Card, Typography } from '@mui/material'
import type { TeacherStats } from '../TeacherDashboard'

interface TeacherStatCardsProps {
  stats: TeacherStats | null
}

export const TeacherStatCards: React.FC<TeacherStatCardsProps> = ({ stats }) => {
  const cardItems = [
    {
      title: 'ชุดบทเรียน',
      value: stats?.totalSessions ?? 0,
      unit: 'ชุด',
    },
    {
      title: 'โจทย์ทั้งหมด',
      value: stats?.totalExercises ?? 0,
      unit: 'ข้อ',
    },
    {
      title: 'ผู้เรียนที่เข้าทำ',
      value: stats?.activeStudents ?? 0,
      unit: 'คน',
    },
    {
      title: 'ยอดรันโค้ด',
      value: stats?.totalRuns ?? 0,
      unit: 'ครั้ง',
    },
    {
      title: 'อัตราตรวจผ่าน',
      value: `${stats?.passRatePercentage ?? 0}%`,
      unit: '',
    },
    {
      title: 'ติดปัญหา',
      value: stats?.stuckCount ?? 0,
      unit: 'คน',
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
      {cardItems.map((card) => (
        <Card
          key={card.title}
          sx={{
            p: 2.2,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px 0 rgba(79, 70, 229, 0.06)',
            },
          }}
        >
          {/* ชื่อหัวข้อสถิติ */}
          <Typography
            variant="caption"
            noWrap
            sx={{
              color: '#64748b',
              fontWeight: 600,
              fontSize: '0.8rem',
              display: 'block',
              mb: 1,
            }}
          >
            {card.title}
          </Typography>

          {/* ตัวเลขสถิติและหน่วยแสดงผล */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.1,
              }}
            >
              {card.value}
            </Typography>
            {card.unit && (
              <Typography
                variant="caption"
                sx={{
                  color: '#94a3b8',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {card.unit}
              </Typography>
            )}
          </Box>
        </Card>
      ))}
    </Box>
  )
}

export default TeacherStatCards
