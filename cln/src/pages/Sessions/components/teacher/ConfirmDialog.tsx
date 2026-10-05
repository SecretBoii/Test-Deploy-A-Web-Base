import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  confirmText?: string;
  confirmColor?: 'primary' | 'error' | 'success';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'ยืนยันการดำเนินการ',
  message = 'คุณแน่ใจหรือไม่ว่าต้องการดำเนินการนี้?',
  confirmText,
  confirmColor = 'primary',
  loading = false,
}) => {
  const isError = confirmColor === 'error';
  const defaultConfirmText = isError ? 'ยืนยันการลบ' : 'ยืนยัน';
  const buttonText = confirmText || defaultConfirmText;

  const btnBgColor = isError ? '#ef4444' : '#4f46e5';
  const btnHoverBgColor = isError ? '#dc2626' : '#4338ca';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{ zIndex: 1400 }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            p: 1,
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            maxWidth: '90vw',
            width: 'fit-content',
            minWidth: '380px',
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', pb: 1 }}>
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
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
            },
          }}
        >
          ยกเลิก
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 700,
            bgcolor: btnBgColor,
            color: '#ffffff',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: btnHoverBgColor,
              boxShadow: 'none',
            },
          }}
        >
          {loading ? 'กำลังดำเนินการ...' : buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
