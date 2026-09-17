import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
  Chip,
  Grid,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  X,
  Edit2,
  Mail,
  User as UserIcon,
  Calendar,
  School,
  BookOpen,
  GraduationCap,
  Clock,
  Activity,
  Copy,
  Check,
} from 'lucide-react';
import type { User } from '../../../api/users';

interface UserDetailDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onEdit?: (user: User) => void;
}

/**
 * แปลงวันที่เป็นภาษาไทยแบบระบุวัน เดือน และปี พ.ศ.
 * ใช้สำหรับแสดงวันเกิดของผู้ใช้งาน
 */
const formatDateOnly = (dateStr?: string): string => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? '-'
    : d.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
};

//แปลงวันที่และเวลาเป็นภาษาไทย เพื่อให้แอดมินตรวจสอบ Timestamp ในระบบได้อย่างแม่นยำ
 
const formatDateTime = (dateStr?: string): string => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';
  return (
    d.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' น.'
  );
};

// คำนวณอายุจากวันเกิด เพื่อให้แอดมินเห็นช่วงวัยของผู้เรียนได้ทันทีโดยไม่ต้องคำนวณเอง
const calculateAge = (dobString?: string): number | null => {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
};

const getGenderText = (gender?: string): string => {
  switch (gender?.toLowerCase()) {
    case 'male':
      return 'ชาย';
    case 'female':
      return 'หญิง';
    default:
      return gender || '-';
  }
};

const getRoleBadge = (roleId: number) => {
  if (roleId === 3) {
    return {
      label: 'Admin (ผู้ดูแลระบบ)',
      color: '#e11d48',
      bg: '#ffe4e6',
      border: '#fecdd3',
    };
  }
  if (roleId === 2) {
    return {
      label: 'Teacher (ผู้สอน)',
      color: '#2563eb',
      bg: '#eff6ff',
      border: '#bfdbfe',
    };
  }
  return {
    label: 'Student (ผู้เรียน)',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
  };
};

