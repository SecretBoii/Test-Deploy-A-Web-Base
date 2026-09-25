import { Box, Card, Typography } from '@mui/material';
import type { ExerciseStudentBreakdownResponse } from '../../../api/reports';

interface ExerciseKpiCardsProps {
  stats: ExerciseStudentBreakdownResponse['stats'];
}

export function ExerciseKpiCards({ stats }: ExerciseKpiCardsProps) {
  const isNoAttempt = stats.attemptedCount === 0;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2.5 }}>
      {/* การ์ด 1: ผู้เข้าทำ */}
      <Card
        sx={{
          p: 2.5,
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
          ผู้เข้าทำ
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: isNoAttempt ? '#94a3b8' : '#0f172a', lineHeight: 1.1 }}>
            {stats.attemptedCount}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
            / {stats.totalStudents} คน
          </Typography>
        </Box>
      </Card>

      {/* การ์ด 2: อัตราการผ่าน */}
      <Card
        sx={{
          p: 2.5,
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
          อัตราการผ่าน
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: isNoAttempt ? '#94a3b8' : '#0f172a', lineHeight: 1.1 }}>
            {isNoAttempt ? '-' : `${stats.passRateAttempted.toFixed(0)}%`}
          </Typography>
          {!isNoAttempt && (
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              ผ่าน
            </Typography>
          )}
        </Box>
      </Card>

      {/* การ์ด 3: รันโค้ดเฉลี่ย (Run) */}
      <Card
        sx={{
          p: 2.5,
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
          รันโค้ดเฉลี่ย (Run)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: isNoAttempt ? '#94a3b8' : '#0f172a', lineHeight: 1.1 }}>
            {isNoAttempt ? '-' : stats.avgRuns.toFixed(1)}
          </Typography>
          {!isNoAttempt && (
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              ครั้ง
            </Typography>
          )}
        </Box>
      </Card>

      {/* การ์ด 4: ส่งตรวจเฉลี่ย (Submit) */}
      <Card
        sx={{
          p: 2.5,
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
          ส่งตรวจเฉลี่ย (Submit)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: isNoAttempt ? '#94a3b8' : '#0f172a', lineHeight: 1.1 }}>
            {isNoAttempt ? '-' : stats.avgSubmits.toFixed(1)}
          </Typography>
          {!isNoAttempt && (
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              ครั้ง
            </Typography>
          )}
        </Box>
      </Card>

      {/* การ์ด 5: คะแนนเฉลี่ย */}
      <Card
        sx={{
          p: 2.5,
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
          คะแนนเฉลี่ย
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: isNoAttempt ? '#94a3b8' : '#0f172a', lineHeight: 1.1 }}>
            {isNoAttempt ? '-' : stats.avgScore.toFixed(1)}
          </Typography>
          {!isNoAttempt && (
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              / 100 คะแนน
            </Typography>
          )}
        </Box>
      </Card>
    </Box>
  );
}
