import { Box, Card, Typography, Grid } from '@mui/material'
import { Send, Trophy, BarChart2, Clock } from 'lucide-react'

interface HistoryStatsProps {
  totalSubmissions: number
  maxScore: number
  averageScore: number
  averageTime: string
}

export function HistoryStats({
  totalSubmissions,
  maxScore,
  averageScore,
  averageTime
}: HistoryStatsProps) {
  return (
    <Grid container spacing={3}>
      {/* การ์ด 1: ส่งทั้งหมด */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)'
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={20} color="#3b82f6" />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5 }}>
                ส่งทั้งหมด
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                {totalSubmissions}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                ครั้ง
              </Typography>
            </Box>
          </Box>
        </Card>
      </Grid>

      {/* การ์ด 2: คะแนนสูงสุด */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)'
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={20} color="#10b981" />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5 }}>
                คะแนนสูงสุด
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                {maxScore}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                คะแนน
              </Typography>
            </Box>
          </Box>
        </Card>
      </Grid>

      {/* การ์ด 3: คะแนนเฉลี่ย */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)'
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={20} color="#8b5cf6" />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5 }}>
                คะแนนเฉลี่ย
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                {averageScore}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                คะแนน
              </Typography>
            </Box>
          </Box>
        </Card>
      </Grid>

      {/* การ์ด 4: เวลาทำเฉลี่ย */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)'
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} color="#f97316" />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5 }}>
                เวลา เฉลี่ย
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                {averageTime}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                นาทีต่อโจทย์
              </Typography>
            </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}
