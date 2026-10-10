import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
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
  BookOpen,
  GraduationCap,
  Copy,
  Check,
  Building2,
} from 'lucide-react';
import type { User } from '../../../api/users';

interface UserDetailDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onEdit?: (user: User) => void;
}

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
    case 'other':
      return 'อื่นๆ';
    default:
      return gender || '-';
  }
};

const getRoleName = (roleId: number): string => {
  if (roleId === 3) return 'Admin (ผู้ดูแลระบบ)';
  if (roleId === 2) return 'Teacher (ผู้สอน)';
  return 'Student (ผู้เรียน)';
};

// สไตล์มาตรฐานสำหรับกล่องแสดงค่าแบบ Read-only ถอดแบบจากช่อง Input ใน UserDialog และ ExercisePreviewDialog
const readonlyBoxSx = {
  borderRadius: '10px',
  bgcolor: '#ffffff',
  border: '1px solid #cbd5e1',
  px: 1.75,
  minHeight: '42px',
  display: 'flex',
  alignItems: 'center',
  fontSize: '13.5px',
  color: '#0f172a',
  fontWeight: 500,
  boxSizing: 'border-box' as const,
  gap: 1.25,
  minWidth: 0,
};

// สไตล์ข้อความหัวข้อกำกับด้านบน (Top Label) ถอดแบบจาก UserDialog
const labelSx = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#334155',
  mb: 0.5,
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
};

