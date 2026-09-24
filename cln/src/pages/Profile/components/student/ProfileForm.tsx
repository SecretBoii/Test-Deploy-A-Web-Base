import { Box, Card, Avatar, Typography, Grid } from '@mui/material';
import { User, Mail, Calendar, School, BookOpen, GraduationCap } from 'lucide-react';

interface ProfileFormProps {
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

export function ProfileForm({
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
  roleName,
}: ProfileFormProps) {
  // จัดข้อความเพศให้แสดงผลสวยงาม
  const displayGender = () => {
    if (!gender) return '-';
    const lower = gender.toLowerCase();
    if (lower === 'male') return 'Male';
    if (lower === 'female') return 'Female';
    if (lower === 'other') return 'Other';
    return gender;
  };

  return (
    <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 4, boxShadow: 'none', bgcolor: '#ffffff' }}>
      {/* Profile Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: '#eff6ff',
            color: '#2563eb',
            fontSize: '2.25rem',
            fontWeight: 800,
            border: '2px solid #dbeafe',
          }}
        >
          {username?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            {firstName} {lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.75 }}>
            @{username} • <span style={{ color: '#2563eb' }}>{roleName || '-'}</span>
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            เป็นสมาชิกตั้งแต่: {formatDate(registerTimestamp)}
          </Typography>
        </Box>
      </Box>

      {/* Info Grid (Personal & Academic Info) */}
      <Grid container spacing={4}>
        {/* Personal Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              ข้อมูลส่วนตัว
            </Typography>

            {/* Email */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ p: 1, borderRadius: '10px', bgcolor: '#f8fafc', color: '#64748b', border: '1px solid #f1f5f9' }}>
                <Mail size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>อีเมล</Typography>
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600, wordBreak: 'break-all' }}>{email || '-'}</Typography>
              </Box>
            </Box>

            {/* Gender */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ p: 1, borderRadius: '10px', bgcolor: '#f8fafc', color: '#64748b', border: '1px solid #f1f5f9' }}>
                <User size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>เพศ</Typography>
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>{displayGender()}</Typography>
              </Box>
            </Box>

            {/* Date of Birth */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ p: 1, borderRadius: '10px', bgcolor: '#f8fafc', color: '#64748b', border: '1px solid #f1f5f9' }}>
                <Calendar size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>วันเกิด</Typography>
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>{formatDate(dateOfBirth)}</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Academic Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              ข้อมูลการศึกษา
            </Typography>

            {/* University */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ p: 1, borderRadius: '10px', bgcolor: '#f8fafc', color: '#64748b', border: '1px solid #f1f5f9' }}>
                <School size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>สถาบันการศึกษา</Typography>
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>{university || '-'}</Typography>
              </Box>
            </Box>

            {/* Faculty */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ p: 1, borderRadius: '10px', bgcolor: '#f8fafc', color: '#64748b', border: '1px solid #f1f5f9' }}>
                <BookOpen size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>คณะ / ส่วนงาน</Typography>
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>{faculty || '-'}</Typography>
              </Box>
            </Box>

            {/* Major */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ p: 1, borderRadius: '10px', bgcolor: '#f8fafc', color: '#64748b', border: '1px solid #f1f5f9' }}>
                <GraduationCap size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>สาขาวิชา</Typography>
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>{major || '-'}</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
