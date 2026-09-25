import { Grid, Paper, Box, Typography } from '@mui/material';

interface StudentErrorKpiCardsProps {
  totalExceptions: number;
  totalExercisesWithErrors: number;
  topErrorType: string;
}

// การ์ดสรุป KPI 3 ใบของนักศึกษารายคน ปรับความสูงเท่ากันเป๊ะ สไตล์ Modern Dark-Navy SaaS
export function StudentErrorKpiCards({
  totalExceptions,
  totalExercisesWithErrors,
  topErrorType,
}: StudentErrorKpiCardsProps) {
  return (
    <Grid container spacing={2.5} sx={{ alignItems: 'stretch' }}>
      {/* 1. จำนวน Exception รวม */}
      <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex' }}>
        <Paper
          sx={{
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flex: 1,
            height: '100%',
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#475569', fontWeight: 700, fontSize: '13px' }}>
              Exception รวมของคนนี้
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8, mt: 0.3 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                {totalExceptions}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                ครั้ง
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* 2. แบบฝึกหัดที่ติดปัญหา */}
      <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex' }}>
        <Paper
          sx={{
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flex: 1,
            height: '100%',
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#475569', fontWeight: 700, fontSize: '13px' }}>
              แบบฝึกหัดที่ติดปัญหา
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8, mt: 0.3 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                {totalExercisesWithErrors}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                ข้อ
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* 3. Exception ที่เจอบ่อยสุด */}
      <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex' }}>
        <Paper
          sx={{
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flex: 1,
            height: '100%',
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#475569', fontWeight: 700, fontSize: '13px' }}>
              Exception ที่เจอบ่อยสุด
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.3, lineHeight: 1.2 }}>
              {topErrorType}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