export function UserDetailDialog({
  open,
  user,
  onClose,
  onEdit,
}: UserDetailDialogProps) {
  const [copied, setCopied] = useState(false);

  // รีเซ็ตสถานะการคัดลอกอีเมลทุกครั้งที่เปิด Dialog หรือเปลี่ยนผู้ใช้
  useEffect(() => {
    if (open) {
      setCopied(false);
    }
  }, [open, user?.userId]);

  if (!user) return null;

  const userAge = calculateAge(user.dateOfBirth);
  const fullName =
    user.firstName || user.lastName
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
      : user.username;

  const roleName = getRoleName(user.roleId);
  const avatarLetter = (
    user.firstName?.trim() ||
    user.username?.trim() ||
    'U'
  ).charAt(0).toUpperCase();

  // ฟังก์ชันคัดลอกอีเมลลงคลิปบอร์ด พร้อมดักจับข้อผิดพลาด
  const handleCopyEmail = () => {
    if (user.email) {
      navigator.clipboard
        .writeText(user.email)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          // ป้องกันข้อผิดพลาดกรณีที่เบราว์เซอร์ไม่อนุญาตการเข้าถึงคลิปบอร์ด
        });
    }
  };

  // ฟังก์ชันตรวจสอบและจัดรูปแบบค่าสถานศึกษาเพื่อป้องกันค่าว่างหรือค่าเริ่มต้นระบบ
  const formatEduValue = (val?: string): string => {
    if (!val) return 'ไม่ระบุ';
    const trimmed = val.trim();
    if (
      !trimmed ||
      trimmed === '-' ||
      trimmed === 'ไม่ระบุ' ||
      trimmed.startsWith('Default ')
    ) {
      return 'ไม่ระบุ';
    }
    return trimmed;
  };

  const displayUniversity = formatEduValue(user.education?.university);
  const displayFaculty = formatEduValue(user.education?.faculty);
  const displayMajor = formatEduValue(user.education?.major);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow:
              '0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* 1. Modal Header: รวม Avatar, ชื่อ-นามสกุล, ID, @username, สิทธิ์ และวันที่ลงทะเบียน */}
      <Box
        sx={{
          px: 3,
          py: 2.25,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Avatar ประจำตัวผู้ใช้งาน คลีนมินิมอล */}
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#f1f5f9',
              color: '#0f172a',
              fontWeight: 800,
              fontSize: '19px',
              border: '1.5px solid #e2e8f0',
              flexShrink: 0,
            }}
          >
            {avatarLetter}
          </Avatar>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: '#0f172a',
                  fontSize: '18px',
                  lineHeight: 1.25,
                }}
              >
                {fullName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  bgcolor: '#f8fafc',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  px: 0.85,
                  py: 0.2,
                  borderRadius: '5px',
                  fontWeight: 700,
                  fontSize: '11px',
                }}
              >
                ID: #{user.userId}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.35, flexWrap: 'wrap' }}>
              <Typography
                variant="body2"
                sx={{ color: '#475569', fontSize: '13px', fontWeight: 600 }}
              >
                @{user.username}
              </Typography>
              <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                •
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#334155', fontSize: '13px', fontWeight: 600 }}
              >
                {roleName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                •
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#64748b', fontSize: '12px', fontWeight: 500 }}
              >
                ลงทะเบียนเมื่อ: {formatDateTime(user.registerTimestamp)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: '#94a3b8',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            p: 0.8,
            '&:hover': { color: '#0f172a', bgcolor: '#f1f5f9' },
            transition: 'all 0.15s ease',
          }}
        >
          <X size={18} />
        </IconButton>
      </Box>

      {/* 2. เนื้อหาแบ่ง 2 หมวดหมู่: ข้อมูลส่วนบุคคล และ ข้อมูลสถานศึกษา */}
      <DialogContent
        sx={{
          p: { xs: 2.5, sm: 3 },
          bgcolor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          maxHeight: 'calc(90vh - 140px)',
          overflowY: 'auto',
        }}
      >
        {/* หมวดที่ 1: ข้อมูลส่วนบุคคล (Personal Details) */}
        <Box
          sx={{
            p: 2.5,
            bgcolor: '#f8fafc',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
            <Box
              sx={{
                p: 0.6,
                borderRadius: '8px',
                bgcolor: '#eef2ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <UserIcon size={16} />
            </Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}
            >
              ข้อมูลส่วนบุคคล (Personal Details)
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {/* ชื่อจริง */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Typography sx={labelSx}>ชื่อจริง</Typography>
                <Box sx={readonlyBoxSx}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: '#0f172a', fontSize: '13.5px' }}
                  >
                    {user.firstName || '-'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* นามสกุล */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Typography sx={labelSx}>นามสกุล</Typography>
                <Box sx={readonlyBoxSx}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: '#0f172a', fontSize: '13.5px' }}
                  >
                    {user.lastName || '-'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* อีเมล พร้อมปุ่มคัดลอก */}
            <Grid size={{ xs: 12, sm: 5 }}>
              <Box>
                <Typography sx={labelSx}>อีเมล</Typography>
                <Box sx={{ ...readonlyBoxSx, justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                    <Mail size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#0f172a',
                        fontWeight: 600,
                        fontSize: '13px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                      }}
                    >
                      {user.email || '-'}
                    </Typography>
                  </Box>
                  {user.email && (
                    <Tooltip title={copied ? 'คัดลอกแล้ว' : 'คัดลอกอีเมล'} arrow>
                      <IconButton
                        size="small"
                        onClick={handleCopyEmail}
                        sx={{
                          color: copied ? '#059669' : '#94a3b8',
                          p: 0.5,
                          flexShrink: 0,
                          '&:hover': { color: '#4f46e5', bgcolor: '#eef2ff' },
                        }}
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* เพศ */}
            <Grid size={{ xs: 12, sm: 3 }}>
              <Box>
                <Typography sx={labelSx}>เพศ</Typography>
                <Box sx={readonlyBoxSx}>
                  <Typography
                    variant="body2"
                    sx={{ color: '#0f172a', fontWeight: 600, fontSize: '13.5px' }}
                  >
                    {getGenderText(user.gender)}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* วันเกิด / อายุ */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box>
                <Typography sx={labelSx}>วันเกิด / อายุ</Typography>
                <Box sx={readonlyBoxSx}>
                  <Calendar size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <Typography
                    variant="body2"
                    sx={{ color: '#0f172a', fontWeight: 600, fontSize: '13px' }}
                  >
                    {user.dateOfBirth
                      ? `${formatDateOnly(user.dateOfBirth)}${userAge !== null ? ` (${userAge} ปี)` : ''}`
                      : '-'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* หมวดที่ 2: ข้อมูลสถานศึกษา (Education Details) */}
        <Box
          sx={{
            p: 2.5,
            bgcolor: '#f8fafc',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
            <Box
              sx={{
                p: 0.6,
                borderRadius: '8px',
                bgcolor: '#eef2ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <GraduationCap size={16} />
            </Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}
            >
              ข้อมูลสถานศึกษา (Education Details)
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {/* มหาวิทยาลัย */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box>
                <Typography sx={labelSx}>มหาวิทยาลัย</Typography>
                <Box sx={readonlyBoxSx}>
                  <Building2 size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: displayUniversity === 'ไม่ระบุ' ? '#94a3b8' : '#0f172a',
                      fontWeight: displayUniversity === 'ไม่ระบุ' ? 500 : 600,
                      fontSize: '13px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                    }}
                  >
                    {displayUniversity}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* คณะ */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box>
                <Typography sx={labelSx}>คณะ</Typography>
                <Box sx={readonlyBoxSx}>
                  <BookOpen size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: displayFaculty === 'ไม่ระบุ' ? '#94a3b8' : '#0f172a',
                      fontWeight: displayFaculty === 'ไม่ระบุ' ? 500 : 600,
                      fontSize: '13px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                    }}
                  >
                    {displayFaculty}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* สาขาวิชา */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box>
                <Typography sx={labelSx}>สาขาวิชา</Typography>
                <Box sx={readonlyBoxSx}>
                  <GraduationCap size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: displayMajor === 'ไม่ระบุ' ? '#94a3b8' : '#0f172a',
                      fontWeight: displayMajor === 'ไม่ระบุ' ? 500 : 600,
                      fontSize: '13px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                    }}
                  >
                    {displayMajor}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      {/* 3. Footer: สไตล์เดียวกับ UserDialog */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          justifyContent: 'space-between',
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: '10px',
            height: '40px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '13px',
            borderColor: '#cbd5e1',
            color: '#475569',
            px: 2.75,
            '&:hover': {
              bgcolor: '#f8fafc',
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
              borderRadius: '10px',
              height: '40px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '13px',
              bgcolor: '#4f46e5',
              color: '#ffffff',
              px: 3,
              boxShadow: 'none',
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: '#4338ca',
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
