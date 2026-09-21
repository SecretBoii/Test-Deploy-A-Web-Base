import { Box, Typography, Card, Grid, Chip, LinearProgress } from '@mui/material';
import { CheckCircle, Award, Clock } from 'lucide-react';
import type { StudentActivitiesStats } from '../../../api/reports';

interface StudentKpiCardsProps {
  stats: StudentActivitiesStats;
  totalExercises: number;
}

export function StudentKpiCards({ stats, totalExercises }: StudentKpiCardsProps) {
  return (
    <Grid container spacing={2.5}>
      {/* การ์ด 1: ความคืบหน้าแบบฝึกหัดที่ผ่าน */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px' }}>
              แบบฝึกหัดที่ผ่านเกณฑ์ (≥ 80 คะแนน)
            </Typography>
            <Box sx={{ p: 0.8, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
              <CheckCircle size={18} color="#10b981" />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {stats.passedCount}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              / {totalExercises} ข้อ
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={stats.percentage}
            sx={{ height: 6, borderRadius: 3, my: 1.5, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }}
          />
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>
            สำเร็จ {stats.percentage.toFixed(0)}% ของแบบฝึกหัดทั้งหมด
          </Typography>
        </Card>
      </Grid>

      {/* การ์ด 2: คะแนนเฉลี่ย */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px' }}>
              คะแนนเฉลี่ย
            </Typography>
            <Box sx={{ p: 0.8, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
              <Award size={18} color="#2563eb" />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {stats.averageScore.toFixed(1)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              / 100 คะแนน
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, mt: 2.2, display: 'block' }}>
            คิดจากคะแนนที่ดีที่สุดของแต่ละข้อที่ส่งตรวจ (Submit)
          </Typography>
        </Card>
      </Grid>

      {/* การ์ด 3: ประวัติการส่งตรวจและรันโค้ด */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px' }}>
              ประวัติการส่งตรวจและรันโค้ด
            </Typography>
            <Box sx={{ p: 0.8, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
              <Clock size={18} color="#f59e0b" />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {stats.totalActivities}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              ครั้งทั้งหมด
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
            <Chip
              label={`Submit (ส่งตรวจ) ${stats.submitCount} ครั้ง`}
              size="small"
              sx={{ bgcolor: '#f8fafc', color: '#2563eb', fontWeight: 700, fontSize: '11.5px', border: '1px solid #e2e8f0' }}
            />
            <Chip
              label={`Run Code (ทดสอบ) ${stats.runCount} ครั้ง`}
              size="small"
              sx={{ bgcolor: '#f8fafc', color: '#64748b', fontWeight: 600, fontSize: '11.5px', border: '1px solid #e2e8f0' }}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}
