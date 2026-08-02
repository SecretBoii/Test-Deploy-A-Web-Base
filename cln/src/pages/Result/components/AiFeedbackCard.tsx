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
            bgcolor: '#fae8ff', 
            color: '#d946ef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Sparkles size={20} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
          คำแนะนำจาก AI
        </Typography>
      </Box>

      {/* แสดงหัวข้อหลัก (หากมีหลายหัวข้อ จะแสดงเป็นข้อๆ ให้แยกแยะง่าย) */}
      <Box sx={{ mb: recommendationText ? 2.5 : 0 }}>
        {points.length > 1 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {points.map((point, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box 
                  sx={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: '50%', 
                    bgcolor: '#d946ef', 
                    mt: 1, 
                    flexShrink: 0 
                  }} 
                />
                <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6, fontSize: '14px' }}>
                  {point}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.8, fontSize: '14.5px' }}>
            {mainText}
          </Typography>
        )}
      </Box>

      {/* ส่วนกรอบแนะนำเพิ่มเติมแบบไฮไลต์สีม่วง */}
      {recommendationText && (
        <Box
          sx={{
            p: 2.5,
            bgcolor: '#faf5ff',
            borderRadius: '16px',
            border: '1.5px dashed #d8b4fe',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            boxShadow: '0 2px 4px rgba(243,232,255,0.2)'
          }}
        >
          <Box 
            sx={{ 
              p: 0.5, 
              borderRadius: '8px', 
              bgcolor: '#f3e8ff', 
              color: '#a855f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 0.25
            }}
          >
            <Lightbulb size={16} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#7c3aed', display: 'block', mb: 0.5, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              คำแนะนำเพิ่มเติม
            </Typography>
            <Typography variant="body2" sx={{ color: '#5827b5', fontSize: '13.5px', lineHeight: 1.6, fontWeight: 500 }}>
              {recommendationText}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  )
}
