import { Box, Typography, Card, Grid, Chip, LinearProgress } from '@mui/material';
import type { StudentActivitiesStats } from '../../../api/reports';

interface StudentKpiCardsProps {
  stats: StudentActivitiesStats;
  totalExercises: number;
}

export function StudentKpiCards({ stats, totalExercises }: StudentKpiCardsProps) {
  return (
    <Grid container spacing={2.5} sx={{ alignItems: 'stretch' }}>
      {/* การ์ด 1: ความคืบหน้าแบบฝึกหัดที่ผ่าน */}
      <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
        <Card
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: 'none',
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
              แบบฝึกหัดที่ผ่านเกณฑ์ (≥ 80 คะแนน)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                {stats.passedCount}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                / {totalExercises} ข้อ
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 'auto', pt: 1.5 }}>
            <LinearProgress
              variant="determinate"
              value={stats.percentage}
              sx={{ height: 6, borderRadius: 3, mb: 1, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#0f172a' } }}
            />
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>
              สำเร็จ {stats.percentage.toFixed(0)}% ของแบบฝึกหัดทั้งหมด
            </Typography>
          </Box>
        </Card>
      </Grid>

      {/* การ์ด 2: คะแนนเฉลี่ย */}
      <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
        <Card
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: 'none',
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
              คะแนนเฉลี่ย
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                {stats.averageScore.toFixed(1)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                / 100 คะแนน
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 'auto', pt: 1.5 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, Math.max(0, stats.averageScore))}
              sx={{ height: 6, borderRadius: 3, mb: 1, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#0f172a' } }}
            />
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, display: 'block' }}>
              คิดจากคะแนนที่ดีที่สุดของแต่ละข้อที่ส่งตรวจ (Submit)
            </Typography>
          </Box>
        </Card>
      </Grid>

      {/* การ์ด 3: ประวัติการส่งตรวจและรันโค้ด */}
      <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
        <Card
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: 'none',
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
              ประวัติการส่งตรวจและรันโค้ด
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                {stats.totalActivities}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                ครั้งทั้งหมด
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 'auto', pt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`Submit ${stats.submitCount} ครั้ง`}
              size="small"
              sx={{ bgcolor: '#f8fafc', color: '#0f172a', fontWeight: 600, fontSize: '11.5px', border: '1px solid #e2e8f0' }}
            />
            <Chip
              label={`Run Code ${stats.runCount} ครั้ง`}
              size="small"
              sx={{ bgcolor: '#f8fafc', color: '#64748b', fontWeight: 600, fontSize: '11.5px', border: '1px solid #e2e8f0' }}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}
