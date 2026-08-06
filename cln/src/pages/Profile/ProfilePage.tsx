import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { MainLayout } from '../../components/Layout/MainLayout';
import { apiClient } from '../../api/client';
import { ProfileForm } from './components/ProfileForm';
import { ProfileStats } from './components/ProfileStats';
import { ProfileProgress } from './components/ProfileProgress';

interface Education {
  university: string;
  faculty: string;
  major: string;
}

interface Stats {
  solvedExercises: number;
  totalExercises: number;
  averageScore: number;
  successSubmissions: number;
  averageRuns: number;
}

interface LevelProgress {
  level: number;
  completedExercises: number;
  totalExercises: number;
}

interface ProfileDetails {
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
  stats: Stats;
}

export function ProfilePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [levelsProgress, setLevelsProgress] = useState<LevelProgress[]>([]);
  
  // สถานะข้อมูลผู้ใช้งาน
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [university, setUniversity] = useState('');
  const [faculty, setFaculty] = useState('');
  const [major, setMajor] = useState('');
  const [roleName, setRoleName] = useState('');

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      
      // ยิงสอง API แบบคู่ขนาน (Promise.all)
      const [profileRes, levelsRes] = await Promise.all([
        apiClient.get<ProfileDetails>('/profile/details'),
        apiClient.get<LevelProgress[]>('/exercises/levels-summary')
      ]);

      const data = profileRes.data;
      setProfile(data);
      setLevelsProgress(levelsRes.data || []);
      
      // ตั้งค่าแสดงผล
      setUsername(data.username);
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setEmail(data.email || '');
      setGender(data.gender);
      if (data.dateOfBirth) {
        setDateOfBirth(data.dateOfBirth.substring(0, 10)); // แปลงเป็นรูปแบบ YYYY-MM-DD
      }
      setUniversity(data.education?.university || '');
      setFaculty(data.education?.faculty || '');
      setMajor(data.education?.major || '');
      setRoleName(data.roleName || '');
    } catch (err: any) {
      console.error('Failed to fetch profile details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format Gregorian date AD (e.g. 21/07/26)
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const yearShort = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${yearShort}`;
  };

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
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* 1. Header Greeting */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
            บัญชีผู้ใช้งาน
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            ข้อมูลโปรไฟล์ สถิติการเรียน และระดับทักษะความเชี่ยวชาญภาษา Python ของคุณ
          </Typography>
        </Box>

        {/* 2. Stats Cards Row (ปรับแสดงเป็น 4 การ์ดแนวนอนพรีเมียมแบบเดียวกับหน้าแรก) */}
        <ProfileStats
          solvedExercises={profile?.stats?.solvedExercises || 0}
          totalExercises={profile?.stats?.totalExercises || 0}
          averageScore={profile?.stats?.averageScore || 0}
          successSubmissions={profile?.stats?.successSubmissions || 0}
          averageRuns={profile?.stats?.averageRuns || 0}
        />

        {/* 3. Middle Section: Profile Info (ซ้าย 2/3) & Level Progress (ขวา 1/3) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
          <ProfileForm
            username={username}
            firstName={firstName}
            lastName={lastName}
            email={email}
            gender={gender}
            dateOfBirth={dateOfBirth}
            university={university}
            faculty={faculty}
            major={major}
            registerTimestamp={profile?.registerTimestamp}
            formatDate={formatDate}
            roleName={roleName}
          />
          <ProfileProgress progress={levelsProgress} />
        </Box>
      </Box>
    </MainLayout>
  );
}

export default ProfilePage;
