import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmColor?: 'error' | 'success' | 'primary'
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmColor = 'primary',
}) => {
  // Determine confirm button style based on color prop
  const getButtonProps = () => {
    if (confirmColor === 'error') {
      return {
        bgcolor: '#ef4444',
        hoverBg: '#dc2626',
        color: '#ffffff',
      }
    }
    // Default green
    return {
      bgcolor: '#10b981',
      hoverBg: '#059669',
      color: '#ffffff',
    }
  }

  const btnMeta = getButtonProps()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { borderRadius: '16px', p: 1, border: '1px solid #e2e8f0' }
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#64748b', fontSize: '14px' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 700,
            color: '#64748b',
            borderColor: '#cbd5e1',
            '&:hover': {
              borderColor: '#94a3b8',
              bgcolor: '#f8fafc',
            }
          }}
        >
          ยกเลิก
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 700,
            bgcolor: btnMeta.bgcolor,
            color: btnMeta.color,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: btnMeta.hoverBg,
              boxShadow: 'none',
            }
          }}
        >
          ยืนยัน
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog;
