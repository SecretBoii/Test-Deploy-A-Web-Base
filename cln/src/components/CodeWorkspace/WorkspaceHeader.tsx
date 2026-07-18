import { Box, Button, Typography, CircularProgress } from '@mui/material'
import { Play, Send } from 'lucide-react'

interface WorkspaceHeaderProps {
  isRunning: boolean
  onRun: () => void
  onSubmit?: () => void
}

export function WorkspaceHeader({ isRunning, onRun, onSubmit }: WorkspaceHeaderProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>Code Workspace</Typography>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
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
