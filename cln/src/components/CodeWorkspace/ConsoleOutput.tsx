import { Box, Typography } from '@mui/material'

interface ConsoleOutputProps {
  output: string
}

export function ConsoleOutput({ output }: ConsoleOutputProps) {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', p: 2, minHeight: 0 }}>
      <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 1, fontWeight: 700 }}>Console Output</Typography>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: '#020617', borderRadius: '8px', p: 1.5, border: '1px solid #1e293b' }}>
        <pre style={{ margin: 0, color: '#10b981', fontFamily: "'Fira Code', Courier, monospace", fontSize: '13px', whiteSpace: 'pre-wrap' }}>
          {output}
        </pre>
      </Box>
    </Box>
  )
}
