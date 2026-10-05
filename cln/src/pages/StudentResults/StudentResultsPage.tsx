import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Tooltip,
} from '@mui/material';
import { Search, X, Download, RotateCcw } from 'lucide-react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { getStudentPerformanceReport, type StudentReportData } from '../../api/reports';
import { StudentResultsKpiCards } from './components/StudentResultsKpiCards';
import { StudentResultsTable } from './components/StudentResultsTable';

export default function StudentResultsPage() {
  const [rawData, setRawData] = useState<StudentReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [progressFilter, setProgressFilter] = useState<string>('');

  // Pagination State สำหรับตาราง
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // ดึงข้อมูลรายงานสถิติผู้เรียนทั้งหมดจาก Backend
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await getStudentPerformanceReport();
      setRawData(data || []);
    } catch (err) {
      console.error('ไม่สามารถดึงข้อมูลผลการเรียนรู้ของผู้เรียนได้:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 1. กรองเฉพาะผู้เรียนที่มีการเข้าทำจริงสำหรับแสดงในตาราง (เคยกดทดลองรันโค้ด หรือส่งตรวจงานจริง)
  const attemptedStudents = useMemo(() => {
    return rawData.filter(
      (s) =>
        (s.attemptedExercises ?? 0) > 0 ||
        (s.totalRuns ?? 0) > 0 ||
        (s.totalSubmissions ?? 0) > 0 ||
        (s.passedExercises ?? 0) > 0
    );
  }, [rawData]);

  // 2. กรองตามคำค้นหา และสถานะการทำโจทย์ (เน้นผลลัพธ์ผ่าน/ไม่ผ่านเป็นหลัก)
  const filteredStudents = useMemo(() => {
    return attemptedStudents.filter((student) => {
      // 1. ค้นหาชื่อ-นามสกุล, username, คณะ, สถาบัน
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (student.fullName || '').toLowerCase().includes(q);
        const matchUsername = (student.username || '').toLowerCase().includes(q);
        const matchFaculty = (student.faculty || '').toLowerCase().includes(q);
        const matchUni = (student.university || '').toLowerCase().includes(q);
        if (!matchName && !matchUsername && !matchFaculty && !matchUni) return false;
      }

      const totalEx = student.totalExercises && student.totalExercises > 0 ? student.totalExercises : 1;
      const passedEx = student.passedExercises ?? 0;
      const passRate = (passedEx / totalEx) * 100;
      const submits = Number(student.totalSubmissions ?? 0);

      // 2. กรองตามสถานะการทำโจทย์ (ผ่านเกณฑ์, ยังไม่ผ่าน, ยังไม่ส่งตรวจ)
      if (progressFilter === 'passed' && passedEx === 0) return false;
      if (progressFilter === 'not_passed' && !(submits > 0 && passedEx === 0)) return false;
      if (progressFilter === 'not_submitted' && submits > 0) return false;
      if (progressFilter === 'completed' && passRate < 100) return false;

      return true;
    });
  }, [attemptedStudents, searchQuery, progressFilter]);

  // เช็คว่าเปิดใช้งานตัวกรองอยู่หรือไม่
  const isFiltered = searchQuery.trim() !== '' || progressFilter !== '';

  // ล้างตัวกรองทั้งหมด
  const handleResetFilters = () => {
    setSearchQuery('');
    setProgressFilter('');
    setPage(0);
  };

  // ควบคุมการเปลี่ยนหน้า
  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ส่งออกข้อมูลตารางสรุปเป็นไฟล์ CSV (ส่งออกตามผลการกรอง หรือเฉพาะผู้เข้าทำจริง)
  const handleExportCsv = () => {
    const dataToExport = isFiltered ? filteredStudents : attemptedStudents;
    if (dataToExport.length === 0) return;

    const headers = [
      'รหัสนักศึกษา (Username)',
      'ชื่อ-นามสกุล',
      'คณะ/สาขาวิชา',
      'สถาบันการศึกษา',
      'โจทย์ที่เข้าทำทั้งหมด (ข้อ)',
      'โจทย์ที่ผ่าน (ข้อ)',
      'โจทย์ที่เปิดให้ทำ (ข้อ)',
      'ความคืบหน้า (%)',
      'คะแนนเฉลี่ย',
      'ส่งตรวจรวม (ครั้ง)',
      'รันเฉลี่ยต่อข้อ (รอบ)',
    ];

    const rows = dataToExport.map((s) => {
      const totalEx = s.totalExercises && s.totalExercises > 0 ? s.totalExercises : 1;
      const passedEx = s.passedExercises ?? 0;
      const attemptedEx = s.attemptedExercises ?? passedEx;
      const percent = Math.min(100, Math.round((passedEx / totalEx) * 100));

      return [
        `"${(s.username || '').replace(/"/g, '""')}"`,
        `"${(s.fullName || '').replace(/"/g, '""')}"`,
        `"${(s.faculty || '-').replace(/"/g, '""')}"`,
        `"${(s.university || '-').replace(/"/g, '""')}"`,
        attemptedEx,
        passedEx,
        s.totalExercises || 0,
        `${percent}%`,
        s.averageScore ? s.averageScore.toFixed(1) : '0.0',
        s.totalSubmissions ?? 0,
        s.averageAttempts ? s.averageAttempts.toFixed(1) : '0.0',
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `student-results-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // สไตล์มาตรฐานสำหรับ Dropdown Select & Input เหมือนรูปที่ 1 เป๊ะๆ
  const selectSx = {
    borderRadius: '10px',
    bgcolor: '#ffffff',
    height: '42px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#0f172a',
    '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #e2e8f0' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0f172a', borderWidth: '1.5px' },
  };

  const labelSx = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#64748b',
    '&.Mui-focused': { color: '#0f172a' },
  };

  return (
    <MainLayout activeItem="StudentResults">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3.5,
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          pb: 6,
        }}
      >
        {/* ส่วนที่ 1: ส่วนหัวของหน้า (Header) พร้อมปุ่มดาวน์โหลด CSV สีเขียวทางการสไตล์รูปที่ 1 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
              สรุปผลการเรียนรู้รายบุคคล (Student Results)
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              สรุปภาพรวมและวิเคราะห์สถิติการเรียนรู้ของผู้เรียน (แสดงเฉพาะผู้เรียนที่มีการเข้าทำจริง)
            </Typography>
          </Box>

          <Tooltip title="ดาวน์โหลดรายงานสรุปผู้เรียนทั้งหมดเป็นไฟล์ CSV">
            <span>
              <Button
                variant="contained"
                startIcon={<Download size={16} />}
                onClick={handleExportCsv}
                disabled={attemptedStudents.length === 0}
                sx={{
                  bgcolor: '#107c41',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '13px',
                  borderRadius: '10px',
                  px: 2.2,
                  py: 0.9,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#0b5a2f', boxShadow: 'none' },
                  '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' },
                }}
              >
                ดาวน์โหลด CSV
              </Button>
            </span>
          </Tooltip>
        </Box>

        {loading ? (
          <Card
            sx={{
              p: 8,
              textAlign: 'center',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
              boxShadow: 'none',
            }}
          >
            <CircularProgress size={36} />
            <Typography variant="body2" sx={{ mt: 2, color: '#64748b', fontWeight: 600 }}>
              กำลังโหลดข้อมูลผลการเรียนรู้ของผู้เรียน...
            </Typography>
          </Card>
        ) : (
          <>
            {/* ส่วนที่ 2: การ์ดสรุปตัวชี้วัดภาพรวม (KPI Cards) ถอดแบบรูปที่ 1 */}
            <StudentResultsKpiCards students={rawData} />

            {/* ส่วนที่ 3 & 4: ตารางและแถบตัวกรองใน Card เดียวกัน ถอดแบบรูปที่ 1 */}
            <Card
              sx={{
                p: 3,
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                bgcolor: '#ffffff',
                boxShadow: 'none',
              }}
            >
              {/* ส่วนหัวของตาราง */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  ตารางสรุปผลการเรียนรู้รายบุคคล ({filteredStudents.length}{isFiltered ? ` / ${attemptedStudents.length}` : ''} คน)
                </Typography>
              </Box>

              {/* แถบตัวกรองแถวเดียวสมบูรณ์ (Single Unified Toolbar) สไตล์รูปที่ 1 */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  mb: 2.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  {/* ช่องค้นหาชื่อผู้เรียน หรือ รหัสนักศึกษา */}
                  <TextField
                    size="small"
                    placeholder="ค้นหาชื่อผู้เรียน หรือ รหัสนักศึกษา..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(0);
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search size={18} color="#94a3b8" />
                          </InputAdornment>
                        ),
                        endAdornment: searchQuery ? (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSearchQuery('');
                                setPage(0);
                              }}
                              sx={{ p: 0.5 }}
                            >
                              <X size={15} />
                            </IconButton>
                          </InputAdornment>
                        ) : null,
                      },
                    }}
                    sx={{
                      width: { xs: '100%', sm: 260 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        bgcolor: '#ffffff',
                        height: '42px',
                        fontSize: '13px',
                      },
                    }}
                  />

                  {/* ตัวกรองสถานะการทำโจทย์ ถอดแบบรูปที่ 2 คลีน ไร้รอยบาก */}
                  <FormControl size="small" sx={{ width: { xs: '100%', sm: 185 } }}>
                    <InputLabel sx={labelSx}>สถานะการทำโจทย์</InputLabel>
                    <Select
                      value={progressFilter}
                      onChange={(e) => {
                        setProgressFilter(e.target.value);
                        setPage(0);
                      }}
                      label="สถานะการทำโจทย์"
                      sx={selectSx}
                    >
                      <MenuItem value="">ทั้งหมด ({attemptedStudents.length})</MenuItem>
                      <MenuItem value="passed">ผ่านเกณฑ์แล้ว (≥ 1 ข้อ)</MenuItem>
                      <MenuItem value="not_passed">ยังไม่ผ่านเกณฑ์ (0 ข้อ)</MenuItem>
                      <MenuItem value="not_submitted">ยังไม่ส่งตรวจ (กดรันอย่างเดียว)</MenuItem>
                      <MenuItem value="completed">ผ่านครบ 100%</MenuItem>
                    </Select>
                  </FormControl>

                  {/* ปุ่มล้างตัวกรอง - สไตล์ข้อความพร้อมไอคอนหมุนกลับตามรูปที่ 1 */}
                  <Button
                    size="small"
                    startIcon={<RotateCcw size={14} />}
                    onClick={handleResetFilters}
                    disabled={!isFiltered}
                    sx={{
                      color: isFiltered ? '#475569' : '#94a3b8',
                      fontSize: '13px',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '8px',
                      px: 1.5,
                      py: 0.8,
                      '&:hover': {
                        bgcolor: isFiltered ? '#f1f5f9' : 'transparent',
                        color: isFiltered ? '#0f172a' : '#94a3b8',
                      },
                    }}
                  >
                    ล้างตัวกรอง
                  </Button>
                </Box>
              </Box>

              {/* ส่วนแสดงตารางข้อมูลผู้เรียน */}
              <StudentResultsTable
                students={filteredStudents}
                page={page}
                rowsPerPage={rowsPerPage}
                searchQuery={searchQuery}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                onResetSearch={() => {
                  setSearchQuery('');
                  setPage(0);
                }}
              />
            </Card>
          </>
        )}
      </Box>
    </MainLayout>
  );
}
