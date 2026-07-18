import { Box, Typography } from '@mui/material'
import { Sparkles } from 'lucide-react'

interface GeminiFeedbackProps {
  response: string
}

export function GeminiFeedback({ response }: GeminiFeedbackProps) {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', p: 2, minHeight: 0 }}>
      <Typography variant="subtitle2" sx={{ color: '#818cf8', mb: 1, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Sparkles size={16} /> Gemini Assistant
      </Typography>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: '#020617', borderRadius: '8px', p: 1.5, border: '1px solid #1e293b' }}>
        <Typography sx={{ color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '13px', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
          {response || 'Gemini will suggest improvements or point out syntax/logic errors here after running your code.'}
        </Typography>
      </Box>
    </Box>
  )
}
