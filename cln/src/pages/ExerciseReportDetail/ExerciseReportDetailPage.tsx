import { 
  Box, Typography, Button, Card, CircularProgress, Chip, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  TextField, InputAdornment, MenuItem, TablePagination,
  FormControl, InputLabel, Select
} from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Code, RotateCcw } from 'lucide-react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { 
  getExerciseStudentBreakdown, 
  type ExerciseStudentBreakdownResponse, 
  type StudentActivityItem 
} from '../../api/reports';
import { DIFFICULTY_LEVELS } from '../../constants/difficulty';
import { CodeInspectionDialog } from '../StudentReportDetail/components/CodeInspectionDialog';

export default function ExerciseReportDetailPage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<ExerciseStudentBreakdownResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<StudentActivityItem | null>(null);

  // ระบบ Pagination สำหรับรายชื่อนักศึกษา
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ดึงข้อมูลสถิติของโจทย์และผลงานรายคนจาก Backend
  useEffect(() => {
    if (!exerciseId) return;
    const fetchBreakdown = async () => {
      setLoading(true);
      try {
        const res = await getExerciseStudentBreakdown(Number(exerciseId));
        setData(res);
      } catch (err) {
        console.error('ไม่สามารถดึงข้อมูลนักศึกษารายข้อได้:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBreakdown();
  }, [exerciseId]);

  const exercise = data?.exercise;
  const stats = data?.stats;

  // กรองรายชื่อนักศึกษาตามช่องค้นหาและสถานะการผ่าน
  const filteredStudents = useMemo(() => {
    if (!data?.students) return [];
    return data.students.filter((st) => {
      if (statusFilter && st.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return st.fullName.toLowerCase().includes(q) || st.username.toLowerCase().includes(q);
      }
      return true;
    });
  }, [data?.students, search, statusFilter]);

  const isFiltered = Boolean(search.trim() || statusFilter);

  // ตัดข้อมูลแสดงผลเฉพาะหน้าที่เลือก
  const paginatedStudents = useMemo(() => {
    return filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredStudents, page, rowsPerPage]);

  const diffMeta = exercise ? DIFFICULTY_LEVELS[exercise.difficultyLevel] || {
    label: `Lv.${exercise.difficultyLevel}`,
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd'
  } : null;

  return (
    <MainLayout activeItem="Reports">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: '1440px', margin: '0 auto', pb: 6 }}>
        
        {/* ปุ่มย้อนกลับด้านบน */}
        <Box>
          <Button
            variant="text"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate('/reports')}
            sx={{
              color: '#475569',
              fontWeight: 700,
              fontSize: '14px',
              textTransform: 'none',
              px: 1.5,
              py: 0.8,
              borderRadius: '10px',
              bgcolor: '#ffffff',
              border: '1px solid #e2e8f0',
              '&:hover': { bgcolor: '#f8fafc', color: '#0f172a' },
            }}
          >
            ย้อนกลับไปหน้ารายงาน
          </Button>
        </Box>

        {loading ? (
          <Card sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <CircularProgress size={36} />
            <Typography variant="body2" sx={{ mt: 2, color: '#64748b', fontWeight: 600 }}>
              กำลังโหลดข้อมูลสถิติของโจทย์ข้อนี้...
            </Typography>
          </Card>
        ) : exercise && stats ? (
          <>
            {/* ส่วนที่ 1: การ์ดรายละเอียดโจทย์ */}
            <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: '#ffffff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                    {exercise.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    หัวข้อบทเรียน: <strong>{exercise.topic}</strong> • เวลาที่กำหนด: <strong>{exercise.expectedTime} นาที</strong>
                  </Typography>
                  {exercise.objective && (
                    <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 1 }}>
                      วัตถุประสงค์: {exercise.objective}
                    </Typography>
                  )}
                </Box>
                {diffMeta && (
                  <Chip
                    label={`Lv.${exercise.difficultyLevel} - ${diffMeta.label}`}
                    sx={{
                      bgcolor: diffMeta.bg,
                      color: diffMeta.color,
                      border: `1px solid ${diffMeta.border}`,
                      fontWeight: 700,
                      fontSize: '13px',
                      borderRadius: '8px',
                      py: 2,
                      px: 1,
                    }}
                  />
                )}
              </Box>
            </Card>

            {/* ส่วนที่ 2: การ์ด KPI ตัวชี้วัด 5 กล่อง (แยก Run และ Submit อิสระ) */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2 }}>
              <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>ผู้เข้าทำ</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: stats.attemptedCount === 0 ? '#94a3b8' : '#0f172a', mt: 0.5 }}>
                  {stats.attemptedCount} / {stats.totalStudents} คน
                </Typography>
              </Card>

              <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>อัตราการผ่าน</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: stats.attemptedCount === 0 ? '#94a3b8' : stats.passRateAttempted > 70 ? '#10b981' : stats.passRateAttempted > 40 ? '#d97706' : '#ef4444', mt: 0.5 }}>
                  {stats.attemptedCount === 0 ? '-' : `${stats.passRateAttempted.toFixed(0)}% ผ่าน`}
                </Typography>
              </Card>

              <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>รันโค้ดเฉลี่ย (Run)</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: stats.attemptedCount === 0 ? '#94a3b8' : '#f59e0b', mt: 0.5 }}>
                  {stats.attemptedCount === 0 ? '-' : `${stats.avgRuns.toFixed(1)} ครั้ง`}
                </Typography>
              </Card>

              <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>ส่งตรวจเฉลี่ย (Submit)</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: stats.attemptedCount === 0 ? '#94a3b8' : '#6366f1', mt: 0.5 }}>
                  {stats.attemptedCount === 0 ? '-' : `${stats.avgSubmits.toFixed(1)} ครั้ง`}
                </Typography>
              </Card>

              <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>คะแนนเฉลี่ย</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: stats.attemptedCount === 0 ? '#94a3b8' : '#2563eb', mt: 0.5 }}>
                  {stats.attemptedCount === 0 ? '-' : `${stats.avgScore.toFixed(1)} / 100`}
                </Typography>
              </Card>
            </Box>

            {/* ส่วนที่ 3: ตารางรายชื่อนักศึกษา */}
            <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  รายชื่อนักศึกษาและประวัติการทำ ({filteredStudents.length} คน)
                </Typography>

                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                  <TextField
                    size="small"
                    placeholder="ค้นหาชื่อ หรือ Username..."
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
                          borderRadius: '12px',
                          bgcolor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          height: '46px',
                          fontSize: '13px',
                          '& fieldset': { border: 'none' },
                        },
                      },
                    }}
                    sx={{ width: { xs: '100%', sm: 260 } }}
                  />

                  <FormControl size="small" sx={{ width: { xs: '100%', sm: 180 }, flexShrink: 0 }}>
                    <InputLabel sx={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>สถานะการทำ</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(0);
                      }}
                      label="สถานะการทำ"
                      sx={{
                        borderRadius: '12px',
                        bgcolor: '#f8fafc',
                        height: '46px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#334155',
                        '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #e2e8f0' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb', borderWidth: '1.5px' },
                      }}
                    >
                      <MenuItem value="">ทั้งหมด</MenuItem>
                      <MenuItem value="PASSED">ผ่าน (≥ 80)</MenuItem>
                      <MenuItem value="FAILED">ยังไม่ผ่าน (&lt; 80)</MenuItem>
                      <MenuItem value="NOT_STARTED">ยังไม่เริ่มทำ</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSearch('');
                      setStatusFilter('');
                      setPage(0);
                    }}
                    disabled={!isFiltered}
                    startIcon={<RotateCcw size={15} />}
                    sx={{
                      height: '46px',
                      borderRadius: '12px',
                      px: 2,
                      borderColor: isFiltered ? '#cbd5e1' : '#e2e8f0',
                      color: isFiltered ? '#475569' : '#94a3b8',
                      bgcolor: isFiltered ? '#f8fafc' : 'transparent',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      '&:hover': {
                        bgcolor: '#f1f5f9',
                        borderColor: '#94a3b8',
                        color: '#0f172a',
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'transparent',
                        borderColor: '#e2e8f0',
                        color: '#cbd5e1',
                      },
                      transition: 'all 0.15s ease',
                    }}
                  >
                    ล้างตัวกรอง
                  </Button>
                </Box>
              </Box>

              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow sx={{ '& th': { py: 1.5, fontWeight: 700, color: '#475569', fontSize: '13px' } }}>
                      <TableCell>นักศึกษา</TableCell>
                      <TableCell>มหาวิทยาลัย / คณะ</TableCell>
                      <TableCell align="center">คะแนนสูงสุด</TableCell>
                      <TableCell align="center">สถานะ</TableCell>
                      <TableCell align="center">Run (ครั้ง)</TableCell>
                      <TableCell align="center">Submit (ครั้ง)</TableCell>
                      <TableCell align="center">ส่งตรวจล่าสุด</TableCell>
                      <TableCell align="center">ตรวจโค้ด</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 5, color: '#94a3b8' }}>
                          ไม่พบข้อมูลนักศึกษาตามเงื่อนไขที่เลือก
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedStudents.map((st) => (
                        <TableRow key={st.userId} hover>
                          <TableCell>
                            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px' }}>{st.fullName}</Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>@{st.username}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: '13px', color: '#334155' }}>{st.university}</Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>{st.faculty}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            {st.bestScore !== null ? (
                              <Typography sx={{ fontWeight: 800, color: st.bestScore >= 80 ? '#10b981' : '#d97706', fontSize: '14px' }}>
                                {st.bestScore} / 100
                              </Typography>
                            ) : (
                              <Typography sx={{ color: '#94a3b8', fontSize: '13px' }}>-</Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {st.status === 'PASSED' && (
                              <Typography sx={{ color: '#059669', fontWeight: 700, fontSize: '13px' }}>
                                ผ่าน
                              </Typography>
                            )}
                            {st.status === 'FAILED' && (
                              <Typography sx={{ color: '#e11d48', fontWeight: 700, fontSize: '13px' }}>
                                ไม่ผ่าน
                              </Typography>
                            )}
                            {st.status === 'NOT_STARTED' && (
                              <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '13px' }}>
                                ยังไม่ทำ
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Typography sx={{ fontWeight: 600, fontSize: '13px' }}>{st.runCount} ครั้ง</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography sx={{ fontWeight: 600, fontSize: '13px' }}>{st.submitCount} ครั้ง</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {st.lastSubmittedAt ? new Date(st.lastSubmittedAt).toLocaleDateString('th-TH') : '-'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="outlined"
                              size="small"
                              disabled={!st.latestActivity}
                              startIcon={<Code size={14} />}
                              onClick={() => {
                                if (st.latestActivity && exercise) {
                                  setSelectedActivity({
                                    ...st.latestActivity,
                                    exercise: {
                                      exerciseId: exercise.exerciseId,
                                      title: exercise.title,
                                      topic: exercise.topic,
                                      difficultyLevel: exercise.difficultyLevel,
                                      expectedTime: exercise.expectedTime,
                                    }
                                  });
                                }
                              }}
                              sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontSize: '12px',
                                fontWeight: 700,
                              }}
                            >
                              ตรวจโค้ด
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* ระบบ Pagination สลับหน้าของรายชื่อนักศึกษา */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredStudents.length}
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
            </Card>
          </>
        ) : null}

        {/* ส่วนที่ 4: หน้าต่าง Dialog ตรวจโค้ดภาษา Python (ใช้คอมโพเนนต์เดียวกับ StudentReportDetail) */}
        <CodeInspectionDialog
          open={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
          activity={selectedActivity}
        />
      </Box>
    </MainLayout>
  );
}
