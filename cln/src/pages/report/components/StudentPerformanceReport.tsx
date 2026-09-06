import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, LinearProgress, Button, Tooltip, TablePagination, Avatar, TableSortLabel
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Download, Award, Users, GraduationCap, ArrowUp, ArrowDown } from 'lucide-react';
import type { StudentReportData } from '../../../api/reports';

interface StudentPerformanceReportProps {
  data: StudentReportData[];
  isLoading: boolean;
}

type SortField = 'name' | 'progress' | 'averageScore' | 'averageAttempts' | 'lastActiveAt';

/**
 * คอมโพเนนต์แสดงไอคอนสถานะการเรียงลำดับในตาราง
 */
function SortIconIndicator({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) {
  if (!active) {
    return <ArrowUp size={14} style={{ color: '#cbd5e1', marginLeft: 4 }} />;
  }
  return direction === 'asc' ? (
    <ArrowUp size={14} style={{ color: '#2563eb', marginLeft: 4 }} />
  ) : (
    <ArrowDown size={14} style={{ color: '#2563eb', marginLeft: 4 }} />
  );
}

/**
 * คอมโพเนนต์แสดงตารางเปรียบเทียบคะแนนความคืบหน้าของผู้เรียนรายบุคคล
 * ตกแต่งตามมาตรฐาน Student Home (Paper 16px, TableHead #eff6ff, Badges 8px)
 * พร้อมระบบ Sort ครบทุกคอลัมน์สำคัญ (คะแนนเฉลี่ย, ความคืบหน้า, ชื่อผู้เรียน, รันโค้ดเฉลี่ย, ใช้งานล่าสุด)
 */
export function StudentPerformanceReport({ data, isLoading }: StudentPerformanceReportProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('averageScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    setPage(0);
  }, [data.length, sortField, sortOrder]);

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder(field === 'name' ? 'asc' : 'desc');
    }
  };

  // เรียงลำดับข้อมูลผู้เรียนตาม sortField และ sortOrder
  const sortedData = [...data].sort((a, b) => {
    if (sortField === 'name') {
      const nameA = a.fullName || '';
      const nameB = b.fullName || '';
      return sortOrder === 'asc' ? nameA.localeCompare(nameB, 'th') : nameB.localeCompare(nameA, 'th');
    }
    
    let valA = 0;
    let valB = 0;
    if (sortField === 'progress') {
      valA = a.totalSessions > 0 ? a.completedSessions / a.totalSessions : 0;
      valB = b.totalSessions > 0 ? b.completedSessions / b.totalSessions : 0;
    } else if (sortField === 'averageScore') {
      valA = a.averageScore;
      valB = b.averageScore;
    } else if (sortField === 'averageAttempts') {
      valA = a.averageAttempts;
      valB = b.averageAttempts;
    } else if (sortField === 'lastActiveAt') {
      valA = a.lastActiveAt ? new Date(a.lastActiveAt).getTime() : 0;
      valB = b.lastActiveAt ? new Date(b.lastActiveAt).getTime() : 0;
    }
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // ฟังก์ชันดาวน์โหลดรายงานเป็นไฟล์ CSV
  const exportToCSV = () => {
    if (data.length === 0) return;
    const headers = ['Username', 'ชื่อ-นามสกุล', 'มหาวิทยาลัย', 'คณะ', 'บทเรียนที่สำเร็จ', 'คะแนนเฉลี่ย', 'รันโค้ดเฉลี่ย/ข้อ'];
    const rows = sortedData.map(item => [
      `"${item.username}"`,
      `"${item.fullName}"`,
      `"${item.university}"`,
      `"${item.faculty}"`,
      `"${item.completedSessions}/${item.totalSessions}"`,
      item.averageScore.toFixed(2),
      item.averageAttempts.toFixed(1),
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student_performance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      {/* Header ของตาราง และปุ่มส่งออก CSV */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GraduationCap size={20} color="#2563eb" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
            ตารางเปรียบเทียบคะแนนผู้เรียน ({data.length} คน)
          </Typography>
        </Box>
        <Tooltip title="ดาวน์โหลดรายงานนี้เป็นไฟล์ CSV">
          <span>
            <Button 
              variant="contained"
              onClick={exportToCSV} 
              disabled={data.length === 0}
              startIcon={<Download size={16} />}
              sx={{ 
                bgcolor: '#10b981', 
                color: '#ffffff', 
                fontWeight: 700,
                fontSize: '13px',
                borderRadius: '8px',
                px: 2.5,
                py: 0.8,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#059669', boxShadow: 'none' },
                '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' }
              }}
            >
              ส่งออก CSV
            </Button>
          </span>
        </Tooltip>
      </Box>

      {/* Container ตารางสถิติผู้เรียน - ทรงมน 16px หัวตารางสีฟ้า #eff6ff ตามแบบ Student Home */}
      <Paper sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ '& th': { bgcolor: '#eff6ff', borderBottom: '1px solid #e2e8f0' } }}>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>
                  <TableSortLabel
                    active={sortField === 'name'}
                    direction={sortField === 'name' ? sortOrder : 'asc'}
                    onClick={() => handleSort('name')}
                    IconComponent={() => (
                      <SortIconIndicator active={sortField === 'name'} direction={sortOrder} />
                    )}
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      '&.MuiTableSortLabel-root': { color: '#475569' },
                      '&.MuiTableSortLabel-root:hover': { color: '#2563eb' },
                    }}
                  >
                    นักศึกษา
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>มหาวิทยาลัย / คณะ</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }} width="200px">
                  <TableSortLabel
                    active={sortField === 'progress'}
                    direction={sortField === 'progress' ? sortOrder : 'desc'}
                    onClick={() => handleSort('progress')}
                    IconComponent={() => (
                      <SortIconIndicator active={sortField === 'progress'} direction={sortOrder} />
                    )}
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      '&.MuiTableSortLabel-root': { color: '#475569' },
                      '&.MuiTableSortLabel-root:hover': { color: '#2563eb' },
                    }}
                  >
                    ความคืบหน้าการเรียน
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }} align="center">
                  <TableSortLabel
                    active={sortField === 'averageScore'}
                    direction={sortField === 'averageScore' ? sortOrder : 'desc'}
                    onClick={() => handleSort('averageScore')}
                    IconComponent={() => (
                      <SortIconIndicator active={sortField === 'averageScore'} direction={sortOrder} />
                    )}
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      '&.MuiTableSortLabel-root': { color: '#475569' },
                      '&.MuiTableSortLabel-root:hover': { color: '#2563eb' },
                    }}
                  >
                    คะแนนรวมเฉลี่ย
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }} align="center">
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
                    ความพยายามเฉลี่ย
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>
                  <TableSortLabel
                    active={sortField === 'lastActiveAt'}
                    direction={sortField === 'lastActiveAt' ? sortOrder : 'desc'}
                    onClick={() => handleSort('lastActiveAt')}
                    IconComponent={() => (
                      <SortIconIndicator active={sortField === 'lastActiveAt'} direction={sortOrder} />
                    )}
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      '&.MuiTableSortLabel-root': { color: '#475569' },
                      '&.MuiTableSortLabel-root:hover': { color: '#2563eb' },
                    }}
                  >
                    ใช้งานล่าสุด
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ width: '100%', maxWidth: 300, mx: 'auto' }}>
                      <LinearProgress sx={{ borderRadius: 3, height: 6 }} />
                      <Typography variant="caption" sx={{ color: '#64748b', mt: 1, display: 'block' }}>กำลังโหลดรายงานความคืบหน้า...</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Users size={36} color="#cbd5e1" style={{ marginBottom: 8 }} />
                    <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '14px' }}>ไม่พบข้อมูลรายชื่อผู้เรียน</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((student) => {
                  const percentage = student.totalSessions > 0 ? (student.completedSessions / student.totalSessions) * 100 : 0;
                  return (
                    <TableRow key={student.userId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 34, height: 34, bgcolor: '#eff6ff', color: '#3b82f6', fontSize: '14px', fontWeight: 700, border: '1px solid #bfdbfe' }}>
                            {student.fullName ? student.fullName.charAt(0) : 'S'}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{student.fullName}</Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>@{student.username}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{student.university || '-'}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>{student.faculty || '-'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>
                              {student.completedSessions} / {student.totalSessions} เซสชัน
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#10b981' }}>
                              {percentage.toFixed(0)}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={percentage} 
                            sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.2, py: 0.5, bgcolor: '#eff6ff', borderRadius: '8px', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                          <Award size={14} />
                          <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>{student.averageScore.toFixed(1)}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#475569' }}>
                          {student.averageAttempts.toFixed(1)} ครั้ง
                        </Typography>
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
          sx={{ borderTop: '1px solid #e2e8f0', color: '#64748b' }}
        />
      </Paper>
    </Box>
  );
}



