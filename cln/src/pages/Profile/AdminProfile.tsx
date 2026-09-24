import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { MainLayout } from '../../components/Layout/MainLayout';
import { apiClient } from '../../api/client';
import { AdminProfileCard } from './components/admin/AdminProfileCard';

/**
 * โครงสร้างข้อมูลประวัติการศึกษา/สังกัดหน่วยงาน
 */
interface Education {
  university: string;
  faculty: string;
  major: string;
}

/**
 * โครงสร้างข้อมูลรายละเอียดโปรไฟล์ของผู้ใช้ที่ตอบกลับจาก API /profile/details
 */
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

/**
 * คอมโพเนนต์หน้า AdminProfile (หน้าโปรไฟล์สำหรับผู้ดูแลระบบ)
 * ทำหน้าที่ดึงข้อมูลบัญชีและสังกัดหน่วยงานจาก API เบื้องหลัง (/profile/details)
 * และจัดการสถานะ Loading / Error พร้อมแสดงผลในรูปแบบการ์ดที่กระชับและตรงตามบทบาท
 */
export function AdminProfile() {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<AdminProfileDetails | null>(null);

  // ดึงข้อมูลโปรไฟล์เมื่อโหลดคอมโพเนนต์
  useEffect(() => {
    fetchProfileDetails();
  }, []);

  /**
   * เรียก API เพื่อดึงข้อมูลโปรไฟล์ของผู้ดูแลระบบ
   * โดยยิงเฉพาะ /profile/details เพียงตัวเดียวเพื่อประหยัดทรัพยากร
   */
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
   * จัดรูปแบบวันที่ให้อยู่ในฟอร์แมต วว/ดด/ปป (เช่น 06/08/26) ให้ตรงกับระบบเดิม
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

  // แสดงตัวโหลด (Spinner) ขณะดึงข้อมูลจากเซิร์ฟเวอร์
  if (loading) {
    return (
      <MainLayout activeItem="Profile">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
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
          maxWidth: '1000px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* ส่วนหัวแสดงชื่อหน้าและคำอธิบายบริบทการใช้งาน */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
            บัญชีผู้ใช้งาน
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
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

        {/* การ์ดแสดงผลข้อมูลส่วนตัวและการศึกษาของผู้ดูแลระบบ */}
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
    </MainLayout>
  );
}

export default AdminProfile;
