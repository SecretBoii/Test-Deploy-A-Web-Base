import { Box, Typography, Card, LinearProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

interface StatsRowProps {
  username: string;
  stats: {
    totalExercises: number;
    completedExercises: number;
    averageScore: number;
    streakDays: number;
  } | null;
}

export function StatsRow({ username, stats }: StatsRowProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Greeting */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          ยินดีต้อนรับกลับ, {username}.
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          คุณทำได้ดีมาก มารักษาความต่อเนื่องกันเถอะ
        </Typography>
      </Box>

      {/* Stats Cards Row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2.5,
        }}
      >
        {/* Stat Card 1 */}
        <Card
          sx={{
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              แบบฝึกหัดทั้งหมด
            </Typography>
            <CheckCircleOutlineIcon sx={{ color: '#cbd5e1', fontSize: 20 }} />
          </Box>
          <Box sx={{ mt: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, display: 'inline' }}>
              {stats?.completedExercises ?? 0}
            </Typography>
            <Typography variant="body2" component="span" sx={{ color: '#64748b', ml: 0.5 }}>
              / {stats?.totalExercises ?? 0}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={stats?.totalExercises ? (stats.completedExercises / stats.totalExercises) * 100 : 0}
              sx={{
                mt: 1.5,
                height: 6,
                borderRadius: 3,
                bgcolor: '#f1f5f9',
                '& .MuiLinearProgress-bar': { bgcolor: '#2563eb' },
              }}
            />
          </Box>
        </Card>

        {/* Stat Card 2 */}
        <Card
          sx={{
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              ผ่านแล้ว
            </Typography>
            <CheckCircleOutlineIcon sx={{ color: '#cbd5e1', fontSize: 20 }} />
          </Box>
          <Box sx={{ mt: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {stats?.completedExercises ?? 0}
            </Typography>
            <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600, display: 'block', mt: 1 }}>
              ส่งสำเร็จ
            </Typography>
          </Box>
        </Card>

        {/* Stat Card 3 */}
        <Card
          sx={{
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              คะแนนเฉลี่ย
            </Typography>
            <BarChartIcon sx={{ color: '#f1f5f9', backgroundColor: '#e2e8f0', borderRadius: '4px', fontSize: 20 }} />
          </Box>
          <Box sx={{ mt: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, display: 'inline' }}>
              {stats?.averageScore ?? 0}
            </Typography>
            <Typography variant="body2" component="span" sx={{ fontWeight: 700, ml: 0.5 }}>
              %
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1 }}>
              จากทุกโจทย์
            </Typography>
          </Box>
        </Card>

        {/* Stat Card 4 */}
        <Card
          sx={{
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              ความต่อเนื่อง
            </Typography>
            <LocalFireDepartmentIcon sx={{ color: '#cbd5e1', fontSize: 20 }} />
          </Box>
          <Box sx={{ mt: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, display: 'inline' }}>
              {stats?.streakDays ?? 0}
            </Typography>
            <Typography variant="body2" component="span" sx={{ color: '#64748b', ml: 0.5 }}>
              วัน
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5 }}>
              {[...Array(7)].map((_, idx) => {
                const active = idx < (stats?.streakDays ?? 0);
                return (
                  <Box
                    key={idx}
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: active ? '#2563eb' : '#eff6ff',
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Main Action Button */}
      {/* <Button
        variant="contained"
        size="large"
        disableElevation
        sx={{
          py: 1.5,
          borderRadius: '50px',
          bgcolor: '#2563eb',
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 700,
          '&:hover': {
            bgcolor: '#1d4ed8',
          },
        }}
      >
        เริ่มทำข้อสอบ
      </Button> */}
    </Box>
  );
}
