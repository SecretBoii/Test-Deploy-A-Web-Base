import {
  DialogTitle, DialogContent, DialogActions,
  Box, Typography, Button, IconButton, Chip, Grid, Paper
} from '@mui/material';
import { X, ArrowLeft } from 'lucide-react';
import type { StudentActivityItem } from '../../../api/reports';
import type { GroupedExerciseItem } from '../StudentErrorReportDetailPage';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';

interface ExerciseErrorCodeInspectionViewProps {
  exercise: GroupedExerciseItem;
  activity: StudentActivityItem;
  onBack: () => void;
  onClose: () => void;
}


export function ExerciseErrorCodeInspectionView({
  exercise,
  activity,
  onBack,
  onClose,
}: ExerciseErrorCodeInspectionViewProps) {
  // ฟังก์ชันจัดรูปแบบวันเวลาภาษาไทย
  const formatThaiDateTime = (dateStr?: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return `${d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' })} ${d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`;
  };

  const diffLevel = exercise.difficultyLevel || 1;
  const diffMeta = DIFFICULTY_LEVELS[diffLevel] || DIFFICULTY_LEVELS[1];
  const isPassed = (activity.score ?? 0) >= 80;

  return (
    <>
      {/* 1. ส่วนหัว (Header): ปุ่มย้อนกลับ, ชื่อโจทย์, ระดับความยาก และชิปสถานะผลการรัน */}
      <DialogTitle sx={{ px: 3, py: 2, bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          {/* ฝั่งซ้าย: ปุ่มย้อนกลับ พร้อมชื่อโจทย์ */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ArrowLeft size={16} />}
              onClick={onBack}
              sx={{
                color: '#475569',
                borderColor: '#e2e8f0',
                bgcolor: '#f8fafc',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '12.5px',
                textTransform: 'none',
                px: 1.6,
                py: 0.5,
                '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1', color: '#0f172a' },
              }}
            >
              ย้อนกลับไปประวัติ
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.3, fontSize: '1.05rem' }}>
                {exercise.title}
              </Typography>
              <Chip
                label={diffMeta.label}
                size="small"
                sx={{
                  bgcolor: `${diffMeta.color}15`,
                  color: diffMeta.color,
                  fontWeight: 700,
                  fontSize: '11px',
                  borderRadius: '6px',
                  height: '22px',
                }}
              />
            </Box>
          </Box>

          {/* ฝั่งขวา: ชิปประเภทกิจกรรม, สถานะ Passed/Failed, คะแนน และปุ่มปิด Dialog */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
            <Chip
              label={activity.eventType === 'submit' ? 'Submit' : 'Run Code'}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '12px',
                bgcolor: activity.eventType === 'submit' ? '#eff6ff' : '#f1f5f9',
                color: activity.eventType === 'submit' ? '#2563eb' : '#64748b',
                border: activity.eventType === 'submit' ? '1px solid #bfdbfe' : '1px solid #cbd5e1',
                borderRadius: '6px',
              }}
            />
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.6,
                px: 1.4,
                py: 0.35,
                borderRadius: '20px',
                bgcolor: isPassed ? '#ecfdf5' : '#fff1f2',
                color: isPassed ? '#10b981' : '#ef4444',
                fontSize: '12px',
                fontWeight: 700,
                border: isPassed ? '1px solid #a7f3d0' : '1px solid #fecdd3',
              }}
            >
              {isPassed ? 'Passed' : 'Failed'}
            </Box>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 1.4,
                py: 0.35,
                bgcolor: '#eff6ff',
                borderRadius: '8px',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
              }}
            >
              <Typography sx={{ fontSize: '12.5px', fontWeight: 800 }}>
                {activity.score ?? 0} / 100
              </Typography>
            </Box>

            <IconButton onClick={onClose} size="small" sx={{ color: '#64748b', ml: 0.5, '&:hover': { color: '#0f172a' } }}>
              <X size={20} />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      {/* 2. เนื้อหา (Content): Split Screen ซอร์สโค้ดฝั่งซ้าย และผลลัพธ์ Terminal ฝั่งขวา พร้อมคำแนะนำ AI */}
      <DialogContent
        sx={{
          px: 3,
          pb: 3,
          pt: '20px !important',
          bgcolor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {/* แถบข้อมูลบทเรียนและเวลาส่ง */}
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontSize: '13px' }}>
          บทเรียน: <span style={{ color: '#334155', fontWeight: 600 }}>{exercise.topic || 'ทั่วไป'}</span>
          {' '}• เวลาส่ง: <span style={{ color: '#334155', fontWeight: 600 }}>{formatThaiDateTime(activity.submittedAt)}</span>
        </Typography>

        <Grid container spacing={2.5}>
          {/* ฝั่งซ้าย: ซอร์สโค้ดภาษา Python ที่นักศึกษาเขียน */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '13px' }}>
                ซอร์สโค้ดภาษา Python ที่นักศึกษาเขียน:
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: '#0f172a',
                color: '#f8fafc',
                p: 2.5,
                borderRadius: '12px',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                fontSize: '13px',
                lineHeight: 1.6,
                overflowX: 'auto',
                minHeight: '260px',
                maxHeight: '380px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                border: '1px solid #334155',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              {activity.answer || '# ไม่พบข้อมูลโค้ดที่ส่ง'}
            </Box>
          </Grid>

          {/* ฝั่งขวา: ผลลัพธ์การรันหน้าจอ Terminal */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '13px' }}>
                ผลลัพธ์การรัน (Console Output / Errors):
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                p: 2.5,
                borderRadius: '12px',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                fontSize: '12.5px',
                lineHeight: 1.5,
                minHeight: '260px',
                maxHeight: '380px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                color: activity.exceptionMessage ? '#dc2626' : '#334155',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              }}
            >
              {activity.exceptionMessage
                ? `[Exception / Error Occurred]\n${activity.exceptionMessage}`
                : activity.output || 'โค้ดทำงานสำเร็จ (ไม่มีข้อความ print ออกมา)'}
            </Box>
          </Grid>
        </Grid>

        {/* แถวล่าง: กล่องคำแนะนำ AI Feedback (ถ้ามี) */}
        {activity.aiFeedback && (
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              bgcolor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '13.5px' }}>
                คำแนะนำและการประเมินจากระบบ AI:
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: '#334155',
                fontSize: '13.5px',
                lineHeight: 1.65,
                whiteSpace: 'pre-wrap',
              }}
            >
              {activity.aiFeedback}
            </Typography>
          </Paper>
        )}
      </DialogContent>

      {/* 3. ส่วนท้าย (Actions): ปุ่มปิดหน้าต่าง */}
      <DialogActions sx={{ px: 3, py: 1.8, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: '#2563eb',
            color: '#ffffff',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '13px',
            boxShadow: 'none',
            px: 2.5,
            py: 0.7,
            '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' },
          }}
        >
          ปิดหน้าต่าง
        </Button>
      </DialogActions>
    </>
  );
}