export function UserDetailDialog({
  open,
  user,
  onClose,
  onEdit,
}: UserDetailDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const roleInfo = getRoleBadge(user.roleId);
  const userAge = calculateAge(user.dateOfBirth);

  // ฟังก์ชันคัดลอกอีเมลลงคลิปบอร์ดเพื่อความสะดวกในการปฏิบัติงานของแอดมิน
  const handleCopyEmail = () => {
    if (user.email) {
      navigator.clipboard.writeText(user.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            width: '100%',
            maxWidth: '820px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 25px 35px -5px rgba(15, 23, 42, 0.12), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* 1. ส่วนหัว Header Profile Banner: อวาตาร์ใหญ่ขึ้น, ชื่อ-นามสกุล, User ID, Username, ป้ายบทบาท และสถานะออนไลน์ */}
      <DialogTitle
        sx={{
          px: { xs: 3, sm: 4 },
          py: 2.75,
          bgcolor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar
              sx={{
                width: 62,
                height: 62,
                bgcolor: '#eff6ff',
                color: '#2563eb',
                border: '2.5px solid #bfdbfe',
                fontSize: '24px',
                fontWeight: 800,
              }}
            >
              {user.firstName?.charAt(0) ||
                user.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: '#0f172a', fontSize: '20px', lineHeight: 1.25 }}
                >
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#475569',
                    bgcolor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    px: 1,
                    py: 0.3,
                    borderRadius: '5px',
                    fontWeight: 700,
                    fontSize: '11.5px',
                  }}
                >
                  ID: #{user.userId}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.75, flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
                  @{user.username}
                </Typography>
                <Typography variant="caption" sx={{ color: '#cbd5e1' }}>•</Typography>
                
                {/* Chip บทบาท */}
                <Chip
                  label={roleInfo.label}
                  size="small"
                  sx={{
                    height: '26px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    bgcolor: roleInfo.bg,
                    color: roleInfo.color,
                    border: `1px solid ${roleInfo.border}`,
                    px: 0.5,
                  }}
                />

                {/* สถานะการเชื่อมต่อ */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                    bgcolor: user.isOnline ? '#ecfdf5' : '#f1f5f9',
                    px: 1.2,
                    py: 0.3,
                    borderRadius: '6px',
                    border: `1px solid ${user.isOnline ? '#a7f3d0' : '#e2e8f0'}`,
                  }}
                >
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      bgcolor: user.isOnline ? '#10b981' : '#94a3b8',
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: user.isOnline ? '#059669' : '#64748b',
                      fontWeight: 600,
                      fontSize: '12px',
                    }}
                  >
                    {user.isOnline ? 'ออนไลน์' : 'ออฟไลน์'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              bgcolor: '#ffffff',
              p: 1,
              '&:hover': { bgcolor: '#f1f5f9', color: '#0f172a' },
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* 2. Content: สเกลช่องข้อมูล Field Tiles ให้โปร่งและตัวหนังสือใหญ่ขึ้น */}
      <DialogContent
        sx={{
          px: { xs: 3, sm: 4 },
          pt: { xs: '18px !important', sm: '22px !important' },
          pb: { xs: '24px !important', sm: '28px !important' },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* หมวดที่ 1: ข้อมูลส่วนบุคคล */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              mb: 1.5,
              display: 'block',
              fontSize: '12.5px',
            }}
          >
            ข้อมูลส่วนบุคคล (Personal Details)
          </Typography>
          <Grid container spacing={2}>
            {/* อีเมล พร้อมปุ่ม Copy */}
            <Grid size={{ xs: 12, sm: 5 }}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography
                    variant="caption"
                    sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.9, fontWeight: 600, fontSize: '12.5px' }}
                  >
                    <Mail size={15} color="#2563eb" /> อีเมลติดต่อ
                  </Typography>
                  <Tooltip title={copied ? 'คัดลอกแล้ว' : 'คัดลอกอีเมล'} arrow>
                    <IconButton
                      size="small"
                      onClick={handleCopyEmail}
                      sx={{ p: 0.4, color: '#94a3b8', '&:hover': { color: '#2563eb', bgcolor: '#eff6ff' } }}
                    >
                      {copied ? <Check size={15} color="#059669" /> : <Copy size={15} />}
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: '#0f172a', mt: 0.75, wordBreak: 'break-all', fontSize: '15px' }}
                >
                  {user.email || '-'}
                </Typography>
              </Box>
            </Grid>

            {/* เพศ */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  height: '100%',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.9, fontWeight: 600, fontSize: '12.5px' }}
                >
                  <UserIcon size={15} color="#2563eb" /> เพศ
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mt: 0.75, fontSize: '15px' }}>
                  {getGenderText(user.gender)}
                </Typography>
              </Box>
            </Grid>

            {/* วันเกิดและอายุ */}
            <Grid size={{ xs: 6, sm: 4 }}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  height: '100%',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.9, fontWeight: 600, fontSize: '12.5px' }}
                >
                  <Calendar size={15} color="#2563eb" /> วันเกิด / อายุ
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#0f172a',
                    mt: 0.75,
                    fontSize: '15px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.dateOfBirth
                    ? `${formatDateOnly(user.dateOfBirth)}${userAge !== null ? ` (${userAge} ปี)` : ''}`
                    : '-'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* หมวดที่ 2: สังกัดและการศึกษา */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              mb: 1.5,
              display: 'block',
              fontSize: '12.5px',
            }}
          >
            สังกัดและการศึกษา (Education)
          </Typography>
          <Box sx={{ p: 2.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.9, fontWeight: 600, fontSize: '12.5px' }}
              >
                <School size={16} color="#2563eb" /> มหาวิทยาลัย / สถาบันการศึกษา
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', mt: 0.5, fontSize: '15.5px' }}>
                {user.education?.university || 'ไม่ได้ระบุสถานศึกษา'}
              </Typography>
            </Box>

            <Grid container spacing={2.5} sx={{ pt: 2, borderTop: '1px solid #e2e8f0' }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="caption"
                  sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.9, fontWeight: 600, fontSize: '12.5px' }}
                >
                  <BookOpen size={15} color="#64748b" /> คณะ
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mt: 0.5, fontSize: '15px' }}>
                  {user.education?.faculty || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="caption"
                  sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.9, fontWeight: 600, fontSize: '12.5px' }}
                >
                  <GraduationCap size={15} color="#64748b" /> สาขาวิชา
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mt: 0.5, fontSize: '15px' }}>
                  {user.education?.major || '-'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* หมวดที่ 3: ประวัติและสถานะระบบ */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              mb: 1.5,
              display: 'block',
              fontSize: '12.5px',
            }}
          >
            ประวัติการใช้งานระบบ (System Logs)
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: 2, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                <Typography
                  variant="caption"
                  sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.9, fontWeight: 600, fontSize: '12.5px' }}
                >
                  <Clock size={15} color="#64748b" /> วันที่ลงทะเบียนเข้าระบบ
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mt: 0.5, fontSize: '14.5px' }}>
                  {formatDateTime(user.registerTimestamp)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: 2, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                <Typography
                  variant="caption"
                  sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.9, fontWeight: 600, fontSize: '12.5px' }}
                >
                  <Activity size={15} color="#64748b" /> การเข้าใช้งานล่าสุด
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mt: 0.5, fontSize: '14.5px' }}>
                  {user.lastActiveAt ? formatDateTime(user.lastActiveAt) : 'ยังไม่เคยเข้าสู่ระบบ'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      {/* 3. Actions: ปุ่มปิด และปุ่มแก้ไขตามมาตรฐาน MUI System ขนาดใหญ่ขึ้น */}
      <DialogActions
        sx={{
          px: { xs: 3, sm: 4 },
          py: 2.5,
          bgcolor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          justifyContent: 'space-between',
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: '9px',
            color: '#475569',
            borderColor: '#cbd5e1',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '14px',
            px: 3,
            py: 0.9,
            '&:hover': {
              bgcolor: '#f1f5f9',
              borderColor: '#94a3b8',
            },
          }}
        >
          ปิดหน้าต่าง
        </Button>
        {onEdit && (
          <Button
            onClick={() => onEdit(user)}
            variant="contained"
            startIcon={<Edit2 size={16} />}
            sx={{
              borderRadius: '9px',
              bgcolor: '#2563eb',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              px: 3,
              py: 0.9,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#1d4ed8',
                boxShadow: 'none',
              },
            }}
          >
            แก้ไขข้อมูลผู้ใช้
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
