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
  Chip,
  IconButton,
} from '@mui/material';
import { X } from 'lucide-react';
import { type AuditLogItem, getActionStyle } from '../../../api/auditlogApi';

interface AuditLogDetailDialogProps {
  selectedLog: AuditLogItem | null;
  onClose: () => void;
}

export const AuditLogDetailDialog: React.FC<AuditLogDetailDialogProps> = ({ selectedLog, onClose }) => {
  if (!selectedLog) return null;

  // กำหนดสี Action Chip จากฟังก์ชันกลาง เพื่อให้เป็น Solid Color สีเดียวกับปุ่มและรายการด้านนอก
  const getActionChip = (action: string) => {
    const config = getActionStyle(action);
    return (
      <Chip
        label={action}
        size="small"
        sx={{
          fontWeight: 700,
          fontSize: '0.75rem',
          bgcolor: config.chipBg,
          color: config.chipColor,
          borderRadius: '6px',
        }}
      />
    );
  };

  // ฟังก์ชันแปลงฟิลด์ใน details เป็นหัวข้อและข้อความภาษาไทย
  const formatDetailItem = (key: string, value: unknown): { label: string; text: string } | null => {
    if (value === undefined || value === null || value === '') return null;

    switch (key) {
      case 'method':
        return {
          label: 'ช่องทางยืนยันตัวตน:',
          text: value === 'PASSWORD' ? 'เข้าสู่ระบบด้วยรหัสผ่าน (Password)' : String(value),
        };
      case 'roleId': {
        const roleNames: Record<number, string> = {
          1: 'นักศึกษา (Student)',
          2: 'อาจารย์ผู้สอน (Teacher)',
          3: 'ผู้ดูแลระบบ (Admin)',
        };
        return {
          label: 'สิทธิ์การใช้งาน:',
          text: roleNames[Number(value)] || `Role #${value}`,
        };
      }
      case 'reason':
        return {
          label: 'สาเหตุการทำรายการ:',
          text: value === 'USER_LOGOUT' ? 'ผู้ใช้ออกจากระบบ (User Logout)' : String(value),
        };
      case 'email':
        return { label: 'อีเมล:', text: String(value) };
      case 'gender':
        return {
          label: 'เพศ:',
          text: value === 'MALE' ? 'ชาย' : value === 'FEMALE' ? 'หญิง' : String(value),
        };
      case 'createdUsername':
        return { label: 'ชื่อบัญชีที่สร้าง:', text: String(value) };
      case 'targetUsername':
        return { label: 'ชื่อบัญชีเป้าหมาย:', text: String(value) };
      case 'deletedUserId':
        return { label: 'รหัสผู้ใช้ที่ถูกลบ:', text: `#${value}` };
      case 'deletedExerciseId':
        return { label: 'รหัสแบบฝึกหัดที่ถูกลบ:', text: `#${value}` };
      case 'sessionId':
        return { label: 'รหัสเซสชัน:', text: `#${value}` };
      case 'name':
        return { label: 'ชื่อรายการ/เซสชัน:', text: String(value) };
      case 'title':
        return { label: 'ชื่อแบบฝึกหัด:', text: String(value) };
      case 'topic':
        return { label: 'หมวดหมู่วิชา:', text: String(value) };
      case 'difficulty':
      case 'difficultyLevel':
        return { label: 'ระดับความยาก:', text: `ระดับ ${value}` };
      case 'targetLevel':
        return { label: 'ระดับกลุ่มเป้าหมาย:', text: String(value) };
      case 'status':
        return { label: 'สถานะ:', text: String(value) };
      case 'runCount':
        return { label: 'จำนวนครั้งที่รันโค้ด:', text: `${value} ครั้ง` };
      case 'hintUsed':
        return { label: 'การใช้คำใบ้:', text: value ? 'มีการขอคำใบ้' : 'ไม่ได้ขอคำใบ้' };
      case 'updatedFields':
        return {
          label: 'ฟิลด์ที่ถูกแก้ไข:',
          text: Array.isArray(value) ? value.join(', ') : String(value),
        };
      default:
        if (typeof value === 'object' && value !== null) {
          return null;
        }
        return { label: `${key}:`, text: String(value) };
    }
  };

  // รวมรายการข้อมูลเพิ่มเติมที่แปลงแล้ว
  const detailItems = selectedLog.details && typeof selectedLog.details === 'object' && !Array.isArray(selectedLog.details)
    ? Object.entries(selectedLog.details as Record<string, unknown>)
        .map(([k, v]) => formatDetailItem(k, v))
        .filter((item): item is { label: string; text: string } => item !== null)
    : [];

  return (
    <Dialog
      open={Boolean(selectedLog)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          },
        },
      }}
    >
      {/* ส่วนหัวของหน้าต่าง */}
      <DialogTitle
        sx={{
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
          รายละเอียดบันทึก Log #{selectedLog.id}
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: '#94a3b8' }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      {/* รายการข้อมูลทั้งหมดในรูปแบบข้อความภาษาไทย */}
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          {/* แถว: ผู้ใช้งาน */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0.8,
              borderBottom: '1px dashed #e2e8f0',
            }}
          >
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              ผู้ใช้งาน (User):
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {selectedLog.fullName || selectedLog.username || 'System Administrator'}
              {selectedLog.roleName && (
                <Typography component="span" sx={{ fontWeight: 600, color: '#64748b', ml: 0.5 }}>
                  ({selectedLog.roleName})
                </Typography>
              )}
            </Typography>
          </Box>

          {/* แถว: การกระทำ */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0.8,
              borderBottom: '1px dashed #e2e8f0',
            }}
          >
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              การกระทำ (Action):
            </Typography>
            {getActionChip(selectedLog.action)}
          </Box>

          {/* แถว: เป้าหมาย */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0.8,
              borderBottom: '1px dashed #e2e8f0',
            }}
          >
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              เป้าหมาย (Entity):
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
              {selectedLog.entity} {selectedLog.entityId ? `(#${selectedLog.entityId})` : ''}
            </Typography>
          </Box>

          {/* แถว: เวลาที่ทำรายการ */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0.8,
              borderBottom: detailItems.length > 0 ? '1px dashed #e2e8f0' : 'none',
            }}
          >
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              เวลาที่ทำรายการ:
            </Typography>
            <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
              {new Date(selectedLog.createdAt).toLocaleString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </Typography>
          </Box>

          {/* แถวข้อมูลเพิ่มเติมที่แปลงเป็นภาษาไทยทั้งหมด (ไม่มีกล่อง JSON) */}
          {detailItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 0.8,
                borderBottom: index === detailItems.length - 1 ? 'none' : '1px dashed #e2e8f0',
              }}
            >
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                {item.label}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                {item.text}
              </Typography>
            </Box>
          ))}
        </Stack>
      </DialogContent>

      {/* ปุ่มกดด้านล่าง */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #f1f5f9' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: '#0f172a',
            color: '#ffffff',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            px: 2.5,
            '&:hover': { bgcolor: '#1e293b' },
          }}
        >
          ปิดหน้าต่าง
        </Button>
      </DialogActions>
    </Dialog>
  );
};