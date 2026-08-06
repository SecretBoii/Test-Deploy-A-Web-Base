import { Box, Typography, Paper } from '@mui/material'
import { Sparkles, Lightbulb } from 'lucide-react'

interface AiFeedbackCardProps {
  feedback: string | null
}

export function AiFeedbackCard({ feedback }: AiFeedbackCardProps) {
  const rawFeedback = feedback || 'ไม่มีข้อเสนอแนะเพิ่มเติมจาก AI ในรอบนี้'

  // 1. แยกส่วนแนะนำเพิ่มเติม (ลองเพิ่ม...) ออกมาก่อนหากมีในข้อความ
  let mainText = rawFeedback
  let recommendationText = ''
  
  if (rawFeedback.includes('ลองเพิ่ม')) {
    const parts = rawFeedback.split('ลองเพิ่ม')
    mainText = parts[0].trim()
    recommendationText = 'ลองเพิ่ม' + parts[1].trim()
  }

  // 2. แยกหัวข้อหลักที่เป็นข้อๆ (Bullet points) ด้วยสัญลักษณ์ขีดลบ (-)
  const points = mainText
    .split(/(?=\s*-\s+)/)
    .map(p => p.replace(/^\s*-\s*/, '').trim())
    .filter(p => p.length > 0)

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: '16px', 
        border: '1px solid var(--border)', 
        boxShadow: 'none',
        bgcolor: 'var(--bg)'
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
          <Sparkles size={18} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
          คำแนะนำจาก AI
        </Typography>
      </Box>

      {/* แสดงหัวข้อหลัก (กล่องล้อมข้อความสีเทาอ่อน) */}
      <Box 
        sx={{ 
          p: 2,
          bgcolor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          mb: recommendationText ? 2.5 : 0 
        }}
      >
        {points.length > 1 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {points.map((point, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box 
                  sx={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: '50%', 
                    bgcolor: '#64748b', 
                    mt: 1, 
                    flexShrink: 0 
                  }} 
                />
                <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6, fontSize: '13.5px' }}>
                  {point}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.8, fontSize: '13.5px' }}>
            {mainText}
          </Typography>
        )}
      </Box>

      {/* ส่วนกรอบแนะนำเพิ่มเติมแบบไฮไลต์สีเทาอ่อน */}
      {recommendationText && (
        <Box
          sx={{
            p: 2,
            bgcolor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
          }}
        >
          <Box 
            sx={{ 
              p: 0.5, 
              borderRadius: '6px', 
              bgcolor: '#f1f5f9', 
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 0.25
            }}
          >
            <Lightbulb size={14} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 0.5, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              คำแนะนำเพิ่มเติม
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', fontSize: '13px', lineHeight: 1.6, fontWeight: 500 }}>
              {recommendationText}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  )
}



