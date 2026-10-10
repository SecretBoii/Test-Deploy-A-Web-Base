import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  IconButton,
  Chip
} from '@mui/material'
import { X, SendHorizonal, PlayCircle, BookOpen, Info } from 'lucide-react'

interface ConfirmSubmitDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  exerciseTitle?: string
  runCount?: number
}

export const ConfirmSubmitDialog: React.FC<ConfirmSubmitDialogProps> = ({
  open,
  onClose,
  onConfirm,
  exerciseTitle = 'โจทย์แบบฝึกหัด Python',
  runCount = 0
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="submit-dialog-title"
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            p: 3,
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.12)',
            border: '1px solid #f1f5f9',
            position: 'relative'
          }
        }
      }}
    >
      {/* ปุ่มปิดมุมบนขวา เพื่อให้ผู้เรียนสามารถปิด Dialog ได้อย่างรวดเร็ว */}
      <IconButton
        onClick={onClose}
        size="small"
        aria-label="close"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: '#94a3b8',
          transition: 'all 0.2s ease',
          '&:hover': { color: '#475569', bgcolor: '#f8fafc' }
        }}
      >
        <X size={18} />
      </IconButton>

      {/* ส่วนหัวเรื่องและไอคอน Soft Aura เพื่อสร้างความโดดเด่นแต่ยังดูสบายตา */}
      <Box sx={{ textAlign: 'center', pt: 1, pb: 2 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 2,
            borderRadius: '18px',
            bgcolor: 'rgba(99, 102, 241, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6366f1',
            boxShadow: 'inset 0 0 0 1px rgba(99, 102, 241, 0.12)'
          }}
        >
          <SendHorizonal size={28} />
        </Box>
        <DialogTitle
          id="submit-dialog-title"
          sx={{
            p: 0,
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#0f172a',
            fontFamily: 'inherit'
          }}
        >
          ยืนยันการส่งคำตอบ?
        </DialogTitle>
        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            mt: 0.5,
            fontFamily: 'inherit',
            lineHeight: 1.5
          }}
        >
          คุณต้องการส่งผลงานสำหรับโจทย์ข้อนี้เพื่อรับการตรวจใช่หรือไม่?
        </Typography>
      </Box>

      {/* สรุปข้อมูลโจทย์และสถานะการทดสอบรันโค้ด */}
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            bgcolor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5
          }}
        >
          {/* ข้อมูลโจทย์ */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                p: 0.8,
                bgcolor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6366f1'
              }}
            >
              <BookOpen size={16} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: '#64748b', fontWeight: 600, display: 'block', fontFamily: 'inherit' }}
              >
                โจทย์แบบฝึกหัด
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontFamily: 'inherit'
                }}
                title={exerciseTitle}
              >
                {exerciseTitle}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ height: '1px', bgcolor: '#e2e8f0' }} />

          {/* สถิติการทดสอบรันโค้ด */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
              <PlayCircle size={16} />
              <Typography variant="caption" sx={{ fontWeight: 600, fontFamily: 'inherit' }}>
                จำนวนการทดสอบรันโค้ด
              </Typography>
            </Box>
            <Chip
              label={`${runCount} ครั้ง`}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '12px',
                bgcolor: '#f1f5f9',
                color: '#475569',
                border: '1px solid #e2e8f0',
                height: '24px',
                fontFamily: 'inherit'
              }}
            />
          </Box>
        </Box>

        {/* แถบแจ้งข้อมูลเพื่อย้ำให้ผู้เรียนทราบผลที่จะเกิดขึ้นหลังกดส่ง */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.2,
            bgcolor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            p: 1.5,
            mt: 2
          }}
        >
          <Info size={16} color="#6366f1" style={{ marginTop: '2px', flexShrink: 0 }} />
          <Typography
            variant="caption"
            sx={{
              color: '#64748b',
              lineHeight: 1.5,
              fontWeight: 500,
              fontFamily: 'inherit'
            }}
          >
            เมื่อส่งคำตอบแล้ว ระบบจะประเมินคะแนนทันทีและบันทึกลงในสถิติการเรียนของคุณ
          </Typography>
        </Box>

        {/* ปุ่มควบคุม (Action Buttons) */}
        <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            fullWidth
            sx={{
              py: 1.2,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              color: '#64748b',
              borderColor: '#cbd5e1',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: '#f8fafc', borderColor: '#94a3b8', color: '#475569' }
            }}
          >
            ยกเลิก
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            fullWidth
            endIcon={<SendHorizonal size={16} />}
            sx={{
              py: 1.2,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              fontFamily: 'inherit',
              bgcolor: '#4f46e5',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: '#4338ca',
                boxShadow: '0 6px 16px rgba(79, 70, 229, 0.35)',
                transform: 'translateY(-1px)'
              },
              '&:active': {
                transform: 'translateY(1px)'
              }
            }}
          >
            ยืนยันส่งคำตอบ
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmSubmitDialog
