import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import type { StudentActivitiesStats } from '../../../api/reports';

interface StudentKpiCardsProps {
  stats: StudentActivitiesStats;
  totalExercises: number;
  attemptedCount: number;
}

export const StudentKpiCards: React.FC<StudentKpiCardsProps> = ({
  stats,
  totalExercises,
  attemptedCount,
}) => {
  const isNoAttempt = attemptedCount === 0;

  // คำนวณอัตราการผ่านของโจทย์ที่ผู้เรียนเข้าทำจริง (Pass Rate among Attempted)
  const passRate = attemptedCount > 0 ? (stats.passedCount / attemptedCount) * 100 : 0;

  // คำนวณค่าเฉลี่ยรันและส่งต่อโจทย์ที่เข้าทำ
  const avgRuns = attemptedCount > 0 ? (stats.runCount / attemptedCount).toFixed(1) : '0.0';
  const avgSubmits = attemptedCount > 0 ? (stats.submitCount / attemptedCount).toFixed(1) : '0.0';

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
        gap: 2.5,
      }}
    >
      {/* การ์ด 1: โจทย์ที่ทำแล้ว */}
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
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
          โจทย์ที่ทำแล้ว
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: isNoAttempt ? '#94a3b8' : '#0f172a', lineHeight: 1.1 }}>
            {attemptedCount}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
            ข้อ
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#94a3b8', mt: 0.8, fontWeight: 500 }}>
          {isNoAttempt ? 'ยังไม่เริ่มทำโจทย์' : `จาก ${totalExercises} ข้อที่เปิดให้ทำ`}
        </Typography>
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
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
          อัตราการผ่าน
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: isNoAttempt ? '#94a3b8' : '#0f172a',
              lineHeight: 1.1,
            }}
          >
            {isNoAttempt ? '-' : `${passRate.toFixed(0)}%`}
          </Typography>
          {!isNoAttempt && (
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              ผ่าน
            </Typography>
          )}
        </Box>
        <Typography variant="caption" sx={{ color: '#94a3b8', mt: 0.8, fontWeight: 500 }}>
          {isNoAttempt ? '-' : `ผ่าน ${stats.passedCount} จาก ${attemptedCount} ข้อ`}
        </Typography>
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
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
          รันโค้ดเฉลี่ย (Run)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: isNoAttempt ? '#94a3b8' : '#0f172a',
              lineHeight: 1.1,
            }}
          >
            {isNoAttempt ? '-' : avgRuns}
          </Typography>
          {!isNoAttempt && (
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              ครั้ง / ข้อ
            </Typography>
          )}
        </Box>
        <Typography variant="caption" sx={{ color: '#94a3b8', mt: 0.8, fontWeight: 500 }}>
          {isNoAttempt ? '-' : `รันรวมทั้งหมด ${stats.runCount} ครั้ง`}
        </Typography>
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
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
          ส่งตรวจเฉลี่ย (Submit)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: stats.submitCount === 0 ? '#94a3b8' : '#0f172a',
              lineHeight: 1.1,
            }}
          >
            {stats.submitCount === 0 ? '-' : avgSubmits}
          </Typography>
          {stats.submitCount > 0 && (
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              ครั้ง / ข้อ
            </Typography>
          )}
        </Box>
        <Typography variant="caption" sx={{ color: '#94a3b8', mt: 0.8, fontWeight: 500 }}>
          {stats.submitCount === 0 ? 'ยังไม่มีการส่งตรวจ' : `ส่งตรวจรวมทั้งหมด ${stats.submitCount} ครั้ง`}
        </Typography>
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
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
          คะแนนเฉลี่ย
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: stats.submitCount === 0 ? '#94a3b8' : '#0f172a',
              lineHeight: 1.1,
            }}
          >
            {stats.submitCount === 0 ? '-' : stats.averageScore.toFixed(1)}
          </Typography>
          {stats.submitCount > 0 && (
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              / 100 คะแนน
            </Typography>
          )}
        </Box>
        <Typography variant="caption" sx={{ color: '#94a3b8', mt: 0.8, fontWeight: 500 }}>
          {stats.submitCount === 0 ? 'ยังไม่มีคะแนนส่งตรวจ' : 'คำนวณจากคะแนนที่ดีที่สุดของผู้เรียน'}
        </Typography>
      </Card>
    </Box>
  );
};
