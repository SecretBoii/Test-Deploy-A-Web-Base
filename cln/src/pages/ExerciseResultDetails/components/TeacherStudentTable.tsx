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
} from '@mui/material';
import { Search, RotateCcw, Inbox } from 'lucide-react';
import type { ExerciseStudentItem } from '../../../api/reports';
import { formatThaiDateTime } from '../../../utils/dateUtils';

interface TeacherStudentTableProps {
  students: ExerciseStudentItem[];
  onInspectCode: (student: ExerciseStudentItem) => void;
}

export const TeacherStudentTable: React.FC<TeacherStudentTableProps> = ({ students, onInspectCode }) => {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // รายชื่อนักศึกษาที่เข้าทำจริงส่งตรงมาจาก Backend เรียบร้อยแล้ว
  const activeStudents = students;

  // จำนวนนักศึกษาแยกตามสถานะสำหรับแสดงตัวเลขในแท็บ
  const passedCount = useMemo(
    () => activeStudents.filter((s) => s.status === 'PASSED').length,
    [activeStudents],
  );
  const failedCount = useMemo(
    () => activeStudents.filter((s) => s.status === 'FAILED').length,
    [activeStudents],
  );
  const notSubmittedCount = useMemo(
    () => activeStudents.filter((s) => s.status === 'NOT_SUBMITTED').length,
    [activeStudents],
  );

  // กรองรายชื่อนักศึกษาตามคำค้นหาและสถานะ
  const filteredStudents = useMemo(() => {
    return activeStudents.filter((st) => {
      if (statusFilter !== 'all' && st.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchName = st.fullName.toLowerCase().includes(q);
        const matchUser = st.username.toLowerCase().includes(q);
        const matchUni = (st.university || '').toLowerCase().includes(q);
        return matchName || matchUser || matchUni;
      }
      return true;
    });
  }, [activeStudents, search, statusFilter]);

  // ป้องกัน Pagination ค้างหน้าว่างเมื่อผลการกรองลดลง
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const safePage = page >= totalPages && totalPages > 0 ? 0 : page;
  const paginatedStudents = filteredStudents.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);

  const handleReset = () => {
    setSearch('');
    setStatusFilter('all');
    setPage(0);
  };

  const isFiltered = search.trim() !== '' || statusFilter !== 'all';


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* ส่วนหัวของตาราง สไตล์รูปที่ 1 */}
      <Box sx={{ mb: 0.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
          รายชื่อนักศึกษาที่เข้าทำโจทย์ ({filteredStudents.length}{isFiltered ? ` / ${activeStudents.length}` : ''} คน)
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
          {/* ช่องค้นหาชื่อหรือรหัส สไตล์รูปที่ 1 */}
          <TextField
            size="small"
            placeholder="ค้นหาชื่อ, รหัสนักศึกษา หรือมหาวิทยาลัย..."
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
              width: { xs: '100%', sm: 300 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                bgcolor: '#ffffff',
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
              ทั้งหมด ({activeStudents.length})
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

          {/* ปุ่มล้างตัวกรอง - แสดงตลอดเวลา สไตล์รูปที่ 1 */}
          <Button
            size="small"
            startIcon={<RotateCcw size={14} />}
            onClick={handleReset}
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

      {/* ตารางแสดงผลรายชื่อนักศึกษา */}
      {filteredStudents.length === 0 ? (
        <Box
          sx={{
            py: 8,
            px: 3,
            textAlign: 'center',
            bgcolor: '#ffffff',
            borderRadius: '16px',
            border: '1px dashed #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
          }}
        >
          <Inbox size={44} color="#94a3b8" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#475569' }}>
            ไม่พบข้อมูลนักศึกษาตามเงื่อนไขที่เลือก
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองสถานะ
          </Typography>
        </Box>
      ) : (
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 1050 }}>
            <TableHead sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <TableRow
                sx={{
                  '& th': {
                    bgcolor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    py: 1.8,
                    fontWeight: 700,
                    color: '#475569',
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                  },
                }}
              >
                <TableCell>นักศึกษา</TableCell>
                <TableCell>มหาวิทยาลัย / คณะ</TableCell>
                <TableCell align="center">คะแนนสูงสุดที่ส่ง</TableCell>
                <TableCell align="center">สถานะ</TableCell>
                <TableCell align="center">คำใบ้ (Hint)</TableCell>
                <TableCell align="center">Run (ครั้ง)</TableCell>
                <TableCell align="center">Submit (ครั้ง)</TableCell>
                <TableCell align="center">ส่งตรวจล่าสุด</TableCell>
                <TableCell align="center">ตรวจโค้ด</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedStudents.map((st) => (
                <TableRow
                  key={st.userId}
                  hover
                  sx={{
                    '& td': { borderBottom: '1px solid #f1f5f9', py: 1.6 },
                    transition: 'background-color 0.15s ease',
                    '&:hover': { bgcolor: '#f8fafc' },
                  }}
                >
                  {/* 1. นักศึกษา */}
                  <TableCell>
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                      {st.fullName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      @{st.username}
                    </Typography>
                  </TableCell>

                  {/* 2. มหาวิทยาลัย / คณะ */}
                  <TableCell>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                      {st.university || '-'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      {st.faculty || '-'}
                    </Typography>
                  </TableCell>

                  {/* 3. คะแนนสูงสุด */}
                  <TableCell align="center">
                    {st.bestScore !== null ? (
                      <Typography sx={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a' }}>
                        {st.bestScore} / 100
                      </Typography>
                    ) : (
                      <Typography sx={{ color: '#94a3b8', fontSize: '13px' }}>-</Typography>
                    )}
                  </TableCell>

                  {/* 4. สถานะ */}
                  <TableCell align="center">
                    {st.status === 'PASSED' && (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '58px',
                          px: 1.4,
                          py: 0.35,
                          borderRadius: '6px',
                          bgcolor: '#f0fdf4',
                          color: '#15803d',
                          fontSize: '12px',
                          fontWeight: 700,
                          border: '1px solid #bbf7d0',
                        }}
                      >
                        Passed
                      </Box>
                    )}
                    {st.status === 'FAILED' && (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '58px',
                          px: 1.4,
                          py: 0.35,
                          borderRadius: '6px',
                          bgcolor: '#fff5f5',
                          color: '#b91c1c',
                          fontSize: '12px',
                          fontWeight: 700,
                          border: '1px solid #fecaca',
                        }}
                      >
                        Failed
                      </Box>
                    )}

                    {st.status === 'NOT_SUBMITTED' && (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '58px',
                          px: 1.4,
                          py: 0.35,
                          borderRadius: '6px',
                          bgcolor: '#f1f5f9',
                          color: '#475569',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          border: '1px solid #cbd5e1',
                        }}
                      >
                        Not Submitted
                      </Box>
                    )}
                  </TableCell>

                  {/* 5. คำใบ้ (Hint) - รูปแบบข้อความธรรมดา ไม่ใช้กรอบหรือไอคอนตามคำขอ */}
                  <TableCell align="center">
                    <Typography
                      sx={{
                        fontSize: '13px',
                        fontWeight: st.hasUsedHint ? 600 : 500,
                        color: st.hasUsedHint ? '#0f172a' : '#94a3b8',
                      }}
                    >
                      {st.hasUsedHint ? 'ใช้ (1 ครั้ง)' : 'ไม่ใช้'}
                    </Typography>
                  </TableCell>

                  {/* 6. Run */}
                  <TableCell align="center">
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                      {st.runCount}
                    </Typography>
                  </TableCell>

                  {/* 6. Submit */}
                  <TableCell align="center">
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                      {st.submitCount}
                    </Typography>
                  </TableCell>

                  {/* 7. ส่งตรวจล่าสุด */}
                  <TableCell align="center">
                    <Typography sx={{ fontSize: '12.5px', color: '#64748b' }}>
                      {formatThaiDateTime(st.lastSubmittedAt ?? undefined)}
                    </Typography>
                  </TableCell>

                  {/* 8. ปุ่ม ตรวจโค้ด */}
                  <TableCell align="center">
                    {st.latestActivity ? (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => onInspectCode(st)}
                        sx={{
                          bgcolor: '#2563eb',
                          color: '#ffffff',
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '12.5px',
                          px: 2,
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
                    ) : (
                      <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                        ไม่มีประวัติ
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* แถบ Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredStudents.length}
        rowsPerPage={rowsPerPage}
        page={safePage}
        onPageChange={(_e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="แถวต่อหน้า:"
        labelDisplayedRows={({ from, to, count }) => `${from} - ${to} จาก ${count} คน`}
        sx={{
          borderTop: '1px solid #e2e8f0',
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontSize: '13px',
            color: '#64748b',
            fontWeight: 600,
          },
        }}
      />
    </Box>
  );
};
