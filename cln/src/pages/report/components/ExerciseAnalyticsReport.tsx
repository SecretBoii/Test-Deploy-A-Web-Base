import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Chip, LinearProgress, TablePagination } from '@mui/material';
import { useState, useEffect } from 'react';
import type { ExerciseAnalyticsData } from '../../../api/reports';

interface ExerciseAnalyticsReportProps {
  data: ExerciseAnalyticsData[];
  isLoading: boolean;
}

export function ExerciseAnalyticsReport({ data, isLoading }: ExerciseAnalyticsReportProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setPage(0);
  }, [data.length]);

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  const getDifficultyChip = (level: number) => {
    let label = 'ง่าย';
    let color = { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' };
    
    if (level === 2) {
      label = 'ปานกลาง';
      color = { bg: '#fffbeb', border: '#fde68a', text: '#92400e' };
    } else if (level >= 3) {
      label = 'ยาก';
      color = { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' };
    }

    return (
      <Chip 
        label={label} 
        size="small" 
        sx={{ bgcolor: color.bg, color: color.text, border: `1px solid ${color.border}`, fontWeight: 700, borderRadius: '6px' }} 
      />
    );
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
        สถิติอัตราความสำเร็จของโจทย์คอมไพล์โปรแกรม
      </Typography>

      <Paper sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>โจทย์ / บทเรียน</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>ระดับความยาก</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }} width="180px">อัตราการผ่าน (Success %)</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="center">รันเฉลี่ยสะสม</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="center">อัตราขอคำใบ้</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>เวลาใช้จริง / ตั้งไว้</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><LinearProgress /></TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: '#94a3b8' }}>ไม่พบสถิติข้อสอบ</TableCell></TableRow>
            ) : (
              paginatedData.map((exercise) => (
                <TableRow key={exercise.exerciseId} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{exercise.title}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>หัวข้อบทเรียน: {exercise.topic}</Typography>
                  </TableCell>
                  
                  <TableCell>{getDifficultyChip(exercise.difficultyLevel)}</TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={exercise.successRate} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3, 
                            bgcolor: '#f1f5f9', 
                            '& .MuiLinearProgress-bar': { 
                              bgcolor: exercise.successRate > 70 ? '#10b981' : exercise.successRate > 40 ? '#f59e0b' : '#ef4444' 
                            } 
                          }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {exercise.successRate.toFixed(0)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 600 }}>{exercise.averageAttempts.toFixed(1)} ครั้ง</Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography sx={{ color: exercise.hintUsageRate > 45 ? '#ef4444' : '#475569', fontWeight: 600 }}>
                      {exercise.hintUsageRate.toFixed(0)}%
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography sx={{ fontSize: '13px' }}>
                      {exercise.avgTimeSpentMinutes.toFixed(1)} / {exercise.expectedTimeMinutes} นาที
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="แสดงแถวต่อหน้า:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count}`}
        sx={{ borderTop: '1px solid #e2e8f0' }}
      />
      </Paper>
    </Box>
  );
}
