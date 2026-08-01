import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Paper } from '@mui/material'
import { Award, ArrowRight } from 'lucide-react'

interface ScoreSummaryCardProps {
  score: number
  isPassed: boolean
  exerciseId: number
  sessionId: number
  nextExerciseId: number | null
}

export function ScoreSummaryCard({
  score,
  isPassed,
  exerciseId,
  sessionId,
  nextExerciseId,
}: ScoreSummaryCardProps) {
  const navigate = useNavigate()

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        bgcolor: isPassed ? '#f0fdf4' : '#fff1f2',
        border: `1px solid ${isPassed ? '#bbf7d0' : '#fecdd3'}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Award size={36} color={isPassed ? '#16a34a' : '#dc2626'} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: isPassed ? '#15803d' : '#991b1b' }}>
            {score} / 100
          </Typography>
          <Typography variant="subtitle2" sx={{ color: isPassed ? '#166534' : '#991b1b' }}>
            {isPassed ? 'ผ่านเกณฑ์บทเรียนแล้ว!' : 'ยังไม่ผ่านเกณฑ์การทดสอบ'}
          </Typography>
        </Box>
      </Box>

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate(`/editor/${exerciseId}?sessionId=${sessionId}`)}
        >
          แก้ไขโค้ดใหม่ (Try Again)
        </Button>

        {nextExerciseId ? (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            endIcon={<ArrowRight size={16} />}
            onClick={() => navigate(`/editor/${nextExerciseId}?sessionId=${sessionId}`)}
          >
            โจทย์ข้อถัดไป
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={() => navigate('/sessions')}
          >
            จบแบบฝึกหัดบทนี้
          </Button>
        )}
      </Box>
    </Paper>
  )
}
