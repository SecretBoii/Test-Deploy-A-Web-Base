import { Box, Button, CircularProgress, Chip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Play, Send, RotateCw } from 'lucide-react'
import { ExerciseProblem } from './ExerciseProblem'
import type { ExerciseDetail } from '../Shared/CodeEditorPage'

interface WorkspaceHeaderProps {
  isRunning: boolean
  onRun: () => void
  onSubmit?: () => void
  exerciseData: ExerciseDetail | null
  loading: boolean
  runCount?: number | null
}

const PremiumRunButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isRunning'
})<{ isRunning?: boolean }>(({ isRunning }) => ({
  background: isRunning 
    ? 'rgba(16, 185, 129, 0.4)' 
    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  color: '#ffffff',
  fontWeight: 700,
  fontSize: '13px',
  textTransform: 'none',
  letterSpacing: '0.5px',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '8px',
  paddingBottom: '8px',
  borderRadius: '8px',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    boxShadow: '0 0 12px rgba(16, 185, 129, 0.4), 0 4px 6px -1px rgba(16, 185, 129, 0.2)',
    transform: 'translateY(-1px) scale(1.02)',
  },
  '&:active': {
    transform: 'translateY(1px) scale(0.97)',
  },
  '&.Mui-disabled': {
    background: '#e2e8f0',
    color: '#94a3b8',
    borderColor: '#cbd5e1',
  }
}));

const PremiumSubmitButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isRunning'
})<{ isRunning?: boolean }>(({ isRunning }) => ({
  background: isRunning 
    ? 'rgba(79, 70, 229, 0.4)' 
    : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  color: '#ffffff',
  fontWeight: 700,
  fontSize: '13px',
  textTransform: 'none',
  letterSpacing: '0.5px',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '8px',
  paddingBottom: '8px',
  borderRadius: '8px',
  border: '1px solid rgba(99, 102, 241, 0.2)',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
    boxShadow: '0 0 12px rgba(99, 102, 241, 0.4), 0 4px 6px -1px rgba(99, 102, 241, 0.2)',
    transform: 'translateY(-1px) scale(1.02)',
  },
  '&:active': {
    transform: 'translateY(1px) scale(0.97)',
  },
  '&.Mui-disabled': {
    background: '#e2e8f0',
    color: '#94a3b8',
    borderColor: '#cbd5e1',
  }
}));

export function WorkspaceHeader({
  isRunning,
  onRun,
  onSubmit,
  exerciseData,
  loading,
  runCount,
}: WorkspaceHeaderProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <ExerciseProblem exerciseData={exerciseData} loading={loading} />
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexShrink: 0 }}>
        {typeof runCount === 'number' && runCount > 0 && (
          <Chip
            icon={<RotateCw size={14} color="#0284c7" />}
            label={`จำนวนครั้งที่รัน: ${runCount}`}
            size="small"
            sx={{
              bgcolor: '#e0f2fe',
              color: '#0369a1',
              fontWeight: 700,
              fontSize: '12px',
              border: '1px solid #bae6fd',
              py: 0.5,
              '& .MuiChip-icon': { marginLeft: '6px' },
            }}
          />
        )}
        <PremiumRunButton
          variant="contained"
          onClick={onRun}
          disabled={isRunning}
          isRunning={isRunning}
          startIcon={isRunning ? <CircularProgress size={16} color="inherit" /> : <Play size={16} />}
        >
          {isRunning ? 'Running' : 'Run Code'}
        </PremiumRunButton>
        <PremiumSubmitButton
          variant="contained"
          onClick={onSubmit}
          disabled={isRunning}
          isRunning={isRunning}
          startIcon={<Send size={16} />}
        >
          Submit
        </PremiumSubmitButton>
      </Box>
    </Box>
  )
}

