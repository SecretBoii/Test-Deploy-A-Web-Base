import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Chip, LinearProgress, TablePagination, TableSortLabel } from '@mui/material';
import { useState } from 'react';
import { BookOpen, HelpCircle } from 'lucide-react';
import type { ExerciseAnalyticsData } from '../../../api/reports';
import { SortIconIndicator } from './SortIconIndicator';

interface ExerciseAnalyticsReportProps {
  data: ExerciseAnalyticsData[];
  isLoading: boolean;
}

type SortField = 'difficulty' | 'successRate' | 'averageAttempts';

export function ExerciseAnalyticsReport({ data, isLoading }: ExerciseAnalyticsReportProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('difficulty');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field: SortField) => {
    setPage(0);
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder(field === 'difficulty' ? 'asc' : 'desc');
    }
  };

  // เรียงลำดับข้อมูลโจทย์ตาม sortField และ sortOrder
  const sortedData = [...data].sort((a, b) => {
    let valA = 0;
    let valB = 0;
    if (sortField === 'difficulty') {
      valA = a.difficultyLevel;
      valB = b.difficultyLevel;
    } else if (sortField === 'successRate') {
      valA = a.successRate;
      valB = b.successRate;
    } else if (sortField === 'averageAttempts') {
      valA = a.averageAttempts;
      valB = b.averageAttempts;
    }
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  // สไตล์และข้อความแสดงระดับความยากของโจทย์
  const getDifficultyChip = (level: number) => {
    let label = 'ง่าย';
    let color = { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' };
    
    if (level === 2) {
      label = 'ปานกลาง';
      color = { bg: '#fffbeb', border: '#fde68a', text: '#b45309' };
    } else if (level >= 3) {
      label = 'ยาก';
      color = { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c' };
    }

    return (
      <Chip 
        label={label} 
        size="small" 
        sx={{ 
          bgcolor: color.bg, 
          color: color.text, 
          border: `1px solid ${color.border}`, 
          fontWeight: 700, 
          borderRadius: '8px',
          fontSize: '12px',
          px: 0.5,
        }} 
      />
    );
  };

  return (
    <Box>
      {/* Header ของตารางวิเคราะห์โจทย์ */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <BookOpen size={20} color="#f97316" />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
          สถิติอัตราความสำเร็จของโจทย์คอมไพล์โปรแกรม ({data.length} ข้อ)
        </Typography>
      </Box>

      {/* TableContainer ตารางสถิติโจทย์ */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <TableRow sx={{ '& th': { bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', py: 1.8, fontSize: '13px', fontWeight: 700, color: '#475569' } }}>
              <TableCell>โจทย์ / บทเรียน</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'difficulty'}
                  direction={sortField === 'difficulty' ? sortOrder : 'asc'}
                  onClick={() => handleSort('difficulty')}
                  IconComponent={() => (
                    <SortIconIndicator active={sortField === 'difficulty'} direction={sortOrder} />
                  )}
                  sx={{
                    fontWeight: 700,
                    color: '#475569',
                    '&.MuiTableSortLabel-root': { color: '#475569' },
                    '&.MuiTableSortLabel-root:hover': { color: '#2563eb' },
                  }}
                >
                  ระดับความยาก
                </TableSortLabel>
              </TableCell>
              <TableCell width="220px">
                <TableSortLabel
                  active={sortField === 'successRate'}
                  direction={sortField === 'successRate' ? sortOrder : 'desc'}
                  onClick={() => handleSort('successRate')}
                  IconComponent={() => (
                    <SortIconIndicator active={sortField === 'successRate'} direction={sortOrder} />
                  )}
                  sx={{
                    fontWeight: 700,
                    color: '#475569',
                    '&.MuiTableSortLabel-root': { color: '#475569' },
                    '&.MuiTableSortLabel-root:hover': { color: '#2563eb' },
                  }}
                >
                  อัตราการผ่าน (Success %)
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={sortField === 'averageAttempts'}
                  direction={sortField === 'averageAttempts' ? sortOrder : 'desc'}
                  onClick={() => handleSort('averageAttempts')}
                  IconComponent={() => (
                    <SortIconIndicator active={sortField === 'averageAttempts'} direction={sortOrder} />
                  )}
                  sx={{
                    fontWeight: 700,
                    color: '#475569',
                    '&.MuiTableSortLabel-root': { color: '#475569' },
                    '&.MuiTableSortLabel-root:hover': { color: '#2563eb' },
                  }}
                >
                  รันเฉลี่ยสะสม
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">อัตราขอคำใบ้</TableCell>
              <TableCell>เวลาใช้จริง / ตั้งไว้</TableCell>
            </TableRow>
          </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ width: '100%', maxWidth: 300, mx: 'auto' }}>
                      <LinearProgress sx={{ borderRadius: 3, height: 6 }} />
                      <Typography variant="caption" sx={{ color: '#64748b', mt: 1, display: 'block' }}>กำลังโหลดสถิติโจทย์...</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <HelpCircle size={36} color="#cbd5e1" style={{ marginBottom: 8 }} />
                    <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '14px' }}>ไม่พบข้อมูลสถิติโจทย์</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((exercise) => (
                  <TableRow key={exercise.exerciseId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{exercise.title}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>หัวข้อบทเรียน: {exercise.topic}</Typography>
                    </TableCell>
                    
                    <TableCell>{getDifficultyChip(exercise.difficultyLevel)}</TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: exercise.successRate > 70 ? '#10b981' : exercise.successRate > 40 ? '#d97706' : '#ef4444' }}>
                            {exercise.successRate.toFixed(0)}% ผ่าน
                          </Typography>
                        </Box>
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
                    </TableCell>
                    
                    <TableCell align="center">
                      <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#334155' }}>
                        {exercise.averageAttempts.toFixed(1)} ครั้ง
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Typography sx={{ color: exercise.hintUsageRate > 45 ? '#ef4444' : '#475569', fontWeight: 700, fontSize: '13px' }}>
                        {exercise.hintUsageRate.toFixed(0)}%
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                        {exercise.avgTimeSpentMinutes.toFixed(1)} / {exercise.expectedTimeMinutes} นาที
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

        {/* ระบบเปลี่ยนหน้า Pagination */}
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
          sx={{
            borderTop: '1px solid #e2e8f0',
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontSize: '13px',
              color: '#64748b',
              fontWeight: 500,
            },
          }}
        />
      </TableContainer>
    </Box>
  );
}
