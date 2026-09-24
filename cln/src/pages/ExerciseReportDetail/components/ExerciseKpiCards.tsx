import { Box, Card, Typography } from '@mui/material';
import type { ExerciseStudentBreakdownResponse } from '../../../api/reports';

interface ExerciseKpiCardsProps {
  stats: ExerciseStudentBreakdownResponse['stats'];
}

export function ExerciseKpiCards({ stats }: ExerciseKpiCardsProps) {
  const isNoAttempt = stats.attemptedCount === 0;

  const getPassRateColor = () => {
    if (isNoAttempt) return '#94a3b8';
    if (stats.passRateAttempted > 70) return '#10b981';
    if (stats.passRateAttempted > 40) return '#d97706';
    return '#ef4444';
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2 }}>
      <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>ผู้เข้าทำ</Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: isNoAttempt ? '#94a3b8' : '#0f172a', mt: 0.5 }}>
          {stats.attemptedCount} / {stats.totalStudents} คน
        </Typography>
      </Card>

      <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>อัตราการผ่าน</Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: getPassRateColor(), mt: 0.5 }}>
          {isNoAttempt ? '-' : `${stats.passRateAttempted.toFixed(0)}% ผ่าน`}
        </Typography>
      </Card>

      <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>รันโค้ดเฉลี่ย (Run)</Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: isNoAttempt ? '#94a3b8' : '#f59e0b', mt: 0.5 }}>
          {isNoAttempt ? '-' : `${stats.avgRuns.toFixed(1)} ครั้ง`}
        </Typography>
      </Card>

      <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>ส่งตรวจเฉลี่ย (Submit)</Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: isNoAttempt ? '#94a3b8' : '#6366f1', mt: 0.5 }}>
          {isNoAttempt ? '-' : `${stats.avgSubmits.toFixed(1)} ครั้ง`}
        </Typography>
      </Card>

      <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>คะแนนเฉลี่ย</Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: isNoAttempt ? '#94a3b8' : '#2563eb', mt: 0.5 }}>
          {isNoAttempt ? '-' : `${stats.avgScore.toFixed(1)} / 100`}
        </Typography>
      </Card>
    </Box>
  );
}
