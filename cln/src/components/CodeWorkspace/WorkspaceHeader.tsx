import { Box, Button, CircularProgress, Chip } from '@mui/material'
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
        {typeof runCount === 'number' && (
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
        <Button
          variant="contained"
          color="success"
          startIcon={isRunning ? <CircularProgress size={20} color="inherit" /> : <Play size={18} />}
          onClick={onRun}
          disabled={isRunning}
        >
          Run Code
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Send size={18} />}
          onClick={onSubmit}
          disabled={isRunning}
        >
          Submit
        </Button>
      </Box>
    </Box>
  )
}
