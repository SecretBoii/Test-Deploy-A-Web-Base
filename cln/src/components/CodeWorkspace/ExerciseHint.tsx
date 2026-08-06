import { Box, Typography, Button, Collapse, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Lightbulb, ChevronDown } from 'lucide-react'

interface ExerciseHintProps {
  hint?: string
  loading: boolean
  hintUsed: boolean
  onUseHint: () => void
}

const HintContainer = styled(Box)(() => ({
  background: 'var(--bg)',
  borderRadius: '12px',
  border: '1px solid var(--border)',
  padding: '16px', // p: 2
  display: 'flex',
  flexDirection: 'column',
  boxShadow: 'var(--shadow)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    borderColor: 'var(--border)',
    boxShadow: 'var(--shadow)',
  }
}));

const HintHeader = styled(Box)(() => ({
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center'
}));

const HintTitle = styled(Typography)(() => ({
  color: '#d97706',
  fontWeight: 700,
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
  gap: '8px', // gap: 1
  fontFamily: 'inherit',
  '& svg': {
    filter: 'drop-shadow(0 0 2px rgba(245, 158, 11, 0.15))'
  }
}));

const HintToggleButton = styled(Button)(() => ({
  color: '#d97706',
  borderColor: 'rgba(217, 119, 6, 0.3)',
  border: '1px solid',
  borderRadius: '20px', // pill shape
  paddingLeft: '14px',
  paddingRight: '14px',
  paddingTop: '4px',
  paddingBottom: '4px',
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.75rem',
  fontFamily: 'inherit',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: 'rgba(217, 119, 6, 0.05)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  '&:hover': {
    borderColor: '#d97706',
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    transform: 'translateY(-1px) scale(1.03)',
    boxShadow: '0 0 8px rgba(245, 158, 11, 0.1)',
  },
  '&:active': {
    transform: 'translateY(1px) scale(0.96)',
  },
  '&.Mui-disabled': {
    borderColor: 'var(--border)',
    color: 'var(--text)',
    opacity: 0.5
  }
}));

const ChevronIconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'expanded'
})<{ expanded?: boolean }>(({ expanded }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
}));

const HintExpandedCard = styled(Box)(() => ({
  marginTop: '12px', // mt: 1.5
  backgroundColor: 'var(--code-bg)',
  borderRadius: '8px',
  padding: '12px', // p: 1.5
  border: '1px solid var(--border)',
  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)'
}));

const HintContentText = styled(Typography)(() => ({
  color: 'var(--text-h)',
  fontFamily: 'inherit',
  fontSize: '13px',
  whiteSpace: 'pre-wrap',
  lineHeight: 1.6
}));

export function ExerciseHint({ hint, loading, hintUsed, onUseHint }: ExerciseHintProps) {
  const displayHint = hint || 'ยังไม่มีคำใบ้สำหรับโจทย์ข้อนี้'

  return (
    <HintContainer>
      <HintHeader>
        <HintTitle variant="subtitle2">
          <Lightbulb size={18} color="#d97706" /> คำใบ้สำหรับโจทย์ (Hint)
        </HintTitle>
        {hintUsed ? (
          <Box sx={{ 
            color: '#d97706', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            fontFamily: 'inherit', 
            display: 'inline-flex', 
            alignItems: 'center', 
            border: '1px solid rgba(217, 119, 6, 0.3)', 
            borderRadius: '20px', 
            paddingLeft: '14px',
            paddingRight: '14px',
            paddingTop: '4px',
            paddingBottom: '4px',
            backgroundColor: 'rgba(217, 119, 6, 0.05)',
            boxShadow: '0 0 8px rgba(245, 158, 11, 0.05)'
          }}>
            เปิดใช้งานแล้ว
          </Box>
        ) : (
          <HintToggleButton
            size="small"
            onClick={onUseHint}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={14} color="inherit" />
            ) : (
              <>
                ดูคำใบ้
                <ChevronIconWrapper expanded={false}>
                  <ChevronDown size={14} />
                </ChevronIconWrapper>
              </>
            )}
          </HintToggleButton>
        )}
      </HintHeader>

      <Collapse in={hintUsed}>
        <HintExpandedCard>
          {loading ? (
            <HintContentText sx={{ color: 'var(--text)' }}>
              กำลังโหลดคำใบ้จากระบบ...
            </HintContentText>
          ) : (
            <HintContentText>
              {displayHint}
            </HintContentText>
          )}
        </HintExpandedCard>
      </Collapse>
    </HintContainer>
  )
}

