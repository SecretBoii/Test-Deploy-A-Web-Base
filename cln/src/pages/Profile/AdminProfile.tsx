import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { apiClient } from '../../api/client';
import { AdminProfileCard } from './components/admin/AdminProfileCard';

interface Education {
  university: string;
  faculty: string;
  major: string;
}

interface AdminProfileDetails {
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

export function AdminProfile() {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<AdminProfileDetails | null>(null);

  // ดึงข้อมูลโปรไฟล์เมื่อคอมโพเนนต์เริ่มทำงาน
  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await apiClient.get<AdminProfileDetails>('/profile/details');
      setProfile(res.data);
    } catch (err: unknown) {
      console.error('Failed to fetch admin profile details:', err);
      setErrorMessage('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  /**
   * แปลงรูปแบบวันที่เป็น วว/ดด/ปป (เช่น 06/08/26)
   */
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#0F4A38' }} />
      </Box>
    );
  }

  return (
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
        {/* ส่วนหัวหน้าโปรไฟล์ แสดงข้อความและบริบทการใช้งาน */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            บัญชีผู้ใช้งาน
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '14.5px' }}>
            ข้อมูลโปรไฟล์ประจำตัวและสังกัดหน่วยงานของผู้ดูแลระบบ
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

        {/* การ์ดแสดงผลข้อมูลส่วนตัวและการศึกษาของผู้ดูแลระบบ สไตล์ KOKISO SaaS เดี่ยว คลีน และตรงจุด */}
        {profile && (
          <AdminProfileCard
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
            roleName={profile.roleName || 'Administrator'}
          />
        )}
      </Box>
    );
}

export default AdminProfile;
