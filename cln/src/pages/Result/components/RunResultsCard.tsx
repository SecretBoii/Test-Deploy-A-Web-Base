import { Box, Typography, Paper } from '@mui/material'
import { Terminal } from 'lucide-react'

interface RunResultsCardProps {
  actualOutput: string | null
}

export function RunResultsCard({ actualOutput }: RunResultsCardProps) {
  const formattedActual = actualOutput?.trim() || 'ไม่มี Output'

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: '16px',
        border: '1px solid #e2e8f0', 
        boxShadow: 'none',
        bgcolor: '#ffffff'
      }}
    >
      {/* Title Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Box 
          sx={{ 
            p: 1, 
            borderRadius: '8px', 
            bgcolor: '#f1f5f9', 
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Terminal size={18} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
          ผลลัพธ์การรัน
        </Typography>
      </Box>

      {/* Clean Code Output Container without macOS Titlebar */}
      <Box
        sx={{
          p: 2,
          bgcolor: '#f8fafc',
          color: '#0f172a',
          fontFamily: 'Consolas, Monaco, monospace',
          fontSize: '13px',
          lineHeight: 1.6,
          minHeight: '100px',
          whiteSpace: 'pre-wrap',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        {formattedActual}
      </Box>
    </Paper>
  )
}

