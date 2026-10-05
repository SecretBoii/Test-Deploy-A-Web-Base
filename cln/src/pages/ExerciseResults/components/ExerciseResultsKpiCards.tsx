import React, { useMemo } from 'react';
import { Box, Card, Typography, Chip, Tooltip } from '@mui/material';
import type { ExerciseAnalyticsData } from '../../../api/reports';

interface ExerciseResultsKpiCardsProps {
  activeExercises: ExerciseAnalyticsData[];
  totalExercises?: number;
}

export const ExerciseResultsKpiCards: React.FC<ExerciseResultsKpiCardsProps> = ({
  activeExercises,
  totalExercises = 0,
}) => {
  const attemptedCount = activeExercises.length;
  const totalInSystem = totalExercises > 0 ? totalExercises : attemptedCount;

  // 1. คำนวณอัตราการผ่านเฉลี่ยของข้อที่มีการเข้าทำ
  const avgPassRate = attemptedCount > 0
    ? activeExercises.reduce((sum, ex) => sum + (ex.passRateAttempted ?? ex.successRate ?? 0), 0) / attemptedCount
    : 0;

  // 2. คำนวณคะแนนเฉลี่ยรวมของข้อที่มีการเข้าทำ
  const overallAvgScore = attemptedCount > 0
    ? activeExercises.reduce((sum, ex) => sum + (ex.avgScore ?? 0), 0) / attemptedCount
    : 0;

  // 3. รวมจำนวนการส่งตรวจและการรันโค้ดทั้งหมด
  const totalSubmits = activeExercises.reduce((sum, ex) => sum + (ex.totalSubmits ?? 0), 0);
  const totalRuns = activeExercises.reduce((sum, ex) => sum + (ex.totalRuns ?? 0), 0);

  // 4. วิเคราะห์โจทย์ที่ต้องเฝ้าระวัง (ผ่านน้อยที่สุด หรือเด็กเจอบั๊กต้องรันแก้โค้ดเยอะที่สุด เฉพาะข้อที่มีคนทำจริง)
  const mostChallengingExercise = useMemo(() => {
    if (activeExercises.length === 0) return null;

    return [...activeExercises].sort((a, b) => {
      const passA = Number(a.passRateAttempted ?? a.successRate ?? 0);
      const passB = Number(b.passRateAttempted ?? b.successRate ?? 0);
      // 1. เรียงตามอัตราการผ่านจากน้อยไปมาก
      if (passA !== passB) {
        return passA - passB;
      }
      // 2. ถ้าอัตราผ่านเท่ากัน ดูข้อที่มีค่าเฉลี่ยการรันโค้ดต่อคนสูงที่สุด
      const runsA = Number(a.avgRuns ?? 0);
      const runsB = Number(b.avgRuns ?? 0);
      if (runsA !== runsB) {
        return runsB - runsA;
      }
      // 3. ถ้ายังเท่ากันอีก ดูคะแนนเฉลี่ยน้อยที่สุด
      return Number(a.avgScore ?? 0) - Number(b.avgScore ?? 0);
    })[0];
  }, [activeExercises]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(5, 1fr)',
        },
        gap: 2.5,
      }}
    >
      {/* การ์ด 1: แบบฝึกหัดที่เข้าทำแล้ว */}
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
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
            แบบฝึกหัดที่เข้าทำแล้ว
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {attemptedCount}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              / {totalInSystem} ข้อ
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 'auto', pt: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500, fontSize: '11.5px', lineHeight: 1.4, display: 'block' }}>
            {totalInSystem > 0
              ? `คิดเป็น ${((attemptedCount / totalInSystem) * 100).toFixed(1)}% ของโจทย์ทั้งหมด`
              : 'คิดเป็น 100% ของโจทย์'}
          </Typography>
        </Box>
      </Card>

      {/* การ์ด 2: อัตราการผ่านเฉลี่ย */}
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
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
            อัตราการผ่านเฉลี่ย
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {attemptedCount > 0 ? `${avgPassRate.toFixed(1)}%` : '0%'}
            </Typography>
            {attemptedCount > 0 && (
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                ผ่าน
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ mt: 'auto', pt: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500, fontSize: '11.5px', lineHeight: 1.4, display: 'block' }}>
            {attemptedCount > 0 ? 'เฉลี่ยเฉพาะข้อที่มีการส่งงาน' : 'ยังไม่มีข้อมูลการเข้าทำ'}
          </Typography>
        </Box>
      </Card>

      {/* การ์ด 3: คะแนนเฉลี่ย */}
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
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
            คะแนนเฉลี่ย
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {attemptedCount > 0 ? overallAvgScore.toFixed(1) : '0.0'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              / 100 คะแนน
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 'auto', pt: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500, fontSize: '11.5px', lineHeight: 1.4, display: 'block' }}>
            {attemptedCount > 0 ? 'คะแนนเฉลี่ยรวมทุกข้อที่ทำ' : 'ยังไม่มีข้อมูลการเข้าทำ'}
          </Typography>
        </Box>
      </Card>

      {/* การ์ด 4: ประวัติการส่งตรวจและรันโค้ด */}
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
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1.2 }}>
            ประวัติการส่งตรวจและรันโค้ด
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {totalSubmits + totalRuns}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              ครั้งทั้งหมด
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 'auto', pt: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`Submit ${totalSubmits} ครั้ง`}
              size="small"
              sx={{ bgcolor: '#f1f5f9', color: '#1e293b', fontWeight: 700, fontSize: '11px', borderRadius: '6px' }}
            />
            <Chip
              label={`Run Code ${totalRuns} ครั้ง`}
              size="small"
              sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 600, fontSize: '11px', borderRadius: '6px' }}
            />
          </Box>
        </Box>
      </Card>

      {/* การ์ด 5: โจทย์ที่ต้องเฝ้าระวัง */}
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
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px' }}>
              โจทย์ที่ต้องเฝ้าระวัง
            </Typography>
          </Box>

          {mostChallengingExercise ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                  {Number(mostChallengingExercise.passRateAttempted ?? mostChallengingExercise.successRate ?? 0).toFixed(0)}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '13px' }}>
                  อัตราผ่าน
                </Typography>
              </Box>

              <Tooltip title={mostChallengingExercise.title} arrow>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: '#1e293b',
                    fontSize: '13.5px',
                    lineHeight: 1.3,
                    mt: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {mostChallengingExercise.title}
                </Typography>
              </Tooltip>
            </>
          ) : (
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#94a3b8', lineHeight: 1.1 }}>
              -
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 'auto', pt: 1.5 }}>
          {mostChallengingExercise ? (
            <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
              <Chip
                label={`รหัส #${mostChallengingExercise.exerciseId}`}
                size="small"
                sx={{ bgcolor: '#f1f5f9', color: '#1e293b', fontWeight: 700, fontSize: '11px', borderRadius: '6px' }}
              />
              <Chip
                label={`รันเฉลี่ย ${(mostChallengingExercise.avgRuns ?? 0).toFixed(1)} ครั้ง`}
                size="small"
                sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 600, fontSize: '11px', borderRadius: '6px' }}
              />
            </Box>
          ) : (
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11px' }}>
              ยังไม่มีข้อมูลการเข้าทำ
            </Typography>
          )}
        </Box>
      </Card>
    </Box>
  );
};
