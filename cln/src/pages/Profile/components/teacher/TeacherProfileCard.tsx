import { Box, Card, Avatar, Typography, Grid, Divider } from '@mui/material';
import {
  User,
  Mail,
  Calendar,
  School,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

export interface TeacherProfileCardProps {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  university: string;
  faculty: string;
  major: string;
  registerTimestamp?: string;
  formatDate: (date?: string) => string;
  roleName?: string;
}

export function TeacherProfileCard({
  username,
  firstName,
  lastName,
  email,
  gender,
  dateOfBirth,
  university,
  faculty,
  major,
  registerTimestamp,
  formatDate,
  roleName = 'Teacher',
}: TeacherProfileCardProps) {

  // แปลงค่ารหัสเพศเป็นข้อความที่เข้าใจง่าย
  const displayGender = () => {
    if (!gender) return '-';
    const lower = gender.toLowerCase();
    if (lower === 'male') return 'ชาย (Male)';
    if (lower === 'female') return 'หญิง (Female)';
    if (lower === 'other') return 'อื่นๆ (Other)';
    return gender;
  };

  // ดึงตัวอักษรแรกเพื่อแสดงผล Avatar สัญลักษณ์ชื่อ
  const avatarLetter = (firstName?.trim() || username || 'T').charAt(0).toUpperCase();
  const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : username;

  return (
    <Card
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        boxShadow: 'none',
        width: '100%',
      }}
    >
      {/* 1. ส่วนหัวโปรไฟล์: แสดง Avatar ประจำตัวอาจารย์, ชื่อ-นามสกุล, Username, Role Badge และวันที่สมัคร */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3.5 }}>
        <Avatar
          sx={{
            width: { xs: 72, sm: 84 },
            height: { xs: 72, sm: 84 },
            bgcolor: '#2563eb', // สีน้ำเงินมาตรฐานสำหรับอาจารย์ผู้สอน
            color: '#ffffff',
            fontSize: { xs: '1.85rem', sm: '2.25rem' },
            fontWeight: 800,
            border: '4px solid #dbeafe',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.2)',
            flexShrink: 0,
          }}
        >
          {avatarLetter}
        </Avatar>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
              {fullName}
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
            @{username} • <span style={{ color: '#2563eb', fontWeight: 700 }}>{roleName}</span>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
              เป็นสมาชิกตั้งแต่: {formatDate(registerTimestamp)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* เส้นแบ่งคั่นส่วนหัวกับเนื้อหาข้อมูล */}
      <Divider sx={{ mb: 3.5, borderColor: '#f1f5f9' }} />

      {/* 2. กริด 2 คอลัมน์: ข้อมูลส่วนตัว (ซ้าย) และ ข้อมูลสังกัดวิชาการ (ขวา) */}
      <Grid container spacing={4}>
        {/* คอลัมน์ที่ 1: ข้อมูลส่วนตัว */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                mb: 0.5,
              }}
            >
              <Box
                sx={{
                  p: 0.65,
                  borderRadius: '8px',
                  bgcolor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
              ข้อมูลส่วนตัว
            </Typography>

            {/* อีเมล */}
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                bgcolor: '#F8FAFC',
                border: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: '#F1F5F9' },
              }}
            >
              <Box sx={{ color: '#2563eb', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} />
              </Box>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  อีเมลติดต่อ
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', wordBreak: 'break-all' }}>
                  {email || '-'}
                </Typography>
              </Box>
            </Box>

            {/* เพศ */}
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                bgcolor: '#F8FAFC',
                border: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: '#F1F5F9' },
              }}
            >
              <Box sx={{ color: '#2563eb', display: 'flex', alignItems: 'center' }}>
                <User size={18} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  เพศ
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {displayGender()}
                </Typography>
              </Box>
            </Box>

            {/* วันเกิด */}
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                bgcolor: '#F8FAFC',
                border: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: '#F1F5F9' },
              }}
            >
              <Box sx={{ color: '#2563eb', display: 'flex', alignItems: 'center' }}>
                <Calendar size={18} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  วันเกิด
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {formatDate(dateOfBirth)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* คอลัมน์ที่ 2: ข้อมูลสังกัดวิชาการและการศึกษา */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                mb: 0.5,
              }}
            >
              <Box
                sx={{
                  p: 0.65,
                  borderRadius: '8px',
                  bgcolor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
              ข้อมูลสังกัดวิชาการ
            </Typography>

            {/* สถาบันการศึกษา / มหาวิทยาลัย */}
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                bgcolor: '#F8FAFC',
                border: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: '#F1F5F9' },
              }}
            >
              <Box sx={{ color: '#2563eb', display: 'flex', alignItems: 'center' }}>
                <School size={18} />
              </Box>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  สถาบันการศึกษา
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {university || '-'}
                </Typography>
              </Box>
            </Box>

            {/* คณะ / ส่วนงาน */}
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                bgcolor: '#F8FAFC',
                border: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: '#F1F5F9' },
              }}
            >
              <Box sx={{ color: '#2563eb', display: 'flex', alignItems: 'center' }}>
                <BookOpen size={18} />
              </Box>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  คณะ / ส่วนงาน
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {faculty || '-'}
                </Typography>
              </Box>
            </Box>

            {/* สาขาวิชา / ภาควิชา */}
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                bgcolor: '#F8FAFC',
                border: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: '#F1F5F9' },
              }}
            >
              <Box sx={{ color: '#2563eb', display: 'flex', alignItems: 'center' }}>
                <GraduationCap size={18} />
              </Box>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  สาขาวิชา / ภาควิชา
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {major || '-'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
