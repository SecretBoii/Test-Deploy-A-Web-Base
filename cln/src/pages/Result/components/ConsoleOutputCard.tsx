import { Box, Typography, Paper } from '@mui/material'

interface ConsoleOutputCardProps {
  exceptionMessage: string | null
}

export function ConsoleOutputCard({ exceptionMessage }: ConsoleOutputCardProps) {
  if (!exceptionMessage) return null

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#991b1b' }}>
        ผลรันข้อผิดพลาด (Console Output):
      </Typography>
      <Paper
        sx={{
          p: 1.5,
          bgcolor: '#0f172a',
          color: '#f8fafc',
          fontFamily: 'monospace',
          fontSize: '12px',
          whiteSpace: 'pre-wrap',
          borderRadius: '8px',
        }}
      >
        {exceptionMessage}
      </Paper>
    </Box>
  )
}
