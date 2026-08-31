import { Paper, Typography, Box, Grid, LinearProgress } from '@mui/material';
import { AlertTriangle } from 'lucide-react';
import type { ErrorAnalyticsData } from '../../../api/reports';

interface ErrorAnalyticsReportProps {
  data: ErrorAnalyticsData[];
  isLoading: boolean;
}

export function ErrorAnalyticsReport({ data, isLoading }: ErrorAnalyticsReportProps) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
        รายงานสถิติข้อผิดพลาด (Python Syntax / Compilation Exception)
      </Typography>

      <Grid container spacing={3}>
        {isLoading ? (
          <Grid size={{ xs: 12 }} sx={{ py: 6 }}><LinearProgress /></Grid>
        ) : data.length === 0 ? (
          <Grid size={{ xs: 12 }} sx={{ py: 6, textAlign: 'center', color: '#94a3b8' }}>ไม่พบข้อมูลความผิดพลาดที่เคยบันทึก</Grid>
        ) : (
          data.map((err) => (
            <Grid size={{ xs: 12, md: 6 }} key={err.errorType}>
              <Paper 
                sx={{ 
                  p: 2.5, 
                  borderRadius: '12px', 
                  border: '1px solid #f1f5f9', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#b91c1c' }}>
                    <AlertTriangle size={16} />
                    <Typography sx={{ fontWeight: 700, fontSize: '15px' }}>{err.errorType}</Typography>
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569' }}>
                    {err.occurrenceCount} ครั้ง ({err.percentage.toFixed(1)}%)
                  </Typography>
                </Box>

                <LinearProgress 
                  variant="determinate" 
                  value={err.percentage} 
                  sx={{ height: 8, borderRadius: 4, bgcolor: '#fef2f2', '& .MuiLinearProgress-bar': { bgcolor: '#ef4444' } }}
                />

                <Box sx={{ mt: 0.5, p: 1.5, bgcolor: '#fafafa', borderRadius: '6px', borderLeft: '3px solid #cbd5e1' }}>
                  <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontWeight: 600, mb: 0.5 }}>
                    ตัวอย่าง Error Message ล่าสุด:
                  </Typography>
                  <Typography sx={{ fontFamily: 'Courier New, monospace', fontSize: '12px', color: '#334155', wordBreak: 'break-all' }}>
                    {err.commonExceptionMessage || 'ไม่มีตัวอย่างข้อความ'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
