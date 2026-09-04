import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
} from '@mui/material';
import { type AuditLogItem } from '../../../api/auditlogApi';

interface AuditLogDetailDialogProps {
  selectedLog: AuditLogItem | null;
  onClose: () => void;
}

/**
 * Subcomponent Modal สำหรับแสดง JSON Payload Details
 */
export const AuditLogDetailDialog: React.FC<AuditLogDetailDialogProps> = ({ selectedLog, onClose }) => {
  return (
    <Dialog open={Boolean(selectedLog)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>รายละเอียด Log #{selectedLog?.id}</DialogTitle>
      <DialogContent dividers>
        {selectedLog && (
          <Stack spacing={2}>
            <Typography variant="subtitle2">User Agent: {selectedLog.userAgent || '-'}</Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Details Payload (JSON):
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: '#1e1e1e',
                color: '#00ff66',
                borderRadius: 1,
                fontSize: '0.85rem',
                overflowX: 'auto',
              }}
            >
              {JSON.stringify(selectedLog.details, null, 2)}
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ปิดหน้าต่าง</Button>
      </DialogActions>
    </Dialog>
  );
};