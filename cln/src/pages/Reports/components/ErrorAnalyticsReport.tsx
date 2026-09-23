import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Grid, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TablePagination, Avatar, LinearProgress,
  TextField, InputAdornment, IconButton
} from '@mui/material';
import {
  CheckCircle, Bug, Activity, Users, Eye, Search, X
} from 'lucide-react';
import type { ErrorReportResponse } from '../../../api/reports';

interface ErrorAnalyticsReportProps {
  data: ErrorReportResponse | null;
  isLoading: boolean;
}

export function ErrorAnalyticsReport({ data, isLoading }: ErrorAnalyticsReportProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userSearch, setUserSearch] = useState('');

  const studentList = useMemo(() => data?.studentExceptions || [], [data?.studentExceptions]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserSearch(e.target.value);
    setPage(0);
  };

  // กรองข้อมูลผู้เรียนตามคำค้นหาแบบ Real-time เพื่อให้อาจารย์ค้นหาชื่อ, username หรือสถาบันได้ทันที
  const filteredStudents = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return studentList;
    return studentList.filter((st) => {
      const matchName = (st.fullName || '').toLowerCase().includes(q);
      const matchUsername = (st.username || '').toLowerCase().includes(q);
      const matchUni = (st.university || '').toLowerCase().includes(q);
      const matchFaculty = (st.faculty || '').toLowerCase().includes(q);
      return matchName || matchUsername || matchUni || matchFaculty;
    });
  }, [studentList, userSearch]);

  // ป้องกัน Pagination ค้างหน้าที่เกินจากจำนวนข้อมูลจริงเมื่อผลการกรองลดลง
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const safePage = (page >= totalPages && totalPages > 0) ? 0 : page;

  const paginatedStudents = useMemo(() => {
    return filteredStudents.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);
  }, [filteredStudents, safePage, rowsPerPage]);

  return (
    <Box>
      {/* 1. Header สรุปภาพรวม */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.5 }}>

        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
          สรุปข้อผิดพลาด & Exceptions
        </Typography>
      </Box>

      {/* 2. Top KPI Cards สรุปตัวเลขทั้งระบบ (การ์ดขาว คลีน มินิมอล) */}
      {!isLoading && data && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                <Activity size={22} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '13px' }}>จำนวน Exception รวมทั้งระบบ</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.3 }}>{data.totalSystemExceptions} ครั้ง</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                <Users size={22} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '13px' }}>ผู้เรียนที่พบข้อผิดพลาด</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.3 }}>{data.totalAffectedStudents} คน</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                <Bug size={22} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '13px' }}>พบบ่อยที่สุดในระบบ</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.3 }}>{data.topErrorType}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* 3. แถบสัดส่วนประเภท Exception ในระบบ (สีขาว เทา สบายตา) */}
      {!isLoading && data?.errorTypeDistribution && data.errorTypeDistribution.length > 0 && (
        <Paper sx={{ p: 2.5, mb: 3, borderRadius: '14px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: 'none' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', mb: 1.2, display: 'block', fontSize: '13px' }}>
            สัดส่วนหมวดหมู่ Exception ในระบบ:  รอทำchart
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {data.errorTypeDistribution.map((item) => (
              <Chip
                key={item.errorType}
                label={`${item.errorType}: ${item.occurrenceCount} ครั้ง (${item.percentage.toFixed(1)}%)`}
                sx={{
                  bgcolor: '#f8fafc',
                  color: '#1e293b',
                  border: '1px solid #e2e8f0',
                  fontWeight: 600,
                  fontSize: '12px',
                  borderRadius: '8px',
                  py: 0.5,
                }}
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* 4. ส่วนหัวและช่องค้นหาผู้เรียน (Minimalist Search Bar) */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          gap: 1.5, 
          mb: 2 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
            รายชื่อผู้เรียนที่พบข้อผิดพลาด
          </Typography>
          {filteredStudents.length > 0 && (
            <Chip
              label={`${filteredStudents.length} คน`}
              size="small"
              sx={{
                bgcolor: '#f1f5f9',
                color: '#475569',
                fontWeight: 700,
                fontSize: '12px',
                height: '22px',
                borderRadius: '6px'
              }}
            />
          )}
        </Box>

        {/* ช่องค้นหา User กะทัดรัด คลีนมินิมอล */}
        <TextField
          size="small"
          placeholder="ค้นหาชื่อผู้เรียน หรือ Username..."
          value={userSearch}
          onChange={handleSearchChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="#64748b" />
                </InputAdornment>
              ),
              endAdornment: userSearch ? (
                <InputAdornment position="end">
                  <IconButton 
                    size="small" 
                    onClick={() => { setUserSearch(''); setPage(0); }} 
                    sx={{ p: 0.5 }}
                    aria-label="ล้างคำค้น"
                  >
                    <X size={14} color="#94a3b8" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }
          }}
          sx={{
            width: { xs: '100%', sm: 280 },
            bgcolor: '#ffffff',
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              fontSize: '13px',
              bgcolor: '#ffffff',
              '& fieldset': { borderColor: '#e2e8f0' },
              '&:hover fieldset': { borderColor: '#cbd5e1' },
              '&.Mui-focused fieldset': { borderColor: '#2563eb' },
            }
          }}
        />
      </Box>

      {/* ตารางสรุปภาพรวมรายบุคคลแบบเหลี่ยม ชิดขอบ ไร้ขอบมน (Square / Seamless Table) เหมือนแท็บวิเคราะห์ประสิทธิภาพโจทย์ */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <TableRow sx={{ '& th': { bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', py: 1.8, fontSize: '13px', fontWeight: 700, color: '#475569' } }}>
              <TableCell>ผู้เรียน (Student)</TableCell>
              <TableCell>สถาบัน / คณะ</TableCell>
              <TableCell align="center">จำนวนแบบฝึกหัดที่ติดปัญหา</TableCell>
              <TableCell align="center">จำนวน Exception รวม</TableCell>
              <TableCell align="center">รายละเอียด</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, borderBottom: '1px solid #f1f5f9' }}>
                  <Box sx={{ maxWidth: 300, mx: 'auto' }}>
                    <LinearProgress sx={{ borderRadius: 3, height: 6 }} />
                    <Typography variant="caption" sx={{ color: '#64748b', mt: 1, display: 'block' }}>
                      กำลังโหลดข้อมูลข้อผิดพลาด...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, borderBottom: '1px solid #f1f5f9' }}>
                  <CheckCircle size={36} color="#10b981" style={{ marginBottom: 8 }} />
                  <Typography sx={{ color: '#64748b', fontWeight: 700, fontSize: '14px' }}>
                    {studentList.length === 0 ? 'ไม่พบประวัติข้อผิดพลาดในระบบ' : 'ไม่พบข้อมูลที่ตรงกับคำค้นหา'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedStudents.map((st) => (
                <TableRow key={st.userId} hover sx={{ '& td': { borderBottom: '1px solid #f1f5f9' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 34, height: 34, bgcolor: '#fee2e2', color: '#dc2626', fontSize: '13px', fontWeight: 700 }}>
                        {st.fullName ? st.fullName.charAt(0) : 'U'}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                          {st.fullName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          @{st.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                      {st.university || '-'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {st.faculty || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${st.exercises.length} แบบฝึกหัด`}
                      size="small"
                      sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 700, borderRadius: '8px' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${st.totalExceptions} ครั้ง`}
                      size="small"
                      sx={{
                        bgcolor: '#fff1f2',
                        color: '#dc2626',
                        border: '1px solid #fecdd3',
                        fontWeight: 800,
                        fontSize: '12.5px',
                        borderRadius: '8px',
                        px: 0.5,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Eye size={14} />}
                      onClick={() => navigate(`/reports/students/${st.userId}/errors`)}
                      sx={{
                        borderRadius: '8px',
                        borderColor: '#cbd5e1',
                        color: '#2563eb',
                        fontWeight: 700,
                        fontSize: '12px',
                        textTransform: 'none',
                        py: 0.5,
                        px: 1.5,
                        whiteSpace: 'nowrap',
                        '&:hover': { bgcolor: '#eff6ff', borderColor: '#93c5fd' },
                      }}
                    >
                      รายละเอียด
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ส่วนเปลี่ยนหน้า (Pagination) ใต้ตารางแบบเหลี่ยม ไร้กรอบมนหุ้ม */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredStudents.length}
        rowsPerPage={rowsPerPage}
        page={safePage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="แสดงแถวต่อหน้า:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count}`}
        sx={{ borderTop: '1px solid #e2e8f0' }}
      />
    </Box>
  );
}
