import { Box, Card, Typography, Skeleton } from '@mui/material';
import { Users, Wifi, GraduationCap, BookOpen, ShieldCheck } from 'lucide-react';
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
  const adminCount = stats?.adminCount || 0;

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
      title: 'นักเรียน',
      value: studentCount.toLocaleString(),
      unit: 'คน',
      icon: <GraduationCap size={22} color="#4f46e5" />,
      bgColor: '#eef2ff',
    },
    {
      title: 'อาจารย์',
      value: teacherCount.toLocaleString(),
      unit: 'คน',
      icon: <BookOpen size={22} color="#d97706" />,
      bgColor: '#fffbeb',
    },
    {
      title: 'ผู้ดูแลระบบ',
      value: adminCount.toLocaleString(),
      unit: 'คน',
      icon: <ShieldCheck size={22} color="#e11d48" />,
      bgColor: '#ffe4e6',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(5, 1fr)',
        },
        gap: 2,
      }}
    >
      {cards.map((item, idx) => (
        <Card
          key={idx}
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: 1.75,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <Box
            sx={{
              width: 55,
              height: 55,
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
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                fontWeight: 600,
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width={60} height={32} />
            ) : (
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: '#0f172a',
                  fontSize: { xs: '1.25rem', lg: '1.15rem', xl: '1.35rem' },
                  lineHeight: 1.2,
                }}
              >
                {item.value}{' '}
                <Typography component="span" variant="caption" sx={{ color: '#94a3b8', ml: 0.5 }}>
                  {item.unit}
                </Typography>
              </Typography>
            )}
          </Box>
        </Card>
      ))}
    </Box>
  );
}

export default UserStatsHeader;
