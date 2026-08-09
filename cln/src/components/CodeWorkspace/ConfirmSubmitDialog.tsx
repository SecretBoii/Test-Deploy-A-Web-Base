import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { X, Send, RotateCw, AlertCircle, FileText } from 'lucide-react'

interface ConfirmSubmitDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  exerciseTitle?: string
  runCount?: number
}

const StyledDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    borderRadius: '24px',
    padding: '32px 24px 24px 24px',
    maxWidth: '440px',
    width: '100%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    position: 'relative',
    overflow: 'visible',
    background: 'linear-gradient(to bottom, #ffffff 0%, #fcfdff 100%)'
  }
}))

const CloseIconButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: '20px',
  right: '20px',
  color: '#94a3b8',
  padding: '6px',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#475569',
    backgroundColor: '#f1f5f9'
  }
}))

const IconOuterCircle = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'rgba(99, 102, 241, 0.05)',
  margin: '0 auto 20px auto',
  border: '1px solid rgba(99, 102, 241, 0.1)',
  boxShadow: '0 0 20px rgba(99, 102, 241, 0.05)',
  position: 'relative'
}))

const IconInnerCircle = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  color: '#ffffff',
  boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
}))

const DetailCard = styled(Box)(() => ({
  flex: 1,
  backgroundColor: '#f8fafc',
  borderRadius: '16px',
  padding: '12px 16px',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '4px',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#cbd5e1',
    backgroundColor: '#f1f5f9'
  }
}))

const WarningAlert = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  backgroundColor: '#fffbeb',
  border: '1px solid #fef3c7',
  borderRadius: '12px',
  padding: '12px 16px',
  marginTop: '16px',
  textAlign: 'left'
}))

const PremiumConfirmButton = styled(Button)(() => ({
  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  color: '#ffffff',
  fontWeight: 700,
  fontSize: '14px',
  textTransform: 'none',
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid rgba(99, 102, 241, 0.2)',
  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
    boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)',
    transform: 'translateY(-1px)'
  },
  '&:active': {
    transform: 'translateY(1px)'
  }
}))

const PremiumCancelButton = styled(Button)(() => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '14px',
  borderColor: '#e2e8f0',
  color: '#64748b',
  padding: '12px',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#cbd5e1',
    color: '#475569',
    backgroundColor: '#f8fafc'
  }
}))

export const ConfirmSubmitDialog: React.FC<ConfirmSubmitDialogProps> = ({
  open,
  onClose,
  onConfirm,
  exerciseTitle = 'โจทย์แบบฝึกหัด Python',
  runCount = 0
}) => {
  return (
    <StyledDialog open={open} onClose={onClose} aria-labelledby="submit-dialog-title">
      <CloseIconButton onClick={onClose} aria-label="close">
        <X size={16} />
      </CloseIconButton>

      <Box sx={{ textAlign: 'center' }}>
        <IconOuterCircle>
          <IconInnerCircle>
            <Send size={24} />
          </IconInnerCircle>
        </IconOuterCircle>
        <DialogTitle
          id="submit-dialog-title"
          sx={{
            fontWeight: 800,
            fontSize: '1.3rem',
            color: '#0f172a',
            p: 0,
            mb: 1.5,
            fontFamily: 'inherit'
          }}
        >
          ยืนยันการส่งคำตอบ?
        </DialogTitle>
      </Box>

      <DialogContent sx={{ p: 0, textAlign: 'center' }}>
        <DialogContentText
          sx={{
            color: '#64748b',
            fontSize: '14px',
            lineHeight: 1.6,
            fontFamily: 'inherit',
            mb: 2.5
          }}
        >
          คุณต้องการส่งคำตอบสำหรับโจทย์ข้อนี้ใช่หรือไม่?
        </DialogContentText>

        {/* Side-by-Side Detailed Metadata Cards */}
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <DetailCard>
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'inherit'
              }}
            >
              <FileText size={13} style={{ color: '#6366f1' }} /> โจทย์ที่ส่ง
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 800,
                color: '#0f172a',
                fontFamily: 'inherit',
                width: '100%',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                mt: 0.5
              }}
              title={exerciseTitle}
            >
              {exerciseTitle}
            </Typography>
          </DetailCard>

          <DetailCard>
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'inherit'
              }}
            >
              <RotateCw size={13} style={{ color: '#0284c7' }} /> ทดสอบรันโค้ด
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 800,
                color: '#0369a1',
                fontFamily: 'inherit',
                textAlign: 'left',
                mt: 0.5
              }}
            >
              {runCount} ครั้ง
            </Typography>
          </DetailCard>
        </Box>

        {/* Solid Softer Warning Notice */}
        <WarningAlert>
          <AlertCircle size={16} color="#d97706" style={{ marginTop: '2px', flexShrink: 0 }} />
          <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 600, fontFamily: 'inherit', lineHeight: 1.4 }}>
            หลังจากยืนยันการส่งแล้ว ระบบจะบันทึกข้อมูลเพื่อเป็นผลคะแนนทางการของคุณทันที
          </Typography>
        </WarningAlert>

        {/* Action Buttons Row */}
        <Box sx={{ display: 'flex', gap: 1.5, mt: 3, width: '100%' }}>
          <PremiumCancelButton onClick={onClose} variant="outlined" sx={{ flex: 1 }}>
            ยกเลิก
          </PremiumCancelButton>
          <PremiumConfirmButton onClick={onConfirm} variant="contained" startIcon={<Send size={14} />} sx={{ flex: 1.2 }}>
            ยืนยันส่งคำตอบ
          </PremiumConfirmButton>
        </Box>
      </DialogContent>
    </StyledDialog>
  )
}

export default ConfirmSubmitDialog
