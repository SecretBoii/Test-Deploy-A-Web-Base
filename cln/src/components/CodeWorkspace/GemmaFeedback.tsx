import { Box, Typography, Chip } from '@mui/material'
import { Sparkles, Award } from 'lucide-react'

interface GemmaFeedbackProps {
  response: string
  score?: number | null
}

export function GemmaFeedback({ response, score }: GemmaFeedbackProps) {
  const getScoreBadgeColor = (val: number) => {
    if (val >= 80) return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' }
    if (val >= 50) return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' }
    return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' }
  }

  const scoreStyle = typeof score === 'number' ? getScoreBadgeColor(score) : null

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', p: 2, minHeight: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ color: '#818cf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Sparkles size={16} /> Gemma Assistant
        </Typography>

        {typeof score === 'number' && scoreStyle && (
          <Chip
            icon={<Award size={14} color={scoreStyle.text} />}
            label={`คะแนน: ${score}/100`}
            size="small"
            sx={{
              bgcolor: scoreStyle.bg,
              color: scoreStyle.text,
              fontWeight: 700,
              fontSize: '12px',
              border: `1px solid ${scoreStyle.border}`,
              '& .MuiChip-icon': { marginLeft: '6px' },
            }}
          />
        )}
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: '#020617', borderRadius: '8px', p: 1.5, border: '1px solid #1e293b' }}>
        <Typography sx={{ color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '13px', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
          {response || 'Gemma จะวิเคราะห์ ให้คะแนน และให้ข้อเสนอแนะในการปรับปรุงโค้ดตรงนี้หลังจากคุณรันโค้ด'}
        </Typography>
      </Box>
    </Box>
  )
}
