import { useState, useEffect } from 'react'
import { Box, Typography, Button, Collapse, CircularProgress } from '@mui/material'
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'
import { apiClient } from '../../api/client'

interface ExerciseHintProps {
  exerciseId?: number
  hint?: string
}

export function ExerciseHint({ exerciseId, hint }: ExerciseHintProps) {
  const [showHint, setShowHint] = useState(false)
  const [dbHint, setDbHint] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (exerciseId) {
      setLoading(true)
      setError(null)
      apiClient
        .get(`/exercises/${exerciseId}`)
        .then((res) => {
          setDbHint(res.data?.hint || null)
        })
        .catch((err) => {
          console.error('Failed to fetch exercise hint:', err)
          setError('ไม่สามารถดึงคำใบ้จากระบบได้')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [exerciseId])

  const displayHint = hint || dbHint || (error ? error : 'ยังไม่มีคำใบ้สำหรับโจทย์ข้อนี้')

  return (
    <Box
      sx={{
        bgcolor: '#0f172a',
        borderRadius: '12px',
        border: '1px solid #1e293b',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: '#fbbf24',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Lightbulb size={18} color="#fbbf24" /> คำใบ้สำหรับโจทย์ (Hint)
        </Typography>
        <Button
          size="small"
          onClick={() => setShowHint(!showHint)}
          endIcon={showHint ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          disabled={loading}
          sx={{
            color: '#f59e0b',
            borderColor: '#b45309',
            '&:hover': {
              bgcolor: 'rgba(245, 158, 11, 0.1)',
            },
          }}
        >
          {loading ? <CircularProgress size={16} color="inherit" /> : showHint ? 'ซ่อนคำใบ้' : 'ดูคำใบ้'}
        </Button>
      </Box>

      <Collapse in={showHint}>
        <Box
          sx={{
            mt: 1.5,
            bgcolor: '#020617',
            borderRadius: '8px',
            p: 1.5,
            border: '1px solid #b45309',
          }}
        >
          {loading ? (
            <Typography sx={{ color: '#94a3b8', fontSize: '13px' }}>กำลังโหลดคำใบ้จากระบบ...</Typography>
          ) : (
            <Typography
              sx={{
                color: error ? '#f87171' : '#fef3c7',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '13px',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
              }}
            >
              {displayHint}
            </Typography>
          )}
        </Box>
      </Collapse>
    </Box>
  )
}
