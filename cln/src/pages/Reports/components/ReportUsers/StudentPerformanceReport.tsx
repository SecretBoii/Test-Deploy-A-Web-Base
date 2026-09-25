import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Box, LinearProgress, Button, Tooltip, TablePagination, Avatar,
  TextField, InputAdornment, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, RotateCcw } from 'lucide-react';
import type { StudentReportData } from '../../../../api/reports';

interface StudentPerformanceReportProps {
  data: StudentReportData[];
  isLoading: boolean;
}

export function StudentPerformanceReport({ data, isLoading }: StudentPerformanceReportProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ตัวกรองผู้เรียนแบบ Client-side Real-time (ค้นหาชื่อ/username, ความคืบหน้า, ช่วงคะแนน, การเข้าใช้งาน)
  const [search, setSearch] = useState('');
  const [progressFilter, setProgressFilter] = useState('');
  const [scoreFilter, setScoreFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  
  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // รีเซ็ตตัวกรองทั้งหมดกลับสู่ค่าเริ่มต้น
  const handleReset = () => {
    setSearch('');
    setProgressFilter('');
    setScoreFilter('');
    setActiveFilter('');
    setPage(0);
  };

  // ตรวจสอบสถานะว่ามีการกรองข้อมูลอยู่หรือไม่ เพื่อเปิด/ปิดปุ่มล้างตัวกรอง
  const isFiltered = Boolean(search.trim() || progressFilter || scoreFilter || activeFilter);

  // กรองข้อมูลผู้เรียนบน Client-side ตามเงื่อนไขค้นหา ความคืบหน้า คะแนน และเวลาใช้งานล่าสุด
  const filteredData = useMemo(() => {
    const qSearch = search.trim().toLowerCase();

    return data.filter((student) => {
      // 1. ค้นหาชื่อ-นามสกุล หรือ Username
      if (qSearch) {
        const matchName = (student.fullName || '').toLowerCase().includes(qSearch);
        const matchUsername = (student.username || '').toLowerCase().includes(qSearch);
        if (!matchName && !matchUsername) return false;
      }

      // 2. กรองตามระดับความคืบหน้าการเรียน
      if (progressFilter) {
        const totalEx = student.totalExercises || student.totalSessions || 1;
        const passedEx = student.passedExercises ?? student.completedSessions ?? 0;
        const percent = totalEx > 0 ? (passedEx / totalEx) * 100 : 0;

        if (progressFilter === 'zero' && (passedEx > 0 || percent > 0)) return false;
        if (progressFilter === 'in_progress' && (percent <= 0 || percent >= 100)) return false;
        if (progressFilter === 'completed' && percent < 100) return false;
      }

      // 3. กรองตามช่วงคะแนนเฉลี่ย
      if (scoreFilter) {
        const score = student.averageScore ?? 0;
        if (scoreFilter === 'high' && score < 80) return false;
        if (scoreFilter === 'medium' && (score < 50 || score >= 80)) return false;
        if (scoreFilter === 'low' && score >= 50) return false;
      }

      // 4. กรองตามสถานะการเข้าใช้งานล่าสุด (ภายใน 7 วัน หรือ ไม่มีความเคลื่อนไหว)
      if (activeFilter) {
        const hasActiveDate = Boolean(student.lastActiveAt);
        if (activeFilter === 'active_week') {
          if (!hasActiveDate) return false;
          const lastDate = new Date(student.lastActiveAt!).getTime();
          if (isNaN(lastDate)) return false;
          const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          if (lastDate < sevenDaysAgo) return false;
        } else if (activeFilter === 'inactive') {
          if (hasActiveDate) {
            const lastDate = new Date(student.lastActiveAt!).getTime();
            if (!isNaN(lastDate)) {
              const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
              if (lastDate >= sevenDaysAgo) return false;
            }
          }
        }
      }

      return true;
    });
  }, [data, search, progressFilter, scoreFilter, activeFilter]);

  // เรียงลำดับข้อมูลผู้เรียนเริ่มต้นตามคะแนนเฉลี่ยจากมากไปน้อย เพื่อให้อาจารย์เห็นภาพรวมผลสัมฤทธิ์ได้ทันที
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0));
  }, [filteredData]);

  // ป้องกัน Pagination ค้างหน้าที่เกินจากจำนวนข้อมูลจริง
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const safePage = (page >= totalPages && totalPages > 0) ? 0 : page;

  const paginatedData = sortedData.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);

  // ฟังก์ชันดาวน์โหลดรายงานเป็นไฟล์ CSV
  const exportToCSV = () => {
    if (sortedData.length === 0) return;
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

  // สไตล์ช่องตัวกรองแบบ Clean Modern SaaS (พื้นขาวขอบเทาคมชัด สไตล์ KOKISO)
  const selectSx = {
    borderRadius: '10px',
    bgcolor: '#ffffff',
    height: '44px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#0f172a',
    '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #e2e8f0' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0f172a', borderWidth: '1.5px' },
    '& .MuiSelect-select': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      pr: '32px !important',
    },
  };

  const labelSx = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#64748b',
    '&.Mui-focused': { color: '#0f172a' },
  };

  return (
    <Box>
      {/* Header ของตาราง และปุ่มส่งออก CSV แบบ Solid Dark-Navy */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
            ตารางสรุปผลการเรียน ({filteredData.length}{isFiltered ? ` / ${data.length}` : ''} คน)
          </Typography>
        </Box>
        <Tooltip title="ดาวน์โหลดรายงานนี้เป็นไฟล์ CSV (เปิดใน Excel ได้ทันที)">
          <span>
            <Button 
              variant="contained"
              onClick={exportToCSV} 
              disabled={data.length === 0}
              sx={{ 
                bgcolor: '#107c41', // สีเขียวทางการของ Microsoft Excel
                color: '#ffffff', 
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: '10px',
                px: 2.2,
                py: 0.9,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#0b5a2f', boxShadow: 'none' }, // สีเขียวเข้มตอน Hover
                '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' }
              }}
            >
              ดาวน์โหลด CSV
            </Button>
          </span>
        </Tooltip>
      </Box>

      {/* แถบตัวกรองแถวเดียวสมบูรณ์ (Single Unified Toolbar) - พื้นหลังขาวคมชัด ขอบมน 10px */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* 0. ช่องค้นหาชื่อผู้เรียน หรือ Username */}
        <TextField
          size="small"
          placeholder="ค้นหาชื่อผู้เรียน หรือ Username..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ color: '#94a3b8', mr: 1 }}>
                  <Search size={18} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '10px',
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                height: '44px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#0f172a',
                '& fieldset': { border: 'none' },
                '&:hover': { borderColor: '#94a3b8' },
                '&.Mui-focused': { borderColor: '#0f172a' },
                transition: 'all 0.15s ease',
              },
            },
          }}
          sx={{ width: { xs: '100%', sm: 240 } }}
        />

        {/* 1. กรองระดับความคืบหน้า */}
        <FormControl size="small" sx={{ width: { xs: '100%', sm: 180 }, flexShrink: 0 }}>
          <InputLabel sx={labelSx}>ความคืบหน้า</InputLabel>
          <Select
            value={progressFilter}
            onChange={(e) => {
              setProgressFilter(e.target.value);
              setPage(0);
            }}
            label="ความคืบหน้า"
            sx={selectSx}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            <MenuItem value="zero">ยังไม่เริ่มทำ (0%)</MenuItem>
            <MenuItem value="in_progress">กำลังดำเนินการ (1-99%)</MenuItem>
            <MenuItem value="completed">ผ่านครบทั้งหมด (100%)</MenuItem>
          </Select>
        </FormControl>

        {/* 2. กรองช่วงคะแนนเฉลี่ย */}
        <FormControl size="small" sx={{ width: { xs: '100%', sm: 170 }, flexShrink: 0 }}>
          <InputLabel sx={labelSx}>ช่วงคะแนนเฉลี่ย</InputLabel>
          <Select
            value={scoreFilter}
            onChange={(e) => {
              setScoreFilter(e.target.value);
              setPage(0);
            }}
            label="ช่วงคะแนนเฉลี่ย"
            sx={selectSx}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            <MenuItem value="high">ดีเยี่ยม (≥ 80)</MenuItem>
            <MenuItem value="medium">ผ่านเกณฑ์ (50 - 79)</MenuItem>
            <MenuItem value="low">ต่ำกว่าเกณฑ์ (&lt; 50)</MenuItem>
          </Select>
        </FormControl>

        {/* 3. กรองการเข้าใช้งานล่าสุด */}
        <FormControl size="small" sx={{ width: { xs: '100%', sm: 170 }, flexShrink: 0 }}>
          <InputLabel sx={labelSx}>การใช้งานล่าสุด</InputLabel>
          <Select
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value);
              setPage(0);
            }}
            label="การใช้งานล่าสุด"
            sx={selectSx}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            <MenuItem value="active_week">ภายใน 7 วัน</MenuItem>
            <MenuItem value="inactive">ไม่มีความเคลื่อนไหว</MenuItem>
          </Select>
        </FormControl>

        {/* 4. ปุ่มล้างตัวกรอง */}
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={!isFiltered}
          startIcon={<RotateCcw size={15} />}
          sx={{
            height: '44px',
            borderRadius: '10px',
            px: 2,
            borderColor: isFiltered ? '#0f172a' : '#e2e8f0',
            color: isFiltered ? '#0f172a' : '#94a3b8',
            bgcolor: '#ffffff',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#f8fafc',
              borderColor: '#0f172a',
              color: '#0f172a',
              boxShadow: 'none',
            },
            '&.Mui-disabled': {
              bgcolor: '#ffffff',
              borderColor: '#f1f5f9',
              color: '#cbd5e1',
            },
            transition: 'all 0.15s ease',
          }}
        >
          ล้างตัวกรอง
        </Button>
      </Box>

      {/* TableContainer ตารางสถิติผู้เรียน - หัวตารางมาตรฐาน */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <TableRow sx={{ '& th': { bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', py: 1.8, fontSize: '13px', fontWeight: 700, color: '#475569' } }}>
              <TableCell>นักศึกษา</TableCell>
              <TableCell>มหาวิทยาลัย / คณะ</TableCell>
              <TableCell width="200px">ความคืบหน้าการเรียน</TableCell>
              <TableCell align="center">
                <Tooltip title="คำนวณจากคะแนนที่ดีที่สุดของแต่ละข้อที่ผู้เรียนทำ">
                  <Box component="span" sx={{ cursor: 'help' }}>คะแนนเฉลี่ย</Box>
                </Tooltip>
              </TableCell>
              <TableCell align="center">ความพยายามเฉลี่ย</TableCell>
              <TableCell>ใช้งานล่าสุด</TableCell>
              <TableCell align="center" sx={{ minWidth: '130px', fontWeight: 700, color: '#475569' }}>
                การจัดการ
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Box sx={{ width: '100%', maxWidth: 300, mx: 'auto' }}>
                    <LinearProgress sx={{ borderRadius: 3, height: 6 }} />
                    <Typography variant="caption" sx={{ color: '#64748b', mt: 1, display: 'block' }}>กำลังโหลดรายงานความคืบหน้า...</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Users size={36} color="#cbd5e1" style={{ marginBottom: 8 }} />
                  <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '14px' }}>
                    {isFiltered ? 'ไม่พบข้อมูลรายชื่อผู้เรียนที่ตรงกับเงื่อนไข' : 'ไม่พบข้อมูลรายชื่อผู้เรียน'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((student) => {
                const totalEx = student.totalExercises || student.totalSessions || 25;
                const passedEx = student.passedExercises ?? student.completedSessions ?? 0;
                const percentage = totalEx > 0 ? (passedEx / totalEx) * 100 : 0;
                return (
                  <TableRow key={student.userId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: '#f1f5f9', color: '#0f172a', fontSize: '13px', fontWeight: 700, border: '1px solid #e2e8f0' }}>
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
                          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12px' }}>
                            ผ่าน {passedEx} / {totalEx} ข้อ
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12px', fontWeight: 500 }}>
                            {percentage.toFixed(0)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={percentage} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3, 
                            bgcolor: '#f1f5f9', 
                            '& .MuiLinearProgress-bar': { bgcolor: '#0f172a', borderRadius: 3 } 
                          }}
                        />
                      </Box>
                    </TableCell>
                    {/* คะแนนเฉลี่ย: ขนาดปกติ สีเดียวกันทุกแถว */}
                    <TableCell align="center">
                      <Typography sx={{ 
                        fontSize: '13px', 
                        fontWeight: 500, 
                        color: '#0f172a' 
                      }}>
                        {student.averageScore.toFixed(1)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontWeight: 500, fontSize: '13px', color: '#0f172a' }}>
                        {student.averageAttempts.toFixed(1)} ครั้ง
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '13px', color: '#64748b' }}>
                      {student.lastActiveAt ? new Date(student.lastActiveAt).toLocaleDateString('th-TH') : '-'}
                    </TableCell>
                    {/* ปุ่มจัดการ: Solid Dark-Navy คมชัด หนักแน่น ไม่ใช้สีอ่อน */}
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/reports/students/${student.userId}`)}
                        sx={{
                          borderRadius: '8px',
                          bgcolor: '#0f172a',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '12px',
                          textTransform: 'none',
                          boxShadow: 'none',
                          py: 0.6,
                          px: 1.6,
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            bgcolor: '#1e293b',
                            boxShadow: 'none',
                          }
                        }}
                      >
                        ดูประวัติการทำ
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* ระบบเปลี่ยนหน้า Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={safePage}
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
