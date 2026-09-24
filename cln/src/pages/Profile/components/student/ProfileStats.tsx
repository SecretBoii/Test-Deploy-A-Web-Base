import { Box, Card, Typography, LinearProgress } from '@mui/material';
import { CheckCircle, Award, BarChart2, PlayCircle } from 'lucide-react';

interface ProfileStatsProps {
  solvedExercises: number;
  totalExercises: number;
  averageScore: number;
  successSubmissions: number;
  averageRuns: number;
}

export function ProfileStats({
  solvedExercises,
  totalExercises,
  averageScore,
  successSubmissions,
  averageRuns,
}: ProfileStatsProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: 2.5,
      }}
    >
      {/* Stat Card 1: ความคืบหน้า */}
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
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>
            แบบฝึกหัดที่ทำผ่าน
          </Typography>
          <CheckCircle size={24} color="#cbd5e1" />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, display: 'inline', fontSize: 32 }}>
            {solvedExercises}
          </Typography>
          <Typography variant="body2" component="span" sx={{ color: '#64748b', ml: 0.5 }}>
            / {totalExercises} ข้อ
          </Typography>
          <LinearProgress
            variant="determinate"
            value={totalExercises ? (solvedExercises / totalExercises) * 100 : 0}
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

      {/* Stat Card 2: จำนวนการส่ง */}
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
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>
            ส่งสำเร็จ
          </Typography>
          <Award size={24} color="#cbd5e1" />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, fontSize: 32 }}>
            {successSubmissions}
          </Typography>
          <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600, display: 'block', mt: 1 }}>
            ครั้ง (ส่งประเมินผล)
          </Typography>
        </Box>
      </Card>

      {/* Stat Card 3: คะแนนเฉลี่ย */}
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
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>
            คะแนนเฉลี่ย
          </Typography>
          <BarChart2 size={24} color="#cbd5e1" />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, display: 'inline', fontSize: 32 }}>
            {averageScore}
          </Typography>
          <Typography variant="body2" component="span" sx={{ fontWeight: 700, ml: 0.5, color: '#0ea5e9' }}>
            %
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1 }}>
            คะแนนประเมินเฉลี่ย
          </Typography>
        </Box>
      </Card>

      {/* Stat Card 4: การรันเฉลี่ย */}
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
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>
            การสั่ง Run เฉลี่ย
          </Typography>
          <PlayCircle size={24} color="#cbd5e1" />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, display: 'inline', fontSize: 32 }}>
            {averageRuns}
          </Typography>
          <Typography variant="body2" component="span" sx={{ color: '#64748b', ml: 0.5 }}>
            ครั้ง/ข้อ
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1.5 }}>
            จำนวนการทดสอบโค้ดเฉลี่ย
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
