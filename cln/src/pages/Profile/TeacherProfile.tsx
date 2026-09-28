import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { MainLayout } from '../../components/Layout/MainLayout';
import { apiClient } from '../../api/client';
import { TeacherProfileCard } from './components/teacher/TeacherProfileCard';

interface Education {
  university: string;
  faculty: string;
  major: string;
}

interface TeacherProfileDetails {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  registerTimestamp: string;
  roleName?: string;
  education: Education;
}

export function TeacherProfile() {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<TeacherProfileDetails | null>(null);

  // ดึงข้อมูลโปรไฟล์เมื่อคอมโพเนนต์เริ่มทำงาน
  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await apiClient.get<TeacherProfileDetails>('/profile/details');
      setProfile(res.data);
    } catch (err: unknown) {
      console.error('Failed to fetch teacher profile details:', err);
      setErrorMessage('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const yearShort = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${yearShort}`;
  };

  // แสดงตัวโหลดหมุน (Spinner) ขณะดึงข้อมูล
  if (loading) {
    return (
      <MainLayout activeItem="Profile">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress sx={{ color: '#2563eb' }} />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout activeItem="Profile">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3.5,
          color: '#0f172a',
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%',
          pb: 4,
        }}
      >
        {/* ส่วนหัวหน้าโปรไฟล์ แสดงข้อความและบริบทการใช้งานสำหรับอาจารย์ */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            บัญชีผู้ใช้งาน
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '14.5px' }}>
            ข้อมูลโปรไฟล์ประจำตัวและสังกัดหน่วยงานของอาจารย์ผู้สอน
          </Typography>
        </Box>

        {/* กรณีเกิดข้อผิดพลาดในการโหลดข้อมูล */}
        {errorMessage && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={fetchProfileDetails}>
                ลองใหม่
              </Button>
            }
          >
            {errorMessage}
          </Alert>
        )}

        {/* การ์ดแสดงผลข้อมูลส่วนตัวและสังกัดวิชาการของอาจารย์ผู้สอน */}
        {profile && (
          <TeacherProfileCard
            username={profile.username}
            firstName={profile.firstName || ''}
            lastName={profile.lastName || ''}
            email={profile.email || ''}
            gender={profile.gender || ''}
            dateOfBirth={profile.dateOfBirth || ''}
            university={profile.education?.university || ''}
            faculty={profile.education?.faculty || ''}
            major={profile.education?.major || ''}
            registerTimestamp={profile.registerTimestamp}
            formatDate={formatDate}
            roleName={profile.roleName || 'Teacher'}
          />
        )}
      </Box>
    </MainLayout>
  );
}

export default TeacherProfile;
