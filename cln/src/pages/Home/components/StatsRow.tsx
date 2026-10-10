import { Box, Typography, Card, LinearProgress, Skeleton } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BarChartIcon from '@mui/icons-material/BarChart';

export interface StudentStats {
  totalExercises: number;
  completedExercises: number;
  averageScore: number;
}

interface StatsRowProps {
  username: string;
  stats: StudentStats | null;
  isLoading?: boolean;
}

export function StatsRow({ username, stats, isLoading = false }: StatsRowProps) {
  const percentCompleted = stats?.totalExercises 
    ? Math.round((stats.completedExercises / stats.totalExercises) * 100) 
    : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* ส่วนทักทายผู้เรียน (Greeting Header) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          ยินดีต้อนรับกลับ, {username}.
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.95rem' }}>
          คุณทำได้ดีมาก มาฝึกฝนและพัฒนาฝีมือกันต่อเถอะ!
        </Typography>
      </Box>

      {/* แถวการ์ดสถิติ (Stats Cards Grid) สไตล์เดียวกับ Teacher & Admin StatCards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
          gap: 2.5,
        }}
      >
        {/* การ์ดที่ 1: แบบฝึกหัดทั้งหมด */}
        <Card
          sx={{
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 2,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>
              แบบฝึกหัดทั้งหมด
            </Typography>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MenuBookIcon sx={{ color: '#2563eb', fontSize: 24 }} />
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8 }}>
              {isLoading ? (
                <Skeleton width={90} height={36} animation="wave" />
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                    {stats?.completedExercises ?? 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                    / {stats?.totalExercises ?? 0} ข้อ
                  </Typography>
                </>
              )}
            </Box>
            <Box sx={{ mt: 1.5 }}>
              {isLoading ? (
                <Skeleton width="100%" height={8} animation="wave" sx={{ borderRadius: 3 }} />
              ) : (
                <>
                  <LinearProgress
                    variant="determinate"
                    value={percentCompleted}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: '#f1f5f9',
                      '& .MuiLinearProgress-bar': { bgcolor: '#2563eb', borderRadius: 3 },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.8, fontSize: '0.75rem' }}>
                    ความคืบหน้ารวม {percentCompleted}%
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Card>

        {/* การ์ดที่ 2: ทำผ่านสำเร็จ */}
        <Card
          sx={{
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 2,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>
              ผ่านแล้ว
            </Typography>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircleIcon sx={{ color: '#059669', fontSize: 24 }} />
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8 }}>
              {isLoading ? (
                <Skeleton width={70} height={36} animation="wave" />
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                    {stats?.completedExercises ?? 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                    ข้อ
                  </Typography>
                </>
              )}
            </Box>
            {isLoading ? (
              <Skeleton width={110} height={18} animation="wave" sx={{ mt: 1.2 }} />
            ) : (
              <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700, display: 'block', mt: 1.2 }}>
                ส่งสำเร็จตามเกณฑ์
              </Typography>
            )}
          </Box>
        </Card>

        {/* การ์ดที่ 3: คะแนนเฉลี่ย */}
        <Card
          sx={{
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 2,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>
              คะแนนเฉลี่ย
            </Typography>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: '#fffbeb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BarChartIcon sx={{ color: '#d97706', fontSize: 24 }} />
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8 }}>
              {isLoading ? (
                <Skeleton width={70} height={36} animation="wave" />
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                    {stats?.averageScore ?? 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
                    %
                  </Typography>
                </>
              )}
            </Box>
            {isLoading ? (
              <Skeleton width={120} height={18} animation="wave" sx={{ mt: 1.2 }} />
            ) : (
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1.2 }}>
                จากทุกโจทย์ที่ส่งตรวจ
              </Typography>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
