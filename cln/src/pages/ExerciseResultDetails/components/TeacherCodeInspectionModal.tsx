import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Paper,
} from '@mui/material';
import { X } from 'lucide-react';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';
import type { ExerciseStudentItem, ExerciseStudentBreakdownResponse } from '../../../api/reports';
import { formatThaiDateTime } from '../../../utils/dateUtils';

interface TeacherCodeInspectionModalProps {
  open: boolean;
  onClose: () => void;
  student: ExerciseStudentItem | null;
  exercise?: ExerciseStudentBreakdownResponse['exercise'] | null;
}

export const TeacherCodeInspectionModal: React.FC<TeacherCodeInspectionModalProps> = ({
  open,
  onClose,
  student,
  exercise,
}) => {
  if (!student || !student.latestActivity) return null;

  const activity = student.latestActivity;
  const isPassed = student.status === 'PASSED';
  const diffLevel = exercise?.difficultyLevel || 1;
  const diffMeta = DIFFICULTY_LEVELS[diffLevel] || DIFFICULTY_LEVELS[1];
  const isSubmit = activity.eventType === 'submit' || activity.eventType === 'SUBMIT';
  const displayTitle = exercise?.title || 'แบบฝึกหัดทั่วไป';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* ส่วนหัว Dialog: แสดงชื่อโจทย์, ระดับความยาก, ข้อมูลผู้เรียน และชุดป้ายสถานะทางขวา */}
      <DialogTitle sx={{ px: 3, py: 2.5, bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap', mb: 0.6 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.3, fontSize: '1.1rem' }}>
                {student.fullName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '13px' }}>
                (@{student.username})
              </Typography>
              <Chip
                label={diffMeta.label}
                size="small"
                sx={{
                  bgcolor: `${diffMeta.color}15`,
                  color: diffMeta.color,
                  fontWeight: 700,
                  fontSize: '12px',
                  borderRadius: '6px',
                  height: '24px',
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontSize: '12.5px' }}>
              แบบฝึกหัด: <span style={{ color: '#1e293b', fontWeight: 600 }}>{displayTitle}</span>
              {exercise?.topic && (
                <> • หัวข้อ: <span style={{ color: '#334155', fontWeight: 600 }}>{exercise.topic}</span></>
              )}
              {student.university && (
                <> • สถาบัน: <span style={{ color: '#334155', fontWeight: 600 }}>{student.university}</span></>
              )}
              {' '}• เวลาส่ง: <span style={{ color: '#334155', fontWeight: 600 }}>{formatThaiDateTime(activity.submittedAt || student.lastSubmittedAt || undefined)}</span>
            </Typography>
          </Box>

          {/* ป้ายสถานะฝั่งขวาบน: ชิปประเภท (Submit/Run), ชิปสถานะ (Passed/Failed), คะแนน และปุ่มปิด */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
            <Chip
              label={isSubmit ? 'Submit' : 'Run Code'}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '12px',
                bgcolor: isSubmit ? '#eff6ff' : '#f1f5f9',
                color: isSubmit ? '#2563eb' : '#64748b',
                border: isSubmit ? '1px solid #bfdbfe' : '1px solid #cbd5e1',
                borderRadius: '6px',
              }}
            />

            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 1.5,
                py: 0.4,
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
                gap: 0.5,
                px: 1.5,
                py: 0.4,
                bgcolor: '#eff6ff',
                borderRadius: '8px',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
              }}
            >
              <Typography sx={{ fontSize: '12.5px', fontWeight: 700 }}>
                {activity.score ?? student.bestScore ?? 0} / 100
              </Typography>
            </Box>

            <IconButton onClick={onClose} size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#0f172a' } }}>
              <X size={20} />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      {/* เนื้อหา Dialog: แยก 2 คอลัมน์ (ซ้ายโค้ด 7 ส่วน, ขวา Console Output 5 ส่วน) */}
      <DialogContent
        sx={{
          px: 3,
          pb: 3,
          pt: '24px !important',
          bgcolor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        <Grid container spacing={2.5}>
          {/* ฝั่งซ้าย: ซอร์สโค้ดภาษา Python ที่นักศึกษาเขียน */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>
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
                maxHeight: '400px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                border: '1px solid #334155',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              {activity.answer || '# ไม่พบข้อมูลโค้ดคำตอบที่ส่ง'}
            </Box>
          </Grid>

          {/* ฝั่งขวา: ผลลัพธ์การรัน (Console Output / Errors) สไตล์กล่องขาวสะอาดตาตามรูปที่ 2 และ 3 */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>
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
                maxHeight: '400px',
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

        {/* แถวล่าง: กล่องคำแนะนำและการประเมินจากระบบ AI สไตล์การ์ดสีขาวตามรูปที่ 2 และ 3 */}
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
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>
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

      {/* ส่วนท้าย Dialog: ปุ่มปิดหน้าต่างสีดำเข้มตามแบบดีไซน์ระบบ */}
      <DialogActions sx={{ px: 3, py: 2, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: '#0f172a',
            color: '#ffffff',
            borderRadius: '8px',
            px: 2.5,
            py: 0.8,
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#1e293b',
              boxShadow: 'none',
            },
          }}
        >
          ปิดหน้าต่าง
        </Button>
      </DialogActions>
    </Dialog>
  );
};
