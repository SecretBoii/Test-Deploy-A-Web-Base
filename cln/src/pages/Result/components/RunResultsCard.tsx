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
        borderRadius: '24px', 
        border: '1px solid #e2e8f0', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)',
        bgcolor: '#ffffff'
      }}
    >
      {/* Title Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Box 
          sx={{ 
            p: 1, 
            borderRadius: '12px', 
            bgcolor: '#e0e7ff', 
            color: '#4f46e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Terminal size={20} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
          ผลลัพธ์การรัน
        </Typography>
      </Box>

      {/* Terminal Title */}
      <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        OUTPUT ที่ได้
      </Typography>

      {/* Clean Code Output Container without macOS Titlebar */}
      <Box
        sx={{
          p: 2.5,
          bgcolor: '#090d16',
          color: '#4ade80',
          fontFamily: 'Consolas, Monaco, monospace',
          fontSize: '13px',
          lineHeight: 1.6,
          minHeight: '100px',
          whiteSpace: 'pre-wrap',
          borderRadius: '16px',
          border: '1.5px solid #1e293b',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
        }}
      >
        {formattedActual}
      </Box>
    </Paper>
  )
}
