import { useAuth } from '../../context/AuthContext';
import { StudentProfile } from './StudentProfile';
import { AdminProfile } from './AdminProfile';
import { TeacherProfile } from './TeacherProfile';
import { MainLayout } from '../../components/Layout/MainLayout';

export function ProfilePage() {
  const { user } = useAuth();

  // กำหนด MainLayout activeItem="Profile" ที่จุดเดียว และแสดงคอมโพเนนต์ตามบทบาทของผู้ใช้
  return (
    <MainLayout activeItem="Profile">
      {user?.roleId === 1 && <StudentProfile />}
      {user?.roleId === 2 && <TeacherProfile />}
      {user?.roleId === 3 && <AdminProfile />}
    </MainLayout>
  );
}

export default ProfilePage;
