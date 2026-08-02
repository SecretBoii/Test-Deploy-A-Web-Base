import { useState } from 'react'
import { Box, Typography, Paper, Switch } from '@mui/material'
import { AlertCircle } from 'lucide-react'

interface ConsoleOutputCardProps {
  exceptionMessage: string | null
}

export function ConsoleOutputCard({ exceptionMessage }: ConsoleOutputCardProps) {
  const [show, setShow] = useState(false)

  // แสดงผลเสมอเพื่อความสอดคล้องตามหน้า Mockup
  const displayMessage = exceptionMessage?.trim() || 'ไม่มีข้อความ Exception/Error (No exception message)'

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box 
            sx={{ 
              p: 1, 
              borderRadius: '12px', 
              bgcolor: '#ffe4e6', 
              color: '#e11d48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AlertCircle size={20} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Exception Message
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700, fontSize: '13.5px' }}>
            แสดงรายละเอียด
          </Typography>
          <Switch 
            checked={show} 
            onChange={(e) => setShow(e.target.checked)} 
            color="error"
            size="small"
          />
        </Box>
      </Box>

      {show && (
        <Box sx={{ mt: 2.5 }}>
          {/* Terminal Stderr Box */}
          <Box
            sx={{
              p: 2.5,
              bgcolor: '#090d16',
              color: '#f87171',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '13px',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              borderRadius: '16px',
              border: '1.5px solid #e11d48',
              boxShadow: '0 10px 15px -3px rgba(225,29,72,0.05)'
            }}
          >
            {displayMessage}
          </Box>
        </Box>
      )}
    </Paper>
  )
}
