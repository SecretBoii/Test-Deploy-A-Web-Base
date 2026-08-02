import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Paper, Divider, Checkbox } from '@mui/material'
import { 
  CheckCircle2, 
  XCircle, 
  PlayCircle, 
  Clock, 
  Lightbulb, 
  Calendar,
  ChevronRight
} from 'lucide-react'

interface ScoreSummaryCardProps {
  score: number
  isPassed: boolean
  exerciseId: number
  sessionId: number
  nextExerciseId: number | null
  runCount: number
  hintUsed: boolean
  startedAt: string
  submittedAt: string
}

export function ScoreSummaryCard({
  score,
  isPassed,
  exerciseId,
  sessionId,
  nextExerciseId,
  runCount,
  hintUsed,
  startedAt,
  submittedAt,
}: ScoreSummaryCardProps) {
  const navigate = useNavigate()

  // ฟังก์ชันแปลงวันที่เป็น พ.ศ. ของไทย (DD/MM/YY)
  const formatThaiDate = (dateString: string) => {
    if (!dateString) return '-'
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return '-'
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = String((d.getFullYear() + 543) % 100).padStart(2, '0')
    return `${day}/${month}/${year}`
  }

  // แปลงเวลา (HH:MM)
  const formatThaiTime = (dateString: string) => {
    if (!dateString) return '-'
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return '-'
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  // คำนวณเวลาที่ใช้ในการทำโจทย์
  const getTimeSpent = () => {
    if (!startedAt || !submittedAt) return '-'
    const start = new Date(startedAt).getTime()
    const end = new Date(submittedAt).getTime()
    const diffMs = end - start
    if (isNaN(diffMs) || diffMs < 0) return '-'
    const diffSeconds = Math.round(diffMs / 1000)
    if (diffSeconds < 60) {
      return `${diffSeconds} วินาที`
    }
    const diffMins = Math.round(diffMs / 60000)
    return `${diffMins} นาที`
  }

  const items = [
    { 
      label: 'ผลตรวจ', 
      value: isPassed ? 'ถูกต้อง' : 'มีข้อผิดพลาด', 
      valueColor: isPassed ? '#10b981' : '#ef4444', 
      icon: isPassed ? <CheckCircle2 size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" /> 
    },
    { label: 'ครั้งที่ Run', value: `${runCount} ครั้ง`, icon: <PlayCircle size={16} color="#64748b" /> },
    { label: 'เวลาที่ใช้', value: getTimeSpent(), icon: <Clock size={16} color="#64748b" /> },
    { 
      label: 'ใช้ Hint', 
      value: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end', color: hintUsed ? '#eab308' : '#94a3b8' }}>
          <Checkbox 
            checked={hintUsed} 
            disabled 
            size="small" 
            sx={{ 
              p: 0, 
              color: '#cbd5e1', 
              '&.Mui-checked': { color: '#eab308' } 
            }} 
          />
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '13px' }}>
            {hintUsed ? 'ใช้แล้ว' : 'ไม่ได้ใช้'}
          </Typography>
        </Box>
      ),
      icon: <Lightbulb size={16} color={hintUsed ? '#eab308' : '#64748b'} />
    },
    { label: 'เริ่มทำเมื่อ', value: formatThaiDate(startedAt), icon: <Calendar size={16} color="#64748b" /> },
    { label: 'เวลาเริ่ม', value: formatThaiTime(startedAt), icon: <Clock size={16} color="#64748b" /> },
    { label: 'วันที่ส่ง', value: formatThaiDate(submittedAt), icon: <Calendar size={16} color="#64748b" /> },
    { label: 'เวลาส่ง', value: formatThaiTime(submittedAt), icon: <Clock size={16} color="#64748b" /> },
  ]

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)',
      }}
    >
      {/* 1. แสดงคะแนนแบบไม่มีกรอบ */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 4,
          mt: 2,
        }}
      >
        <Typography 
          sx={{ 
            fontSize: '76px',
            fontWeight: 900, 
            color: isPassed ? '#10b981' : '#ef4444', 
            lineHeight: 1.1,
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.02em',
            textShadow: isPassed 
              ? '0 4px 12px rgba(16, 185, 129, 0.1)' 
              : '0 4px 12px rgba(239, 68, 68, 0.1)'
          }}
        >
          {score}
        </Typography>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: '#64748b', 
            fontWeight: 700, 
            mt: 0.5,
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}
        >
          คะแนน
        </Typography>
      </Box>

      <Divider sx={{ width: '100%', mb: 3, borderColor: '#f1f5f9' }} />

      {/* 2. ตารางรายละเอียดผลการตรวจ */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        {items.map((item, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              py: 0.5
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {item.icon}
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '13.5px' }}>
                {item.label}
              </Typography>
            </Box>
            {typeof item.value === 'string' ? (
              <Typography variant="body2" sx={{ fontWeight: 700, color: item.valueColor || '#1e293b', fontSize: '13.5px' }}>
                {item.value}
              </Typography>
            ) : (
              item.value
            )}
          </Box>
        ))}
      </Box>

      {/* 3. Action Buttons */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5, mt: 'auto' }}>
        {nextExerciseId ? (
          <Button
            fullWidth
            variant="contained"
            endIcon={<ChevronRight size={16} />}
            onClick={() => navigate(`/editor/${nextExerciseId}?sessionId=${sessionId}`)}
            sx={{
              py: 1.6,
              borderRadius: '14px',
              fontWeight: 800,
              textTransform: 'none',
              bgcolor: '#10b981',
              boxShadow: 'none',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: '#059669',
                boxShadow: '0 4px 12px rgba(16,185,129,0.2)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            โจทย์ข้อถัดไป
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate('/sessions')}
            sx={{
              py: 1.6,
              borderRadius: '14px',
              fontWeight: 800,
              textTransform: 'none',
              bgcolor: '#10b981',
              boxShadow: 'none',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: '#059669',
                boxShadow: '0 4px 12px rgba(16,185,129,0.2)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            จบแบบฝึกหัดบทนี้
          </Button>
        )}

        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate(`/editor/${exerciseId}?sessionId=${sessionId}`)}
          sx={{
            py: 1.5,
            borderRadius: '14px',
            fontWeight: 800,
            textTransform: 'none',
            borderColor: '#3b82f6',
            color: '#3b82f6',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: '#2563eb',
              bgcolor: '#eff6ff',
              transform: 'translateY(-1px)',
            },
          }}
        >
          ลองอีกครั้ง (แก้ไขโค้ด)
        </Button>
      </Box>
    </Paper>
  )
}
