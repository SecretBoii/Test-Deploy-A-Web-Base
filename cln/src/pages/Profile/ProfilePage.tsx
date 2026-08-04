import React, { useState, useEffect } from 'react';
import { Box, Grid, CircularProgress } from '@mui/material';
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
  gender: string;
  dateOfBirth: string;
  registerTimestamp: string;
  education: Education;
  stats: Stats;
}

export function ProfilePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [levelsProgress, setLevelsProgress] = useState<LevelProgress[]>([]);
  
  // สถานะข้อมูลผู้ใช้งาน
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [university, setUniversity] = useState('');
  const [faculty, setFaculty] = useState('');
  const [major, setMajor] = useState('');

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
      setGender(data.gender);
      if (data.dateOfBirth) {
        setDateOfBirth(data.dateOfBirth.substring(0, 10)); // แปลงเป็นรูปแบบ YYYY-MM-DD
      }
      setUniversity(data.education?.university || '');
      setFaculty(data.education?.faculty || '');
      setMajor(data.education?.major || '');
    } catch (err: any) {
      console.error('Failed to fetch profile details:', err);
    } finally {
      setLoading(false);
    }
  };

  // จัดรูปแบบปีพุทธศักราช พ.ศ. 2 หลัก (เช่น 09/11/66)
  const formatThaiYear = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const yearThaiShort = String(date.getFullYear() + 543).slice(-2);
    return `${day}/${month}/${yearThaiShort}`;
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
      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 1 }}>
        <Grid container spacing={3}>
          {/* ส่วนซ้าย: กล่องแสดงข้อมูลผู้ใช้แบบอ่านอย่างเดียว */}
          <Grid size={{ xs: 12, md: 7 }}>
            <ProfileForm
              username={username}
              gender={gender}
              dateOfBirth={dateOfBirth}
              university={university}
              faculty={faculty}
              major={major}
              registerTimestamp={profile?.registerTimestamp}
              formatThaiYear={formatThaiYear}
            />
          </Grid>

          {/* ส่วนขวา: ข้อมูลสถิติและความก้าวหน้าของวิชาเรียน */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Grid container spacing={3}>
              {/* การ์ดสถิติ */}
              <Grid size={{ xs: 12 }}>
                <ProfileStats
                  solvedExercises={profile?.stats?.solvedExercises || 0}
                  totalExercises={profile?.stats?.totalExercises || 0}
                  averageScore={profile?.stats?.averageScore || 0}
                  successSubmissions={profile?.stats?.successSubmissions || 0}
                  averageRuns={profile?.stats?.averageRuns || 0}
                />
              </Grid>

              {/* การ์ดความก้าวหน้าตามความยาก (Progress Bars) */}
              <Grid size={{ xs: 12 }}>
                <ProfileProgress progress={levelsProgress} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
}

export default ProfilePage;
