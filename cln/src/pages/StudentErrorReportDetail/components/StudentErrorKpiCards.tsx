import { Grid, Paper, Box, Typography } from '@mui/material';
import { Activity, BookOpen, Bug } from 'lucide-react';

interface StudentErrorKpiCardsProps {
  totalExceptions: number;
  totalExercisesWithErrors: number;
  topErrorType: string;
}

export function StudentErrorKpiCards({
  totalExceptions,
  totalExercisesWithErrors,
  topErrorType,
}: StudentErrorKpiCardsProps) {
  return (
    <Grid container spacing={2}>
      {/* 1. จำนวน Exception รวม */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper
          sx={{
            p: 2.5,
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              p: 1.2,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#475569',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Activity size={22} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '13px' }}>
              Exception รวมของคนนี้
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.3 }}>
              {totalExceptions} ครั้ง
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* 2. แบบฝึกหัดที่ติดปัญหา */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper
          sx={{
            p: 2.5,
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              p: 1.2,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#475569',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <BookOpen size={22} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '13px' }}>
              แบบฝึกหัดที่ติดปัญหา
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.3 }}>
              {totalExercisesWithErrors} ข้อ
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* 3. Exception ที่เจอบ่อยสุด */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper
          sx={{
            p: 2.5,
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              p: 1.2,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#475569',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Bug size={22} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '13px' }}>
              Exception ที่เจอบ่อยสุด
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.3 }}>
              {topErrorType}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
