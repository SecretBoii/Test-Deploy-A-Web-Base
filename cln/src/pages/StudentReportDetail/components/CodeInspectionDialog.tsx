import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Button, Grid, Paper, Chip, IconButton
} from '@mui/material';
import {
  X, Code, Terminal, Sparkles,
  CheckCircle, XCircle, Award
} from 'lucide-react';
import type { StudentActivityItem } from '../../../api/reports';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';

interface CodeInspectionDialogProps {
  open: boolean;
  onClose: () => void;
  activity: StudentActivityItem | null;
}

export function CodeInspectionDialog({ open, onClose, activity }: CodeInspectionDialogProps) {
  if (!activity) return null;

  const isPassed = activity.score >= 80;
  const diffLevel = activity.exercise?.difficultyLevel || 1;
  const diffMeta = DIFFICULTY_LEVELS[diffLevel] || DIFFICULTY_LEVELS[1];

  // ฟังก์ชันช่วยจัดรูปแบบวันที่และเวลาภาษาไทย
  const formatThaiDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return `${d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' })} ${d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`;
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
      {/* ส่วนหัว Dialog: แสดงชื่อโจทย์ ข้อมูลบทเรียน และชิปสถานะต่างๆ */}
      <DialogTitle sx={{ px: 3, py: 2.5, bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                {activity.exercise?.title || 'แบบฝึกหัดทั่วไป'}
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
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              บทเรียน: <span style={{ color: '#334155', fontWeight: 600 }}>{activity.session?.sessionName || '-'}</span>
              {activity.exercise?.topic && (
                <> • หัวข้อ: <span style={{ color: '#334155', fontWeight: 600 }}>{activity.exercise.topic}</span></>
              )}
              {' '}• เวลาส่ง: <span style={{ color: '#334155', fontWeight: 600 }}>{formatThaiDateTime(activity.submittedAt)}</span>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
            {/* ชิปประเภท: Submit หรือ Run Code */}
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

            {/* ชิปสถานะ Passed / Failed */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.6,
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
              {isPassed ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {isPassed ? 'Passed' : 'Failed'}
            </Box>

            {/* กล่องคะแนน */}
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
              <Award size={14} />
              <Typography sx={{ fontSize: '13px', fontWeight: 800 }}>
                {activity.score} / 100
              </Typography>
            </Box>

            {/* ปุ่มปิดมุมบนขวา */}
            <IconButton onClick={onClose} size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#0f172a' } }}>
              <X size={20} />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      {/* เนื้อหา Dialog: Split 2 คอลัมน์ (โค้ดฝั่งซ้าย, ผลลัพธ์ฝั่งขวา) และ AI Feedback ด้านล่าง */}
      <DialogContent sx={{ p: 3, bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Grid container spacing={2.5}>
          {/* ฝั่งซ้าย: ซอร์สโค้ดภาษา Python */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Code size={18} color="#2563eb" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
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
              {activity.answer || '# ไม่พบข้อมูลโค้ดที่ส่ง'}
            </Box>
          </Grid>

          {/* ฝั่งขวา: ผลลัพธ์การรันหน้าจอ Terminal */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Terminal size={18} color="#d97706" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
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

        {/* แถวล่าง: กล่องคำแนะนำและการวิเคราะห์จากระบบ AI */}
        {activity.aiFeedback && (
          <Paper
            sx={{
              p: 2.5,
              bgcolor: '#faf5ff',
              border: '1px solid #e9d5ff',
              borderRadius: '12px',
              boxShadow: 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Sparkles size={18} color="#7c3aed" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6b21a8' }}>
                คำแนะนำและการประเมินจากระบบ AI:
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#581c87', fontSize: '13.5px', lineHeight: 1.65 }}>
              {activity.aiFeedback}
            </Typography>
          </Paper>
        )}
      </DialogContent>

      {/* ส่วนท้าย Dialog: ปุ่มปิด */}
      <DialogActions sx={{ px: 3, py: 2, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0', justifyContent: 'flex-end' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: '#2563eb',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '13px',
            borderRadius: '8px',
            px: 3,
            py: 0.8,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' },
          }}
        >
          ปิดหน้าต่าง
        </Button>
      </DialogActions>
    </Dialog>
  );
}
