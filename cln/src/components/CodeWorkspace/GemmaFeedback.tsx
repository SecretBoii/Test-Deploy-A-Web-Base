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
  backgroundColor: '#0f172a', 
  borderRadius: '12px', 
  border: '1px solid rgba(255, 255, 255, 0.08)', 
  padding: '16px', // p: 2
  minHeight: 0,
  boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    borderColor: 'rgba(129, 140, 248, 0.25)',
    boxShadow: '0 0 12px rgba(129, 140, 248, 0.05), 0 4px 15px -3px rgba(0, 0, 0, 0.15)',
  }
}));

const GemmaHeader = styled(Box)(() => ({
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: '12px'
}));

const GemmaTitle = styled(Typography)(() => ({
  color: '#a5b4fc', 
  fontWeight: 800, 
  fontSize: '0.875rem',
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px',
  fontFamily: "'Prompt', 'Plus Jakarta Sans', sans-serif",
  '& svg': {
    filter: 'drop-shadow(0 0 4px rgba(165, 180, 252, 0.65))',
    color: '#818cf8'
  }
}));

const FeedbackCard = styled(Box)(() => ({
  flexGrow: 1, 
  overflowY: 'auto', 
  backgroundColor: '#020617', 
  borderRadius: '8px', 
  padding: '16px', 
  border: '1px solid rgba(255, 255, 255, 0.05)',
  boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.45)'
}));

const FeedbackText = styled(Typography)(() => ({
  color: '#e2e8f0', 
  fontFamily: "'Prompt', 'Plus Jakarta Sans', sans-serif", 
  fontSize: '13px', 
  whiteSpace: 'pre-wrap', 
  lineHeight: 1.6
}));

export function GemmaFeedback({ response, score }: GemmaFeedbackProps) {
  const getScoreBadgeColor = (val: number) => {
    if (val >= 80) return { bg: 'rgba(16, 185, 129, 0.08)', text: '#34d399', border: 'rgba(16, 185, 129, 0.25)' }
    if (val >= 50) return { bg: 'rgba(245, 158, 11, 0.08)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.25)' }
    return { bg: 'rgba(239, 68, 68, 0.08)', text: '#f87171', border: 'rgba(239, 68, 68, 0.25)' }
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

