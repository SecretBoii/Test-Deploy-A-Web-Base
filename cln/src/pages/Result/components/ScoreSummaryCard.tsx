import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Paper, Divider, LinearProgress } from '@mui/material'
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

  // กำหนดรายการข้อมูลสรุปผล โดยปรับโทนสีไอคอนทั้งหมดเป็นสีเทากลาง (#64748b) 
  // และปรับสถานะ Hint เป็นสีปกติ เพื่อลดความรบกวนสายตาและให้สอดคล้องกับภาพรวมของการแสดงผล
  const items = [
    { 
      label: 'ผลตรวจ', 
      value: isPassed ? 'Passed' : 'Failed', 
      valueColor: isPassed ? '#10b981' : '#ef4444', 
      icon: isPassed ? <CheckCircle2 size={16} color="#64748b" /> : <XCircle size={16} color="#64748b" /> 
    },
    { 
      label: 'ใช้ Hint', 
      value: hintUsed ? 'ใช้แล้ว' : 'ไม่ได้ใช้',
      icon: <Lightbulb size={16} color="#64748b" />
    },
    { label: 'ครั้งที่ Run', value: `${runCount} ครั้ง`, icon: <PlayCircle size={16} color="#64748b" /> },
    { label: 'เริ่มทำเมื่อ', value: formatThaiDate(startedAt), icon: <Calendar size={16} color="#64748b" /> },
    { label: 'เวลาเริ่ม', value: formatThaiTime(startedAt), icon: <Clock size={16} color="#64748b" /> },
    { label: 'วันที่ส่ง', value: formatThaiDate(submittedAt), icon: <Calendar size={16} color="#64748b" /> },
    { label: 'เวลาส่ง', value: formatThaiTime(submittedAt), icon: <Clock size={16} color="#64748b" /> },
    { label: 'เวลาที่ใช้', value: getTimeSpent(), icon: <Clock size={16} color="#64748b" /> },  
  ]

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        boxShadow: 'none',
      }}
    >
      {/* แสดงคะแนนแบบ Dashboard Stats */}
      <Box sx={{ width: '100%', textAlign: 'center', mb: 3, mt: 1 }}>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5, display: 'block' }}>
          คะแนนที่ได้
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 0.5 }}>
          <Typography sx={{ fontSize: '48px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
            {score}
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>
            / 100
          </Typography>
        </Box>

        {/* แถบ LinearProgress ใต้ตัวเลข */}
        <LinearProgress
          variant="determinate"
          value={score}
          sx={{
            mt: 2,
            mb: 1,
            height: 6,
            borderRadius: 3,
            bgcolor: '#f1f5f9',
            '& .MuiLinearProgress-bar': { bgcolor: isPassed ? '#10b981' : '#f43f5e' },
          }}
        />
      </Box>

      <Divider sx={{ width: '100%', mb: 3, borderColor: '#f1f5f9' }} />

      {/* 2. ตารางรายละเอียดผลการตรวจ */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
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
            disableElevation
            endIcon={<ChevronRight size={16} />}
            onClick={() => navigate(`/editor/${nextExerciseId}?sessionId=${sessionId}`)}
            sx={{
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 700,
              textTransform: 'none',
              bgcolor: '#2563eb',
              '&:hover': {
                bgcolor: '#1d4ed8',
              },
            }}
          >
            โจทย์ข้อถัดไป
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            disableElevation
            onClick={() => navigate('/sessions')}
            sx={{
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 700,
              textTransform: 'none',
              bgcolor: '#10b981',
              '&:hover': {
                bgcolor: '#059669',
              },
            }}
          >
            จบแบบฝึกหัดบทนี้
          </Button>
        )}

        <Button
          fullWidth
          variant="outlined"
          disableElevation
          onClick={() => navigate(`/editor/${exerciseId}?sessionId=${sessionId}`)}
          sx={{
            py: 1.4,
            borderRadius: '12px',
            fontWeight: 700,
            textTransform: 'none',
            borderColor: '#cbd5e1',
            color: '#475569',
            '&:hover': {
              borderColor: '#94a3b8',
              bgcolor: '#f8fafc',
            },
          }}
        >
          ลองอีกครั้ง (แก้ไขโค้ด)
        </Button>
      </Box>
    </Paper>
  )
}
