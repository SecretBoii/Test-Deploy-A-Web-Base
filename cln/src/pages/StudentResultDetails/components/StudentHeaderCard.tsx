import React from 'react';
import { Box, Card, Typography, Chip, Button } from '@mui/material';
import { ArrowLeft, Target, Download, Mail, Building2, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { StudentActivitiesResponse, StudentActivitiesStats } from '../../../api/reports';
import { formatThaiDateTime } from '../../../utils/dateUtils';

export interface StudentExerciseItem {
  sessionId: number;
  exerciseId: number;
  title: string;
  topic: string;
  difficultyLevel: number;
  expectedTime?: number;
  sessionName: string;
  bestScore: number | null;
  status: 'PASSED' | 'FAILED';
  runCount: number;
  submitCount: number;
  lastSubmittedAt: string | null;
  latestActivity: StudentActivitiesResponse['activities'][0];
  bestActivity: StudentActivitiesResponse['activities'][0];
  activities: StudentActivitiesResponse['activities'];
}

interface StudentHeaderCardProps {
  student: NonNullable<StudentActivitiesResponse['student']>;
  stats: StudentActivitiesStats;
  totalExercises: number;
  exercises: StudentExerciseItem[];
}

export const StudentHeaderCard: React.FC<StudentHeaderCardProps> = ({
  student,
  stats,
  totalExercises,
  exercises,
}) => {
  const navigate = useNavigate();

  // นำเปอร์เซ็นต์ความคืบหน้าที่คำนวณมาจาก Backend มาปัดเศษทศนิยมสำหรับแสดงผล
  const passPercent = Math.min(100, Math.round(stats.percentage || 0));

  // ส่งออกรายงานผลงานของผู้เรียนคนนี้เป็นไฟล์ CSV
  const handleExportCsv = () => {
    if (exercises.length === 0) return;

    const headers = [
      'รหัสโจทย์',
      'ชื่อแบบฝึกหัด',
      'หัวข้อ',
      'บทเรียน (Session)',
      'คะแนนสูงสุดที่ส่ง',
      'สถานะ',
      'จำนวน Run (ครั้ง)',
      'จำนวน Submit (ครั้ง)',
      'ส่งตรวจล่าสุด',
    ];

    const rows = exercises.map((ex) => [
      ex.exerciseId,
      `"${ex.title.replace(/"/g, '""')}"`,
      `"${ex.topic.replace(/"/g, '""')}"`,
      `"${ex.sessionName.replace(/"/g, '""')}"`,
      ex.bestScore !== null ? ex.bestScore : '-',
      ex.status === 'PASSED' ? 'ผ่าน (Passed)' : 'ยังไม่ผ่าน (Failed)',
      ex.runCount,
      ex.submitCount,
      ex.lastSubmittedAt ? `"${formatThaiDateTime(ex.lastSubmittedAt)}"` : '-',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `student_${student.username}_exercise_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* แถบปุ่มย้อนกลับและปุ่ม Export ข้อมูล ถอดแบบรูปที่ 1 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Button
          variant="contained"
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate('/student-results')}
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
          ย้อนกลับไปหน้ารวมผลการเรียนรู้
        </Button>

        <Button
          variant="contained"
          startIcon={<Download size={16} />}
          onClick={handleExportCsv}
          disabled={exercises.length === 0}
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
            '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' },
          }}
        >
          ดาวน์โหลด CSV
        </Button>
      </Box>

      {/* การ์ดรายละเอียดผู้เรียน ถอดแบบกรอบและมิติจากรูปที่ 1 */}
      <Card
        sx={{
          p: 3.5,
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          boxShadow: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            {/* บรรทัดที่ 1: ชื่อผู้เรียน + แท็ก username และ ID */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap', mb: 0.8 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
                {student.fullName || student.username}
              </Typography>
              <Chip
                label={`@${student.username}`}
                size="small"
                sx={{
                  bgcolor: '#f1f5f9',
                  color: '#0f172a',
                  fontWeight: 700,
                  fontSize: '12px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                }}
              />
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '13px' }}>
                รหัส #{student.userId}
              </Typography>
            </Box>

            {/* บรรทัดที่ 2: ข้อมูลสถาบันและคณะ */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <Building2 size={16} color="#64748b" />
                <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600 }}>
                  สถาบัน: <span style={{ color: '#1e293b' }}>{student.university || '-'}</span>
                </Typography>
              </Box>

              {student.faculty && student.faculty !== '-' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <GraduationCap size={16} color="#64748b" />
                  <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600 }}>
                    คณะ: <span style={{ color: '#1e293b' }}>{student.faculty}</span>
                    {student.major && student.major !== '-' ? ` (${student.major})` : ''}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* บรรทัดที่ 3: อีเมลนักศึกษา */}
            {student.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 1 }}>
                <Mail size={16} color="#64748b" />
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {student.email}
                </Typography>
              </Box>
            )}
          </Box>

          {/* กล่องมุมขวา: ความคืบหน้ารวม ถอดแบบกล่องเวลาเป้าหมายในรูปที่ 1 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              px: 2.2,
              py: 1.2,
              borderRadius: '12px',
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <Target size={18} color="#0f172a" />
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', lineHeight: 1.2, fontWeight: 600 }}>
                ความคืบหน้ารวม
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.2 }}>
                {passPercent}% <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>({stats.passedCount}/{totalExercises} ข้อ)</span>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
