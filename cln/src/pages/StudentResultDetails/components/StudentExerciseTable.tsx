import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  TablePagination,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Card,
} from '@mui/material';
import { Search, RotateCcw, Inbox } from 'lucide-react';
import type { StudentExerciseItem } from './StudentHeaderCard';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';
import { formatThaiDateTime } from '../../../utils/dateUtils';

interface StudentExerciseTableProps {
  exercises: StudentExerciseItem[];
  onInspectCode: (exercise: StudentExerciseItem) => void;
}

export const StudentExerciseTable: React.FC<StudentExerciseTableProps> = ({
  exercises,
  onInspectCode,
}) => {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'PASSED' | 'FAILED' | 'NOT_SUBMITTED'>('all');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // คำนวณจำนวนข้อที่ผ่าน, ไม่ผ่าน และยังไม่ส่งตรวจ สำหรับแท็บ Capsule Pills
  const passedCount = useMemo(
    () => exercises.filter((ex) => ex.status === 'PASSED').length,
    [exercises],
  );
  const failedCount = useMemo(
    () => exercises.filter((ex) => ex.status === 'FAILED').length,
    [exercises],
  );
  const notSubmittedCount = useMemo(
    () => exercises.filter((ex) => ex.status === 'NOT_SUBMITTED').length,
    [exercises],
  );

  // กรองรายการโจทย์ตามคำค้นหาและสถานะการผ่าน
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      if (statusFilter !== 'all' && ex.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchTitle = ex.title.toLowerCase().includes(q);
        const matchTopic = ex.topic.toLowerCase().includes(q);
        const matchSession = ex.sessionName.toLowerCase().includes(q);
        const matchId = String(ex.exerciseId).includes(q);
        return matchTitle || matchTopic || matchSession || matchId;
      }
      return true;
    });
  }, [exercises, search, statusFilter]);

  // Pagination ป้องกันหน้าค้างเมื่อตัวกรองเปลี่ยน
  const totalPages = Math.ceil(filteredExercises.length / rowsPerPage);
  const safePage = page >= totalPages && totalPages > 0 ? 0 : page;
  const paginatedExercises = filteredExercises.slice(
    safePage * rowsPerPage,
    safePage * rowsPerPage + rowsPerPage,
  );

  const handleReset = () => {
    setSearch('');
    setStatusFilter('all');
    setPage(0);
  };

  const isFiltered = search.trim() !== '' || statusFilter !== 'all';

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        boxShadow: 'none',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* ส่วนหัวของตาราง สไตล์รูปที่ 1 */}
        <Box sx={{ mb: 0.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
            รายชื่อแบบฝึกหัดที่เข้าทำ ({filteredExercises.length}
            {isFiltered ? ` / ${exercises.length}` : ''} ข้อ)
          </Typography>
        </Box>

        {/* แถบตัวกรองและค้นหา (Search & Filters Toolbar) สไตล์รูปที่ 1 & รูปที่ 2 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            {/* ช่องค้นหาชื่อโจทย์หรือรหัส สไตล์รูปที่ 1 */}
            <TextField
              size="small"
              placeholder="ค้นหาชื่อแบบฝึกหัด, รหัส หรือบทเรียน..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} color="#94a3b8" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                width: { xs: '100%', sm: 320 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: '#ffffff',
                  fontSize: '13px',
                  '& fieldset': { borderColor: '#e2e8f0' },
                  '&:hover fieldset': { borderColor: '#94a3b8' },
                  '&.Mui-focused fieldset': { borderColor: '#0f172a', borderWidth: '1.5px' },
                },
              }}
            />

            {/* แท็บ Capsule Pills กรองสถานะ สไตล์รูปที่ 2 */}
            <Box
              sx={{
                display: 'inline-flex',
                bgcolor: '#f1f5f9',
                p: '3px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                gap: 0.5,
              }}
            >
              <Button
                size="small"
                onClick={() => {
                  setStatusFilter('all');
                  setPage(0);
                }}
                sx={{
                  bgcolor: statusFilter === 'all' ? '#ffffff' : 'transparent',
                  color: statusFilter === 'all' ? '#0f172a' : '#64748b',
                  fontWeight: statusFilter === 'all' ? 700 : 500,
                  fontSize: '12.5px',
                  borderRadius: '8px',
                  px: 1.8,
                  py: 0.5,
                  textTransform: 'none',
                  boxShadow: statusFilter === 'all' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  '&:hover': {
                    bgcolor: statusFilter === 'all' ? '#ffffff' : '#e2e8f0',
                    color: statusFilter === 'all' ? '#0f172a' : '#334155',
                  },
                }}
              >
                ทั้งหมด ({exercises.length})
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setStatusFilter('PASSED');
                  setPage(0);
                }}
                sx={{
                  bgcolor: statusFilter === 'PASSED' ? '#ffffff' : 'transparent',
                  color: statusFilter === 'PASSED' ? '#0f172a' : '#64748b',
                  fontWeight: statusFilter === 'PASSED' ? 700 : 500,
                  fontSize: '12.5px',
                  borderRadius: '8px',
                  px: 1.8,
                  py: 0.5,
                  textTransform: 'none',
                  boxShadow: statusFilter === 'PASSED' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  '&:hover': {
                    bgcolor: statusFilter === 'PASSED' ? '#ffffff' : '#e2e8f0',
                    color: statusFilter === 'PASSED' ? '#0f172a' : '#334155',
                  },
                }}
              >
                เฉพาะที่ผ่าน ({passedCount})
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setStatusFilter('FAILED');
                  setPage(0);
                }}
                sx={{
                  bgcolor: statusFilter === 'FAILED' ? '#ffffff' : 'transparent',
                  color: statusFilter === 'FAILED' ? '#0f172a' : '#64748b',
                  fontWeight: statusFilter === 'FAILED' ? 700 : 500,
                  fontSize: '12.5px',
                  borderRadius: '8px',
                  px: 1.8,
                  py: 0.5,
                  textTransform: 'none',
                  boxShadow: statusFilter === 'FAILED' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  '&:hover': {
                    bgcolor: statusFilter === 'FAILED' ? '#ffffff' : '#e2e8f0',
                    color: statusFilter === 'FAILED' ? '#0f172a' : '#334155',
                  },
                }}
              >
                เฉพาะที่ไม่ผ่าน ({failedCount})
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setStatusFilter('NOT_SUBMITTED');
                  setPage(0);
                }}
                sx={{
                  bgcolor: statusFilter === 'NOT_SUBMITTED' ? '#ffffff' : 'transparent',
                  color: statusFilter === 'NOT_SUBMITTED' ? '#0f172a' : '#64748b',
                  fontWeight: statusFilter === 'NOT_SUBMITTED' ? 700 : 500,
                  fontSize: '12.5px',
                  borderRadius: '8px',
                  px: 1.8,
                  py: 0.5,
                  textTransform: 'none',
                  boxShadow: statusFilter === 'NOT_SUBMITTED' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  '&:hover': {
                    bgcolor: statusFilter === 'NOT_SUBMITTED' ? '#ffffff' : '#e2e8f0',
                    color: statusFilter === 'NOT_SUBMITTED' ? '#0f172a' : '#334155',
                  },
                }}
              >
                ยังไม่ส่งตรวจ ({notSubmittedCount})
              </Button>
            </Box>

            {/* ปุ่มล้างตัวกรอง สไตล์รูปที่ 1 */}
            {isFiltered && (
              <Button
                size="small"
                startIcon={<RotateCcw size={14} />}
                onClick={handleReset}
                sx={{
                  color: '#64748b',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 1.2,
                  py: 0.5,
                  '&:hover': { color: '#0f172a', bgcolor: '#f1f5f9' },
                }}
              >
                ล้างตัวกรอง
              </Button>
            )}
          </Box>
        </Box>

        {/* ตารางแสดงผลแบบฝึกหัด ถอดแบบรูปที่ 2 */}
        {filteredExercises.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              borderRadius: '12px',
              border: '1px dashed #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Inbox size={44} color="#94a3b8" />
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>
              {isFiltered ? 'ไม่พบแบบฝึกหัดที่ตรงกับเงื่อนไขการค้นหา' : 'ยังไม่มีประวัติการทำแบบฝึกหัด'}
            </Typography>
            {isFiltered && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleReset}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  color: '#0f172a',
                  borderColor: '#cbd5e1',
                }}
              >
                ล้างตัวกรอง
              </Button>
            )}
          </Box>
        ) : (
          <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 950 }}>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow
                    sx={{
                      '& th': {
                        py: 1.8,
                        fontWeight: 700,
                        color: '#475569',
                        fontSize: '13px',
                        borderBottom: '1px solid #e2e8f0',
                        whiteSpace: 'nowrap',
                      },
                    }}
                  >
                    <TableCell sx={{ minWidth: 240 }}>แบบฝึกหัด</TableCell>
                    <TableCell sx={{ minWidth: 160 }}>บทเรียน (Session)</TableCell>
                    <TableCell align="center" sx={{ minWidth: 120 }}>คะแนนสูงสุดที่ส่ง</TableCell>
                    <TableCell align="center" sx={{ minWidth: 110 }}>สถานะ</TableCell>
                    <TableCell align="center" sx={{ minWidth: 90 }}>Run (ครั้ง)</TableCell>
                    <TableCell align="center" sx={{ minWidth: 100 }}>Submit (ครั้ง)</TableCell>
                    <TableCell align="center" sx={{ minWidth: 150 }}>ส่งตรวจล่าสุด</TableCell>
                    <TableCell align="center" sx={{ minWidth: 100 }}>ตรวจโค้ด</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedExercises.map((ex) => {
                    const diffMeta = DIFFICULTY_LEVELS[ex.difficultyLevel] || DIFFICULTY_LEVELS[1];

                    return (
                      <TableRow
                        key={`${ex.sessionId}_${ex.exerciseId}`}
                        hover
                        sx={{
                          '& td': { borderBottom: '1px solid #f1f5f9', py: 1.6 },
                          transition: 'background-color 0.15s ease',
                          '&:hover': { bgcolor: '#f8fafc' },
                        }}
                      >
                        {/* 1. แบบฝึกหัด (Title + Topic/ID) */}
                        <TableCell>
                          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14px', lineHeight: 1.3 }}>
                            {ex.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.4 }}>
                            <Chip
                              label={diffMeta.label}
                              size="small"
                              sx={{
                                fontSize: '10.5px',
                                fontWeight: 700,
                                color: diffMeta.color,
                                bgcolor: diffMeta.bg,
                                border: `1px solid ${diffMeta.border}`,
                                height: '20px',
                                borderRadius: '4px',
                              }}
                            />
                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '11.5px' }}>
                              #{ex.exerciseId} • {ex.topic}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* 2. บทเรียน (Session Name) */}
                        <TableCell>
                          <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '13.5px' }}>
                            {ex.sessionName}
                          </Typography>
                        </TableCell>

                        {/* 3. คะแนนสูงสุดที่ส่ง */}
                        <TableCell align="center">
                          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                            {ex.bestScore !== null ? `${ex.bestScore} / 100` : '-'}
                          </Typography>
                        </TableCell>

                        {/* 4. สถานะ (ชิปมน Passed / Failed / ยังไม่ส่งตรวจ) */}
                        <TableCell align="center">
                          {ex.status === 'PASSED' && (
                            <Chip
                              label="Passed"
                              size="small"
                              sx={{
                                bgcolor: '#ecfdf5',
                                color: '#059669',
                                border: '1px solid #a7f3d0',
                                fontWeight: 700,
                                fontSize: '12px',
                                borderRadius: '8px',
                                px: 0.8,
                                height: '24px',
                              }}
                            />
                          )}
                          {ex.status === 'FAILED' && (
                            <Chip
                              label="Failed"
                              size="small"
                              sx={{
                                bgcolor: '#fef2f2',
                                color: '#dc2626',
                                border: '1px solid #fecaca',
                                fontWeight: 700,
                                fontSize: '12px',
                                borderRadius: '8px',
                                px: 0.8,
                                height: '24px',
                              }}
                            />
                          )}
                          {ex.status === 'NOT_SUBMITTED' && (
                            <Chip
                              label="Not Submitted"
                              size="small"
                              sx={{
                                bgcolor: '#f1f5f9',
                                color: '#475569',
                                border: '1px solid #cbd5e1',
                                fontWeight: 700,
                                fontSize: '11.5px',
                                borderRadius: '8px',
                                px: 0.8,
                                height: '24px',
                              }}
                            />
                          )}
                        </TableCell>

                        {/* 5. Run (ครั้ง) */}
                        <TableCell align="center">
                          <Typography sx={{ fontWeight: 600, color: '#334155', fontSize: '13.5px' }}>
                            {ex.runCount}
                          </Typography>
                        </TableCell>

                        {/* 6. Submit (ครั้ง) */}
                        <TableCell align="center">
                          <Typography sx={{ fontWeight: 600, color: '#334155', fontSize: '13.5px' }}>
                            {ex.submitCount}
                          </Typography>
                        </TableCell>

                        {/* 7. ส่งตรวจล่าสุด */}
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ color: '#475569', fontSize: '12.5px', whiteSpace: 'nowrap' }}>
                            {ex.lastSubmittedAt ? formatThaiDateTime(ex.lastSubmittedAt) : '-'}
                          </Typography>
                        </TableCell>

                        {/* 8. ตรวจโค้ด (ปุ่ม Solid Royal Blue มน 8px) */}
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => onInspectCode(ex)}
                            sx={{
                              bgcolor: '#2563eb',
                              color: '#ffffff',
                              borderRadius: '8px',
                              textTransform: 'none',
                              fontWeight: 700,
                              fontSize: '12px',
                              px: 1.8,
                              py: 0.6,
                              boxShadow: 'none',
                              '&:hover': {
                                bgcolor: '#1d4ed8',
                                boxShadow: 'none',
                              },
                            }}
                          >
                            ตรวจโค้ด
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination มาตรฐาน */}
            <TablePagination
              component="div"
              count={filteredExercises.length}
              page={safePage}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="แถวต่อหน้า:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count !== -1 ? count : `มากกว่า ${to}`} ข้อ`}
              sx={{
                borderTop: '1px solid #e2e8f0',
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  fontSize: '13px',
                  color: '#64748b',
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Card>
  );
};
