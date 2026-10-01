import React, { useMemo } from 'react';
import { Box, Card, Typography, Chip, Tooltip } from '@mui/material';
import type { StudentReportData } from '../../../api/reports';

interface StudentResultsKpiCardsProps {
  students: StudentReportData[];
}

export const StudentResultsKpiCards: React.FC<StudentResultsKpiCardsProps> = ({ students }) => {
  const totalStudents = students.length;

  // 1. ผู้เรียนที่มีการส่งตรวจงานจริง (มี totalSubmissions > 0)
  const activeStudents = useMemo(() => {
    return students.filter((s) => (s.totalSubmissions ?? 0) > 0);
  }, [students]);

  const activeCount = activeStudents.length;
  const inactiveCount = totalStudents - activeCount;

  // 2. คำนวณความคืบหน้าเฉลี่ย (% การผ่านโจทย์) เฉพาะผู้ที่มีการเข้าทำจริง
  const avgCompletionRate = useMemo(() => {
    if (activeCount === 0) return 0;
    const totalPercentage = activeStudents.reduce((sum, s) => {
      const totalEx = s.totalExercises && s.totalExercises > 0 ? s.totalExercises : 1;
      const passed = s.passedExercises ?? 0;
      return sum + (passed / totalEx) * 100;
    }, 0);
    return totalPercentage / activeCount;
  }, [activeStudents, activeCount]);

  // 3. คะแนนเฉลี่ยรวมของผู้เรียนที่มีการส่งตรวจจริง
  const classAvgScore = useMemo(() => {
    if (activeCount === 0) return 0;
    const sumScore = activeStudents.reduce((sum, s) => sum + (s.averageScore ?? 0), 0);
    return sumScore / activeCount;
  }, [activeStudents, activeCount]);

  // 4. สรุปยอดส่งตรวจและรันโค้ดทั้งหมด
  const totalSubmits = useMemo(() => {
    return students.reduce((sum, s) => sum + (s.totalSubmissions ?? 0), 0);
  }, [students]);

  const totalRuns = useMemo(() => {
    return students.reduce((sum, s) => {
      if (typeof s.totalRuns === 'number') {
        return sum + s.totalRuns;
      }
      const runs = Math.round((s.averageAttempts ?? 0) * (s.totalSubmissions ?? 0));
      return sum + runs;
    }, 0);
  }, [students]);

  // 5. วิเคราะห์ผู้เรียนที่ต้องเฝ้าระวัง (คัดจากผู้ที่เข้าทำจริงแต่ผลสัมฤทธิ์น้อยสุด หรือรันแก้โค้ดเยอะสุด)
  const studentNeedingAttention = useMemo(() => {
    if (activeStudents.length === 0) return null;

    return [...activeStudents].sort((a, b) => {
      const totalExA = a.totalExercises || 1;
      const totalExB = b.totalExercises || 1;
      const passRateA = ((a.passedExercises ?? 0) / totalExA) * 100;
      const passRateB = ((b.passedExercises ?? 0) / totalExB) * 100;

      // 1. เรียงตามอัตราการผ่านจากน้อยไปมาก
      if (passRateA !== passRateB) return passRateA - passRateB;

      // 2. ถ้าอัตราผ่านเท่ากัน ดูคะแนนเฉลี่ยน้อยที่สุด
      const scoreA = a.averageScore ?? 0;
      const scoreB = b.averageScore ?? 0;
      if (scoreA !== scoreB) return scoreA - scoreB;

      // 3. ดูจำนวนครั้งที่พยายามรันแก้โค้ดเยอะที่สุด
      return (b.averageAttempts ?? 0) - (a.averageAttempts ?? 0);
    })[0];
  }, [activeStudents]);

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
      {/* การ์ด 1: ผู้เรียนที่เข้าทำแล้ว */}
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
            ผู้เรียนที่ส่งงานแล้ว
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {activeCount}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              / {totalStudents} คน
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 'auto', pt: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500, fontSize: '11.5px', lineHeight: 1.4, display: 'block' }}>
            {totalStudents > 0
              ? `คิดเป็น ${((activeCount / totalStudents) * 100).toFixed(1)}% (ยังไม่ส่งงาน ${inactiveCount} คน)`
              : 'คิดเป็น 100%'}
          </Typography>
        </Box>
      </Card>

      {/* การ์ด 2: ความคืบหน้าเฉลี่ย */}
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
            ความคืบหน้าเฉลี่ย
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {activeCount > 0 ? `${avgCompletionRate.toFixed(1)}%` : '0%'}
            </Typography>
            {activeCount > 0 && (
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                ความคืบหน้า
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ mt: 'auto', pt: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500, fontSize: '11.5px', lineHeight: 1.4, display: 'block' }}>
            {activeCount > 0 ? 'เฉลี่ยเฉพาะผู้เรียนที่ส่งงานแล้ว' : 'ยังไม่มีข้อมูลการส่งงาน'}
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
              {activeCount > 0 ? classAvgScore.toFixed(1) : '0.0'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              / 100 คะแนน
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 'auto', pt: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500, fontSize: '11.5px', lineHeight: 1.4, display: 'block' }}>
            {activeCount > 0 ? 'คะแนนเฉลี่ยเฉพาะผู้เรียนที่ส่งงาน' : 'ยังไม่มีข้อมูลการส่งงาน'}
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

      {/* การ์ด 5: ผู้เรียนที่ต้องเฝ้าระวัง */}
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
              ผู้เรียนที่ต้องเฝ้าระวัง
            </Typography>
          </Box>

          {studentNeedingAttention ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                  {Math.round(
                    ((studentNeedingAttention.passedExercises ?? 0) /
                      (studentNeedingAttention.totalExercises || 1)) *
                      100
                  )}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '13px' }}>
                  ความคืบหน้า
                </Typography>
              </Box>

              <Tooltip title={studentNeedingAttention.fullName || studentNeedingAttention.username} arrow>
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
                  {studentNeedingAttention.fullName || studentNeedingAttention.username}
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
          {studentNeedingAttention ? (
            <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
              <Chip
                label={`@${studentNeedingAttention.username}`}
                size="small"
                sx={{ bgcolor: '#f1f5f9', color: '#1e293b', fontWeight: 700, fontSize: '11px', borderRadius: '6px' }}
              />
              <Chip
                label={`รันเฉลี่ย ${(studentNeedingAttention.averageAttempts ?? 0).toFixed(1)} ครั้ง`}
                size="small"
                sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 600, fontSize: '11px', borderRadius: '6px' }}
              />
            </Box>
          ) : (
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11.5px' }}>
              ไม่มีนักเรียนในกลุ่มเสี่ยง
            </Typography>
          )}
        </Box>
      </Card>
    </Box>
  );
};
