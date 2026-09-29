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
} from '@mui/material';
import { X, CheckCircle2, XCircle, Terminal, AlertTriangle, Sparkles, Copy, Check } from 'lucide-react';
import type { ExerciseStudentItem } from '../../../api/reports';

interface TeacherCodeInspectionModalProps {
  open: boolean;
  onClose: () => void;
  student: ExerciseStudentItem | null;
  exerciseTitle?: string;
}

export const TeacherCodeInspectionModal: React.FC<TeacherCodeInspectionModalProps> = ({
  open,
  onClose,
  student,
  exerciseTitle,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!student || !student.latestActivity) return null;

  const activity = student.latestActivity;
  const isPassed = student.status === 'PASSED';

  const handleCopyCode = () => {
    if (activity.answer) {
      navigator.clipboard.writeText(activity.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatThaiDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return `${d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })} ${d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`;
  };

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
      {/* ส่วนหัวของ Dialog: แสดงชื่อนักศึกษา และข้อมูลการส่ง */}
      <DialogTitle sx={{ px: 3, py: 2.2, bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                {student.fullName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                (@{student.username})
              </Typography>

              {/* ชิปสถานะ Passed / Failed */}
              <Chip
                label={isPassed ? 'ผ่าน (Passed)' : 'ไม่ผ่าน (Failed)'}
                size="small"
                icon={isPassed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                sx={{
                  fontWeight: 700,
                  bgcolor: isPassed ? '#ecfdf5' : '#fff1f2',
                  color: isPassed ? '#10b981' : '#ef4444',
                  border: isPassed ? '1px solid #a7f3d0' : '1px solid #fecdd3',
                }}
              />

              {/* กล่องคะแนน */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 1.5,
                  py: 0.3,
                  bgcolor: '#eff6ff',
                  borderRadius: '6px',
                  color: '#2563eb',
                  border: '1px solid #bfdbfe',
                  fontWeight: 800,
                  fontSize: '13px',
                }}
              >
                {student.bestScore ?? activity.score ?? 0} / 100 คะแนน
              </Box>
            </Box>

            <Typography variant="caption" sx={{ color: '#64748b' }}>
              แบบฝึกหัด: <span style={{ color: '#1e293b', fontWeight: 600 }}>{exerciseTitle || 'แบบฝึกหัด'}</span>
              {' '}• สถาบัน: <span style={{ color: '#1e293b', fontWeight: 600 }}>{student.university || '-'}</span>
              {' '}• ส่งเมื่อ: <span style={{ color: '#1e293b', fontWeight: 600 }}>{formatThaiDate(student.lastSubmittedAt)}</span>
            </Typography>
          </Box>

          <IconButton onClick={onClose} size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#0f172a' } }}>
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* เนื้อหาหลัก: แบ่ง 2 คอลัมน์ (ซ้ายโค้ด Python, ขวาผลการรัน Terminal & AI Feedback) */}
      <DialogContent sx={{ p: 3, bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Grid container spacing={2.5}>
          {/* ฝั่งซ้าย: โค้ดภาษา Python ที่นักศึกษาเขียน */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                ซอร์สโค้ดภาษา Python ที่ส่งตรวจล่าสุด:
              </Typography>
              <Button
                size="small"
                variant="text"
                startIcon={copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                onClick={handleCopyCode}
                sx={{ textTransform: 'none', fontSize: '12px', fontWeight: 600, color: copied ? '#16a34a' : '#64748b' }}
              >
                {copied ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}
              </Button>
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
                minHeight: '280px',
                maxHeight: '420px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                border: '1px solid #334155',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              {activity.answer || '# ไม่พบข้อมูลโค้ด'}
            </Box>
          </Grid>

          {/* ฝั่งขวา: ผลการรัน Terminal & Error Traceback */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* ผลลัพธ์หน้าจอ Terminal */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
                  <Terminal size={16} color="#475569" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    ผลการรันจริง (Console Output):
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: '#1e293b',
                    color: '#e2e8f0',
                    p: 2,
                    borderRadius: '12px',
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    fontSize: '12.5px',
                    lineHeight: 1.5,
                    minHeight: '110px',
                    maxHeight: '160px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    border: '1px solid #334155',
                  }}
                >
                  {activity.output ? activity.output : <span style={{ color: '#64748b' }}># ไม่มีข้อความพิมพ์ออกทางหน้าจอ</span>}
                </Box>
              </Box>

              {/* ข้อความ Exception / Error Traceback */}
              {activity.exceptionMessage && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
                    <AlertTriangle size={16} color="#ef4444" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#b91c1c' }}>
                      ข้อความข้อผิดพลาด (Exception / Error Traceback):
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: '#450a0a',
                      color: '#fecaca',
                      p: 2,
                      borderRadius: '12px',
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      fontSize: '12px',
                      lineHeight: 1.5,
                      maxHeight: '140px',
                      overflowY: 'auto',
                      whiteSpace: 'pre-wrap',
                      border: '1px solid #991b1b',
                    }}
                  >
                    {activity.exceptionMessage}
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* ส่วนคำแนะนำ AI Feedback (ถ้ามี) */}
        {activity.aiFeedback && (
          <Box
            sx={{
              p: 2.2,
              borderRadius: '12px',
              bgcolor: '#f5f3ff',
              border: '1px solid #ddd6fe',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
            }}
          >
            <Sparkles size={20} color="#7c3aed" style={{ marginTop: '2px', flexShrink: 0 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#5b21b6', mb: 0.5 }}>
                คำแนะนำจากระบบ AI (AI Feedback):
              </Typography>
              <Typography variant="body2" sx={{ color: '#4c1d95', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {activity.aiFeedback}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            px: 2.5,
            bgcolor: '#0f172a',
            '&:hover': { bgcolor: '#1e293b' },
          }}
        >
          ปิดหน้าต่าง
        </Button>
      </DialogActions>
    </Dialog>
  );
};
