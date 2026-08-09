import { useAuth } from '../../context/AuthContext';
import { StudentProfile } from './StudentProfile';
import { Box, Typography } from '@mui/material';
import { MainLayout } from '../../components/Layout/MainLayout';

export function ProfilePage() {
  const { user } = useAuth();

  // หากเป็น Student (roleId === 1) ให้เปิดหน้า StudentProfile
  if (user?.roleId === 1) {
    return <StudentProfile />;
  }

  // หากเป็น Teacher หรือ Admin (roleId !== 1) เนื่องจากระบบยังไม่ทำหน้านี้ ให้แสดงหน้า Placeholder ไว้ชั่วคราว
  return (
    <MainLayout activeItem="Profile">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          color: '#475569',
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          ข้อมูลบัญชีผู้ใช้งาน
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          ระบบจัดการโปรไฟล์สำหรับบทบาทผู้สอนและผู้ดูแลระบบ กำลังอยู่ในขั้นตอนการพัฒนา
        </Typography>
      </Box>
    </MainLayout>
  );
}

export default ProfilePage;
