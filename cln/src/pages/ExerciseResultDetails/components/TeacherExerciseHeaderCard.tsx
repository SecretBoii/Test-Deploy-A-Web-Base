import React from 'react';
import { Box, Card, Typography, Chip, Button } from '@mui/material';
import { ArrowLeft, Clock, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';
import type { ExerciseStudentBreakdownResponse } from '../../../api/reports';

interface TeacherExerciseHeaderCardProps {
  exercise: ExerciseStudentBreakdownResponse['exercise'];
  students: ExerciseStudentBreakdownResponse['students'];
}

export const TeacherExerciseHeaderCard: React.FC<TeacherExerciseHeaderCardProps> = ({ exercise, students }) => {
  const navigate = useNavigate();

  const diffMeta = DIFFICULTY_LEVELS[exercise.difficultyLevel] || {
    label: `Level ${exercise.difficultyLevel}`,
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    description: 'ระดับความยากตาม Bloom\'s Taxonomy',
  };

  // ฟังก์ชันดาวน์โหลดรายงานคะแนนของนักศึกษาในโจทย์ข้อนี้เป็น CSV สำหรับอาจารย์
  const handleExportCsv = () => {
    const activeStudents = (students || []).filter(
      (st) => st.runCount > 0 || st.submitCount > 0 || st.isAttempted,
    );
    if (activeStudents.length === 0) return;

    const headers = [
      'รหัสนักศึกษา',
      'ชื่อ-นามสกุล',
      'มหาวิทยาลัย',
      'คณะ',
      'สถานะ',
      'คำใบ้',
      'คะแนนสูงสุดที่ส่ง',
      'จำนวน Run',
      'จำนวน Submit',
      'ส่งล่าสุด',
    ];
    const rows = activeStudents.map((st) => [
      st.username,
      `"${st.fullName}"`,
      `"${st.university || '-'}"`,
      `"${st.faculty || '-'}"`,
      st.status === 'PASSED'
        ? 'ผ่าน (Passed)'
        : st.status === 'FAILED'
          ? 'ไม่ผ่าน (Failed)'
          : 'ยังไม่ส่งตรวจ (Not Submitted)',
      st.hasUsedHint ? 'ใช้ (1 ครั้ง)' : 'ไม่ใช้',
      st.bestScore !== null ? st.bestScore : '-',
      st.runCount,
      st.submitCount,
      st.lastSubmittedAt ? `"${new Date(st.lastSubmittedAt).toLocaleString('th-TH')}"` : '-',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `exercise_${exercise.exerciseId}_student_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* แถบปุ่มย้อนกลับและปุ่ม Export ข้อมูล */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Button
          variant="contained"
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate('/exercise-results')}
          sx={{
            color: '#475569',
            fontWeight: 700,
            fontSize: '13px',
            textTransform: 'none',
            px: 2,
            py: 0.9,
            borderRadius: '8px',
            bgcolor: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#f8fafc', color: '#0f172a', boxShadow: 'none' },
          }}
        >
          ย้อนกลับไปหน้ารวมผลแบบฝึกหัด
        </Button>

        <Button
          variant="contained"
          startIcon={<Download size={16} />}
          onClick={handleExportCsv}
          sx={{
            bgcolor: '#107c41',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '13px',
            borderRadius: '10px',
            px: 2.2,
            py: 0.9,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#0b5a2f', boxShadow: 'none' },
          }}
        >
          ดาวน์โหลด CSV
        </Button>
      </Box>

      {/* การ์ดรายละเอียดโจทย์ */}
      <Card
        sx={{
          p: 3.5,
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          boxShadow: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.8 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
                {exercise.title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '13px' }}>
                รหัส #{exercise.exerciseId}
              </Typography>
              <Chip
                label={diffMeta.label}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '12px',
                  color: diffMeta.color,
                  bgcolor: diffMeta.bg,
                  border: `1px solid ${diffMeta.border}`,
                  borderRadius: '8px',
                  px: 0.5,
                }}
              />
            </Box>

            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              หัวข้อ: <span style={{ color: '#1e293b' }}>{exercise.topic}</span>
            </Typography>
          </Box>

          {/* เวลาที่คาดหวังในการทำโจทย์ */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: '10px',
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <Clock size={16} color="#64748b" />
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', lineHeight: 1 }}>
                เวลาเป้าหมาย
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                {exercise.expectedTime} นาที
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* วัตถุประสงค์และคำใบ้ (สไตล์ Minimal List พร้อมเส้นแบ่งบางๆ สะอาดตา ไม่มีกล่องสี) */}
        {(exercise.objective || exercise.hint) && (
          <Box
            sx={{
              mt: 2.5,
              pt: 2,
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.2,
            }}
          >
            {exercise.objective && (
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'baseline' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', minWidth: '85px', fontSize: '13.5px' }}>
                  วัตถุประสงค์:
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', fontSize: '13.5px', lineHeight: 1.6 }}>
                  {exercise.objective}
                </Typography>
              </Box>
            )}

            {exercise.hint && (
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'baseline' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748b', minWidth: '85px', fontSize: '13.5px' }}>
                  คำใบ้โจทย์:
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13.5px', lineHeight: 1.6 }}>
                  {exercise.hint}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Card>
    </Box>
  );
};
