import { Box, Typography, Card } from '@mui/material'

interface AiFeedbackCardProps {
  feedback: string | null
}

export function AiFeedbackCard({ feedback }: AiFeedbackCardProps) {
  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
        คำแนะนำในการปรับปรุงโค้ดจาก AI:
      </Typography>
      <Card sx={{ p: 2, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#334155' }}>
          {feedback || 'ไม่มีข้อเสนอแนะเพิ่มเติมจาก AI ในรอบนี้'}
        </Typography>
      </Card>
    </Box>
  )
}
