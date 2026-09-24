import { Box, Card, Avatar, Typography, Grid } from '@mui/material';
import { User, Mail, Calendar, School, BookOpen, GraduationCap } from 'lucide-react';

/**
 * กำหนดประเภทของข้อมูล Props สำหรับแสดงผลการ์ดโปรไฟล์ของผู้ดูแลระบบ (Admin)
 * สอดคล้องกับฟิลด์ข้อมูลในฐานข้อมูล user_profile และ education
 */
export interface AdminProfileCardProps {
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

/**
 * คอมโพเนนต์แสดงผลการ์ดข้อมูลผู้ดูแลระบบ (AdminProfileCard)
 * ออกแบบเพื่อแสดงข้อมูลประจำตัวและสังกัดหน่วยงานในรูปแบบมินิมอลตามดีไซน์หลักของระบบ
 * โดยตัดสถิติการเรียน (Stats & Progress) ที่ไม่เกี่ยวข้องกับบทบาทผู้ดูแลระบบออก
 */
export function AdminProfileCard({
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
  roleName = 'Administrator',
}: AdminProfileCardProps) {
  // จัดการแปลงค่าเพศให้แสดงผลมาตรฐานภาษาอังกฤษหรือคงค่าเดิมกรณีระบุภาษาไทย
  const displayGender = () => {
    if (!gender) return '-';
    const lower = gender.toLowerCase();
    if (lower === 'male') return 'Male';
    if (lower === 'female') return 'Female';
    if (lower === 'other') return 'Other';
    return gender;
  };

  // ดึงตัวอักษรแรกเพื่อแสดงใน Avatar หากไม่มีชื่อจะใช้ตัวแรกของ Username
  const avatarLetter = (firstName?.trim() || username || 'A').charAt(0).toUpperCase();

  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        p: { xs: 3, md: 4 },
        boxShadow: 'none',
        bgcolor: '#ffffff',
        width: '100%',
      }}
    >
      {/* ส่วนหัวของการ์ด: แสดง Avatar ขนาดใหญ่, ชื่อ-นามสกุล, Username, Role และวันที่สมัคร */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: '#ffe4e6',
            color: '#e11d48',
            fontSize: '2.25rem',
            fontWeight: 800,
            border: '2px solid #fecdd3',
          }}
        >
          {avatarLetter}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            {firstName || lastName ? `${firstName} ${lastName}`.trim() : username}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.75 }}
          >
            @{username} • <span style={{ color: '#e11d48', fontWeight: 700 }}>{roleName}</span>
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            เป็นสมาชิกตั้งแต่: {formatDate(registerTimestamp)}
          </Typography>
        </Box>
      </Box>

      {/* กริด 2 คอลัมน์: ข้อมูลส่วนตัว (ซ้าย) และ ข้อมูลการศึกษา/สังกัด (ขวา) */}
      <Grid container spacing={4}>
        {/* คอลัมน์ที่ 1: ข้อมูลส่วนตัว */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}
            >
              ข้อมูลส่วนตัว
            </Typography>

            {/* อีเมล */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: '10px',
                  bgcolor: '#f8fafc',
                  color: '#64748b',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mail size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  อีเมล
                </Typography>
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600, wordBreak: 'break-all' }}>
                  {email || '-'}
                </Typography>
              </Box>
            </Box>

            {/* เพศ */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: '10px',
                  bgcolor: '#f8fafc',
                  color: '#64748b',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  เพศ
                </Typography>
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
                  {displayGender()}
                </Typography>
              </Box>
            </Box>

            {/* วันเกิด */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: '10px',
                  bgcolor: '#f8fafc',
                  color: '#64748b',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Calendar size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  วันเกิด
                </Typography>
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
                  {formatDate(dateOfBirth)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* คอลัมน์ที่ 2: ข้อมูลการศึกษา / หน่วยงาน */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}
            >
              ข้อมูลการศึกษา
            </Typography>

            {/* สถาบันการศึกษา */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: '10px',
                  bgcolor: '#f8fafc',
                  color: '#64748b',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <School size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  สถาบันการศึกษา
                </Typography>
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
                  {university || '-'}
                </Typography>
              </Box>
            </Box>

            {/* คณะ / ส่วนงาน */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: '10px',
                  bgcolor: '#f8fafc',
                  color: '#64748b',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  คณะ / ส่วนงาน
                </Typography>
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
                  {faculty || '-'}
                </Typography>
              </Box>
            </Box>

            {/* สาขาวิชา */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: '10px',
                  bgcolor: '#f8fafc',
                  color: '#64748b',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GraduationCap size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  สาขาวิชา
                </Typography>
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
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
