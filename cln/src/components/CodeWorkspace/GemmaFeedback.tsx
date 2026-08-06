import { Box, Typography, Chip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Sparkles, Award } from 'lucide-react'

interface GemmaFeedbackProps {
  response: string
  score?: number | null
}

const GemmaContainer = styled(Box)(() => ({
  flex: 1, 
  display: 'flex', 
  flexDirection: 'column', 
  backgroundColor: 'var(--bg)', 
  borderRadius: '12px', 
  border: '1px solid var(--border)', 
  padding: '16px', // p: 2
  minHeight: 0,
  boxShadow: 'var(--shadow)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    borderColor: 'var(--border)',
    boxShadow: 'var(--shadow)',
  }
}));

const GemmaHeader = styled(Box)(() => ({
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: '12px'
}));

const GemmaTitle = styled(Typography)(() => ({
  color: 'var(--accent)', 
  fontWeight: 800, 
  fontSize: '0.875rem',
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px',
  fontFamily: 'inherit',
  '& svg': {
    filter: 'drop-shadow(0 0 4px var(--accent-bg))',
    color: 'var(--accent)'
  }
}));

const FeedbackCard = styled(Box)(() => ({
  flexGrow: 1, 
  overflowY: 'auto', 
  backgroundColor: 'var(--code-bg)', 
  borderRadius: '8px', 
  padding: '16px', 
  border: '1px solid var(--border)',
  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)'
}));

const FeedbackText = styled(Typography)(() => ({
  color: 'var(--text-h)', 
  fontFamily: 'inherit', 
  fontSize: '13px', 
  whiteSpace: 'pre-wrap', 
  lineHeight: 1.6
}));

export function GemmaFeedback({ response, score }: GemmaFeedbackProps) {
  const getScoreBadgeColor = (val: number) => {
    if (val >= 80) return { bg: 'rgba(16, 185, 129, 0.08)', text: '#059669', border: 'rgba(16, 185, 129, 0.25)' }
    if (val >= 50) return { bg: 'rgba(245, 158, 11, 0.08)', text: '#d97706', border: 'rgba(245, 158, 11, 0.25)' }
    return { bg: 'rgba(239, 68, 68, 0.08)', text: '#dc2626', border: 'rgba(239, 68, 68, 0.25)' }
  }

  const scoreStyle = typeof score === 'number' ? getScoreBadgeColor(score) : null

  return (
    <GemmaContainer>
      <GemmaHeader>
        <GemmaTitle variant="subtitle2">
          <Sparkles size={16} /> Gemma Assistant
        </GemmaTitle>

        {typeof score === 'number' && scoreStyle && (
          <Chip
            icon={<Award size={14} color={scoreStyle.text} />}
            label={`คะแนน: ${score}/100`}
            size="small"
            sx={{
              bgcolor: scoreStyle.bg,
              color: scoreStyle.text,
              fontWeight: 800,
              fontSize: '11px',
              border: `1px solid ${scoreStyle.border}`,
              borderRadius: '6px',
              px: 0.5,
              '& .MuiChip-icon': { marginLeft: '4px' },
            }}
          />
        )}
      </GemmaHeader>

      <FeedbackCard>
        <FeedbackText>
          {response || 'Gemma จะวิเคราะห์ ให้คะแนน และให้ข้อเสนอแนะในการปรับปรุงโค้ดตรงนี้หลังจากคุณส่งหรือรันโค้ด'}
        </FeedbackText>
      </FeedbackCard>
    </GemmaContainer>
  )
}

