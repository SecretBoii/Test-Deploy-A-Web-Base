import { Box, Card, Typography } from '@mui/material';
import { Users, Wifi, GraduationCap, ShieldCheck } from 'lucide-react';
import type { UserStats } from '../../../api/users';

interface UserStatsHeaderProps {
  stats?: UserStats;
  loading?: boolean;
}

export function UserStatsHeader({ stats, loading }: UserStatsHeaderProps) {
  const total = stats?.total || 0;
  const onlineCount = stats?.onlineCount || 0;
  const studentCount = stats?.studentCount || 0;
  const teacherCount = stats?.teacherCount || 0;

  const cards = [
    {
      title: 'สมาชิกทั้งหมด',
      value: total.toLocaleString(),
      unit: 'คน',
      icon: <Users size={22} color="#2563eb" />,
      bgColor: '#eff6ff',
    },
    {
      title: 'กำลังออนไลน์',
      value: onlineCount.toLocaleString(),
      unit: 'คน',
      icon: <Wifi size={22} color="#059669" />,
      bgColor: '#ecfdf5',
    },
    {
      title: 'นักเรียน / นักศึกษา',
      value: studentCount.toLocaleString(),
      unit: 'คน',
      icon: <GraduationCap size={22} color="#4f46e5" />,
      bgColor: '#eef2ff',
    },
    {
      title: 'อาจารย์ & แอดมิน',
      value: teacherCount.toLocaleString(),
      unit: 'คน',
      icon: <ShieldCheck size={22} color="#d97706" />,
      bgColor: '#fffbeb',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: 2.5,
      }}
    >
      {cards.map((item, idx) => (
        <Card
          key={idx}
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              bgcolor: item.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {item.icon}
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>
              {item.title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {loading ? '...' : item.value}{' '}
              <Typography component="span" variant="caption" sx={{ color: '#94a3b8', ml: 0.5 }}>
                {item.unit}
              </Typography>
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
}

export default UserStatsHeader;
