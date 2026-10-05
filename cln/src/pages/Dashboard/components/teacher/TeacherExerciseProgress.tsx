import React from 'react'
import { Card, Typography, Box, LinearProgress } from '@mui/material'
import type { ExerciseProgressItem } from '../TeacherDashboard'
import { formatDisplayDate } from '../../../../utils/dateUtils'

interface TeacherExerciseProgressProps {
  exercises: ExerciseProgressItem[]
  selectedDate?: string
}

export const TeacherExerciseProgress: React.FC<TeacherExerciseProgressProps> = ({
  exercises,
  selectedDate,
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
        ความคืบหน้ารายแบบฝึกหัด (Exercise Progress)
      </Typography>
      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2.5 }}>
        สัดส่วนนักเรียนที่ทำผ่านในแบบฝึกหัดที่มีการส่งในวันที่เลือก
      </Typography>

      {exercises.length === 0 ? (
        <Box
          sx={{
            py: 5,
            px: 3,
            textAlign: 'center',
            bgcolor: '#f8fafc',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
            ไม่มีการส่งแบบฝึกหัดในวันที่เลือก
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            {selectedDate
              ? `ไม่พบประวัติการทำโจทย์ในวันที่ ${formatDisplayDate(selectedDate)} (ลองเลือกวันที่มีคาบเรียนจากปฏิทิน)`
              : 'ไม่พบประวัติการทำโจทย์ในช่วงเวลาที่เลือก'}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxHeight: '340px',
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
          {exercises.map((item) => {
            const pct = Math.min(100, Math.max(0, item.percentage))
            const barColor = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'

            return (
              <Box key={item.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.6 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }} noWrap>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, ml: 1, flexShrink: 0 }}>
                    เข้าทำ {item.totalStudents} คน (ผ่าน {item.passedCount} คน)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 7,
                    borderRadius: 4,
                    bgcolor: '#f1f5f9',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      bgcolor: barColor,
                    },
                  }}
                />
              </Box>
            )
          })}
        </Box>
      )}
    </Card>
  )
}

export default TeacherExerciseProgress
