import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  IconButton,
} from '@mui/material'
import { X } from 'lucide-react'
import { DIFFICULTY_LEVELS } from '../../../../constants/difficulty'
import type { RecentSubmissionItem } from '../TeacherDashboard'
import { formatThaiDateTime } from '../../../../utils/dateUtils'

interface TeacherCodeInspectionDialogProps {
  open: boolean
  onClose: () => void
  submission: RecentSubmissionItem | null
}

export const TeacherCodeInspectionDialog: React.FC<TeacherCodeInspectionDialogProps> = ({
  open,
  onClose,
  submission,
}) => {
  if (!submission) return null

  const isPassed = submission.status === 'PASSED'
  const diffLevel = submission.difficultyLevel || 1
  const diffMeta = DIFFICULTY_LEVELS[diffLevel] || DIFFICULTY_LEVELS[1]

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
      {/* ส่วนหัว Dialog: แสดงชื่อโจทย์ ข้อมูลผู้เรียน บทเรียน ชิปสถานะ และคะแนน */}
      <DialogTitle sx={{ px: 3, py: 2.5, bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.3, fontSize: '1.05rem' }}>
                {submission.exerciseTitle || 'แบบฝึกหัดทั่วไป'}
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
              ผู้เรียน: <span style={{ color: '#334155', fontWeight: 600 }}>{submission.studentName} (@{submission.username})</span>
              {submission.sessionName && (
                <> • บทเรียน: <span style={{ color: '#334155', fontWeight: 600 }}>{submission.sessionName}</span></>
              )}
              {submission.topic && (
                <> • หัวข้อ: <span style={{ color: '#334155', fontWeight: 600 }}>{submission.topic}</span></>
              )}
              {' '}• เวลาส่ง: <span style={{ color: '#334155', fontWeight: 600 }}>{formatThaiDateTime(submission.submittedAt)}</span>
            </Typography>
          </Box>

          {/* ป้ายสถานะฝั่งขวาบน: ประเภท, ผลลัพธ์ Passed/Failed, คะแนน และปุ่มปิด */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
            {/* ชิปประเภท: Submit หรือ Run Code */}
            <Chip
              label={submission.eventType === 'submit' ? 'Submit' : 'Run Code'}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '12px',
                bgcolor: submission.eventType === 'submit' ? '#eff6ff' : '#f1f5f9',
                color: submission.eventType === 'submit' ? '#2563eb' : '#64748b',
                border: submission.eventType === 'submit' ? '1px solid #bfdbfe' : '1px solid #cbd5e1',
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
              <Typography sx={{ fontSize: '12.5px', fontWeight: 700 }}>
                {submission.score ?? 0} / 100
              </Typography>
            </Box>

            {/* ปุ่มปิดมุมบนขวา */}
            <IconButton onClick={onClose} size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#0f172a' } }}>
              <X size={20} />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      {/* เนื้อหา Dialog: Split 2 คอลัมน์ (โค้ดฝั่งซ้าย 7 ส่วน, Terminal Output ฝั่งขวา 5 ส่วน) */}
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
              {submission.answer || '# ไม่พบข้อมูลโค้ดคำตอบที่ส่ง'}
            </Box>
          </Grid>

          {/* ฝั่งขวา: ผลลัพธ์การรันหน้าจอ Terminal (Console Output / Errors) */}
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
                color: submission.exceptionMessage ? '#dc2626' : '#334155',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              }}
            >
              {submission.exceptionMessage
                ? `[Exception / Error Occurred]\n${submission.exceptionMessage}`
                : submission.output || 'โค้ดทำงานสำเร็จ (ไม่มีข้อความ print ออกมา)'}
            </Box>
          </Grid>
        </Grid>

        {/* แถวล่าง: กล่องคำแนะนำและการประเมินจากระบบ AI */}
        {submission.aiFeedback && (
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
              {submission.aiFeedback}
            </Typography>
          </Paper>
        )}
      </DialogContent>

      {/* ส่วนท้าย Dialog: ปุ่มปิดหน้าต่างสไตล์ Royal Blue */}
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
  )
}

export default TeacherCodeInspectionDialog
