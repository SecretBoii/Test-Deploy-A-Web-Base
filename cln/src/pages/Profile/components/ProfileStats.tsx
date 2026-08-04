import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { BarChart2 } from 'lucide-react';

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
  averageRuns
}: ProfileStatsProps) {
  return (
    <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 3, boxShadow: 'none' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <BarChart2 size={22} color="#4f46e5" />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
          สถิติของฉัน
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: '#475569', fontWeight: 500 }}>
            โจทย์ที่ทำ
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2563eb' }}>
            {solvedExercises} / {totalExercises} ข้อ
          </Typography>
        </Box>
        <Box sx={{ borderBottom: '1px solid #f1f5f9' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: '#475569', fontWeight: 500 }}>
            คะแนนเฉลี่ย
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0ea5e9' }}>
            {averageScore} / 100
          </Typography>
        </Box>
        <Box sx={{ borderBottom: '1px solid #f1f5f9' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: '#475569', fontWeight: 500 }}>
            ส่งสำเร็จ
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981' }}>
            {successSubmissions} ครั้ง
          </Typography>
        </Box>
        <Box sx={{ borderBottom: '1px solid #f1f5f9' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: '#475569', fontWeight: 500 }}>
            Run เฉลี่ย
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#f59e0b' }}>
            {averageRuns} ครั้ง/โจทย์
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
