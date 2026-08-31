import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, LinearProgress, IconButton, Tooltip, TablePagination
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Download, Award } from 'lucide-react';
import type { StudentReportData } from '../../../api/reports';

interface StudentPerformanceReportProps {
  data: StudentReportData[];
  isLoading: boolean;
}

export function StudentPerformanceReport({ data, isLoading }: StudentPerformanceReportProps) {
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
  
  const exportToCSV = () => {
    if (data.length === 0) return;
    const headers = ['Username', 'ชื่อ-นามสกุล', 'มหาวิทยาลัย', 'คณะ', 'บทเรียนที่สำเร็จ', 'คะแนนเฉลี่ย', 'รันโค้ดเฉลี่ย/ข้อ'];
    const rows = data.map(item => [
      item.username,
      item.fullName,
      item.university,
      item.faculty,
      `${item.completedSessions}/${item.totalSessions}`,
      item.averageScore.toFixed(2),
      item.averageAttempts.toFixed(1),
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
          ตารางเปรียบเทียบคะแนนผู้เรียน ({data.length} คน)
        </Typography>
        <Tooltip title="ดาวน์โหลดเป็น Excel/CSV">
          <IconButton 
            onClick={exportToCSV} 
            disabled={data.length === 0}
            sx={{ bgcolor: '#ecfdf5', color: '#059669', '&:hover': { bgcolor: '#d1fae5' } }}
          >
            <Download size={18} />
          </IconButton>
        </Tooltip>
      </Box>

      <Paper sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>นักศึกษา</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>มหาวิทยาลัย / คณะ</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }} width="180px">เซสชันจบแล้ว</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="center">คะแนนรวมเฉลี่ย</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="center">ความพยายามเฉลี่ย</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>ใช้งานล่าสุด</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><LinearProgress /></TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: '#94a3b8' }}>ไม่พบรายชื่อผู้เรียน</TableCell></TableRow>
            ) : (
              paginatedData.map((student) => {
                const percentage = student.totalSessions > 0 ? (student.completedSessions / student.totalSessions) * 100 : 0;
                return (
                  <TableRow key={student.userId} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{student.fullName}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>@{student.username}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>{student.university}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>{student.faculty}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: '100%' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={percentage} 
                            sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 35 }}>
                          {student.completedSessions}/{student.totalSessions}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.5, bgcolor: '#eff6ff', borderRadius: '6px', color: '#2563eb' }}>
                        <Award size={14} />
                        <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>{student.averageScore.toFixed(1)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontWeight: 600, fontSize: '13px' }}>{student.averageAttempts.toFixed(1)} ครั้ง</Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '13px', color: '#64748b' }}>
                      {student.lastActiveAt ? new Date(student.lastActiveAt).toLocaleDateString('th-TH') : '-'}
                    </TableCell>
                  </TableRow>
                );
              })
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
