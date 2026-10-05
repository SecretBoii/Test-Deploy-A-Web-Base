import { useState, useEffect, useMemo } from 'react';
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
import { getExerciseAnalyticsReport, type ExerciseAnalyticsData } from '../../api/reports';
import { ExerciseResultsKpiCards } from './components/ExerciseResultsKpiCards';
import { ExerciseResultsTable } from './components/ExerciseResultsTable';

export default function ExerciseResultsPage() {
  const [rawData, setRawData] = useState<ExerciseAnalyticsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [topicFilter, setTopicFilter] = useState<string>('');

  // Pagination State สำหรับตาราง
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // ดึงข้อมูลรายงานสถิติแบบฝึกหัดทั้งหมดจาก Backend
  useEffect(() => {
    let ignore = false;

    const fetchExercises = async () => {
      setLoading(true);
      try {
        const data = await getExerciseAnalyticsReport();
        if (!ignore) {
          setRawData(data || []);
        }
      } catch (err) {
        if (!ignore) {
          console.error('ไม่สามารถดึงข้อมูลผลการทำแบบฝึกหัดได้:', err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchExercises();

    return () => {
      ignore = true;
    };
  }, []);

  // 1. กรองเฉพาะโจทย์ที่มีผู้เข้าทำจริงเท่านั้น (Strict Rule: attemptedStudents > 0)
  const attemptedExercises = useMemo(() => {
    return rawData.filter((ex) => (ex.attemptedStudents ?? 0) > 0);
  }, [rawData]);

  // รวบรวมรายชื่อหัวข้อบทเรียนที่ไม่ซ้ำ สำหรับตัวเลือกในดรอปดาวน์
  const availableTopics = useMemo(() => {
    const set = new Set<string>();
    attemptedExercises.forEach((ex) => {
      if (ex.topic && ex.topic.trim()) {
        set.add(ex.topic.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'th'));
  }, [attemptedExercises]);

  // 2. กรองตามคำค้นหา ระดับความยาก และหัวข้อบทเรียน
  const filteredExercises = useMemo(() => {
    return attemptedExercises.filter((ex) => {
      // ตัวกรองคำค้นหา
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = ex.title?.toLowerCase().includes(q);
        const matchId = String(ex.exerciseId).includes(q);
        const matchTopic = ex.topic?.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchTopic) return false;
      }

      // ตัวกรองระดับความยาก
      if (difficultyFilter !== '' && String(ex.difficultyLevel) !== difficultyFilter) {
        return false;
      }

      // ตัวกรองหัวข้อบทเรียน
      if (topicFilter !== '' && (ex.topic || '').trim() !== topicFilter) {
        return false;
      }

      return true;
    });
  }, [attemptedExercises, searchQuery, difficultyFilter, topicFilter]);

  // เช็คว่ากำลังเปิดใช้งานตัวกรองอยู่หรือไม่
  const isFiltered = searchQuery.trim() !== '' || difficultyFilter !== '' || topicFilter !== '';

  // ล้างตัวกรองทั้งหมด
  const handleResetFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('');
    setTopicFilter('');
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

  // ส่งออกข้อมูลตารางสรุปเป็นไฟล์ CSV (ส่งออกตามผลการกรอง หรือทั้งหมด)
  const handleExportCsv = () => {
    const dataToExport = isFiltered ? filteredExercises : attemptedExercises;
    if (dataToExport.length === 0) return;

    const headers = [
      'รหัสแบบฝึกหัด',
      'ชื่อโจทย์',
      'หัวข้อ',
      'ระดับความยาก',
      'จำนวนผู้เข้าทำ (คน)',
      'ส่งตรวจรวม (ครั้ง)',
      'ผ่านเกณฑ์ (คน)',
      'อัตราการผ่าน (%)',
      'คะแนนเฉลี่ย',
      'เวลาเฉลี่ยที่ใช้จริง (นาที)',
      'เวลาเป้าหมาย (นาที)',
      'รันเฉลี่ยต่อคน',
      'ส่งตรวจเฉลี่ยต่อคน',
    ];

    const rows = dataToExport.map((ex) => [
      ex.exerciseId,
      `"${(ex.title || '').replace(/"/g, '""')}"`,
      `"${(ex.topic || '').replace(/"/g, '""')}"`,
      `Level ${ex.difficultyLevel}`,
      ex.attemptedStudents ?? 0,
      ex.totalSubmits ?? 0,
      ex.passedStudents ?? 0,
      (ex.passRateAttempted ?? ex.successRate ?? 0).toFixed(1),
      (ex.avgScore ?? 0).toFixed(1),
      (ex.avgTimeSpentMinutes ?? 0).toFixed(1),
      ex.expectedTimeMinutes ?? 0,
      (ex.avgRuns ?? 0).toFixed(1),
      (ex.avgSubmits ?? 0).toFixed(1),
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `exercise_results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // สไตล์ Dropdown แบบ Clean Modern SaaS
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
    <MainLayout activeItem="ExerciseResults">
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
        {/* ส่วนที่ 1: ส่วนหัวของหน้า (Header) พร้อมปุ่มส่งออก CSV สีเขียวทางการสไตล์รูปที่ 3 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
              ผลการทำแบบฝึกหัด (Exercise Results)
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              สรุปภาพรวมและวิเคราะห์สถิติแบบฝึกหัดของนักเรียน (แสดงเฉพาะโจทย์ที่มีการเข้าทำจริง)
            </Typography>
          </Box>

          <Tooltip title="ดาวน์โหลดรายงานสรุปแบบฝึกหัดทั้งหมดเป็นไฟล์ CSV">
            <span>
              <Button
                variant="contained"
                startIcon={<Download size={16} />}
                onClick={handleExportCsv}
                disabled={attemptedExercises.length === 0}
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
              กำลังโหลดข้อมูลผลการทำแบบฝึกหัด...
            </Typography>
          </Card>
        ) : (
          <>
            {/* ส่วนที่ 2: การ์ดสรุปตัวชี้วัดภาพรวม (KPI Cards) ถอดแบบรูปที่ 1 */}
            <ExerciseResultsKpiCards
              activeExercises={attemptedExercises}
              totalExercises={rawData.length}
            />

            {/* ส่วนที่ 3 & 4: ตารางและแถบตัวกรอง สไตล์รูปที่ 1 & รูปที่ 3 */}
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
                  ตารางสรุปผลการทำแบบฝึกหัด ({filteredExercises.length}{isFiltered ? ` / ${attemptedExercises.length}` : ''} ข้อ)
                </Typography>
              </Box>

              {/* แถบตัวกรองแถวเดียวสมบูรณ์ (Single Unified Toolbar) สไตล์รูปที่ 1 & รูปที่ 3 */}
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
                  {/* ช่องค้นหาชื่อโจทย์ หรือ รหัสข้อ */}
                  <TextField
                    size="small"
                    placeholder="ค้นหาชื่อโจทย์ หรือ รหัสข้อ..."
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

                  {/* ตัวกรองระดับความยาก */}
                  <FormControl size="small" sx={{ width: 170 }}>
                    <InputLabel sx={labelSx}>ระดับความยาก</InputLabel>
                    <Select
                      value={difficultyFilter}
                      onChange={(e) => {
                        setDifficultyFilter(e.target.value);
                        setPage(0);
                      }}
                      label="ระดับความยาก"
                      sx={selectSx}
                    >
                      <MenuItem value="">ทั้งหมด</MenuItem>
                      <MenuItem value="1">Lv.1 - Remembering</MenuItem>
                      <MenuItem value="2">Lv.2 - Applying</MenuItem>
                      <MenuItem value="3">Lv.3 - Analyzing</MenuItem>
                      <MenuItem value="4">Lv.4 - Evaluating</MenuItem>
                      <MenuItem value="5">Lv.5 - Creating</MenuItem>
                    </Select>
                  </FormControl>

                  {/* ตัวกรองหัวข้อบทเรียน (Topic) */}
                  <FormControl size="small" sx={{ width: 180 }}>
                    <InputLabel sx={labelSx}>หัวข้อบทเรียน</InputLabel>
                    <Select
                      value={topicFilter}
                      onChange={(e) => {
                        setTopicFilter(e.target.value);
                        setPage(0);
                      }}
                      label="หัวข้อบทเรียน"
                      sx={selectSx}
                    >
                      <MenuItem value="">ทั้งหมด</MenuItem>
                      {availableTopics.map((topic) => (
                        <MenuItem key={topic} value={topic}>
                          {topic}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* ปุ่มล้างตัวกรอง - แสดงตลอดเวลา (Always Visible) ตามมาตรฐานของระบบ */}
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
                        color: isFiltered ? '#0f172a' : '#94a3b8',
                        bgcolor: isFiltered ? '#f1f5f9' : 'transparent',
                      },
                      '&.Mui-disabled': {
                        color: '#94a3b8',
                      },
                      transition: 'all 0.15s ease',
                    }}
                  >
                    ล้างตัวกรอง
                  </Button>
                </Box>
              </Box>

              {/* ตารางแสดงผล 8 คอลัมน์ */}
              <ExerciseResultsTable
                exercises={filteredExercises}
                page={page}
                rowsPerPage={rowsPerPage}
                searchQuery={searchQuery}
                onResetSearch={handleResetFilters}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </>
        )}
      </Box>
    </MainLayout>
  );
}
