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
        borderRadius: '16px', 
        border: '1px solid #e2e8f0', 
        boxShadow: 'none',
        bgcolor: '#ffffff'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
            <AlertCircle size={18} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
            Exception Message
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '13px' }}>
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
              p: 2,
              bgcolor: '#f8fafc',
              color: '#dc2626',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '13px',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            {displayMessage}
          </Box>
        </Box>
      )}
    </Paper>
  )
}

