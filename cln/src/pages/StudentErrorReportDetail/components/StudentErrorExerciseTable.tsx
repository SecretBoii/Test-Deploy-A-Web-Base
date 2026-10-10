import { useState, useMemo, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Box, Typography, Chip, Button, TablePagination
} from '@mui/material';
import { getErrorBadgeStyle, formatThaiTime, type GroupedExerciseItem } from '../StudentErrorReportDetailPage';

interface StudentErrorExerciseTableProps {
  exercises: GroupedExerciseItem[];
  onInspectExercise: (exercise: GroupedExerciseItem) => void;
}

// ตารางแสดงแบบฝึกหัดที่เกิดข้อผิดพลาดของผู้เรียน สไตล์ Modern Dark-Navy SaaS พร้อมระบบ Pagination
export function StudentErrorExerciseTable({
  exercises,
  onInspectExercise,
}: StudentErrorExerciseTableProps) {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // เมื่อผลการค้นหาหรือรายการเปลี่ยน ให้รีเซ็ตกลับไปหน้า 1 เสมอ
  useEffect(() => {
    setPage(0);
  }, [exercises]);

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ป้องกัน Pagination ค้างหน้าที่เกินจากจำนวนข้อมูลจริงเมื่อผลการกรองลดลง
  const totalPages = Math.ceil(exercises.length / rowsPerPage);
  const safePage = (page >= totalPages && totalPages > 0) ? 0 : page;

  // แบ่งหน้าข้อมูลแบบฝึกหัด
  const paginatedExercises = useMemo(() => {
    return exercises.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);
  }, [exercises, safePage, rowsPerPage]);

  if (exercises.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px dashed #cbd5e1', bgcolor: '#ffffff', boxShadow: 'none' }}>
        <Typography sx={{ color: '#64748b', fontWeight: 700, fontSize: '14px' }}>
          ไม่พบข้อผิดพลาดที่ตรงกับเงื่อนไขการค้นหา
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        boxShadow: 'none',
        overflowX: 'auto',
      }}
    >
      <Table sx={{ minWidth: 800 }}>
        <TableHead sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <TableRow sx={{ '& th': { bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', py: 1.8, fontSize: '13px', fontWeight: 700, color: '#475569' } }}>
            <TableCell sx={{ minWidth: 220 }}>แบบฝึกหัด (Exercise)</TableCell>
            <TableCell sx={{ minWidth: 150 }}>หัวข้อบทเรียน</TableCell>
            <TableCell sx={{ minWidth: 260 }}>ประเภท Error ที่พบ</TableCell>
            <TableCell align="center" sx={{ minWidth: 140 }}>จำนวน Error รวม</TableCell>
            <TableCell sx={{ minWidth: 160 }}>ครั้งล่าสุดที่พบ</TableCell>
            <TableCell align="center" sx={{ minWidth: 150 }}>การจัดการ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedExercises.map((ex) => {
            const latestActivity = ex.activities[0];
            return (
              <TableRow
                key={ex.exerciseId}
                hover
                sx={{
                  '& td': { borderBottom: '1px solid #f1f5f9', py: 1.6 },
                  transition: 'background-color 0.15s ease',
                  '&:hover': { bgcolor: '#f8fafc' },
                }}
              >
                {/* 1. ชื่อโจทย์ */}
                <TableCell>
                  <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                    {ex.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    รหัสโจทย์ #{ex.exerciseId}
                  </Typography>
                </TableCell>

                {/* 2. หัวข้อบทเรียน */}
                <TableCell>
                  <Chip
                    label={ex.topic || 'ทั่วไป'}
                    size="small"
                    sx={{
                      bgcolor: '#f1f5f9',
                      color: '#475569',
                      fontWeight: 600,
                      fontSize: '12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                    }}
                  />
                </TableCell>

                {/* 3. รายการประเภท Error ที่พบ */}
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                    {Object.entries(ex.errorTypeCounts).map(([type, count]) => {
                      const style = getErrorBadgeStyle(type);
                      return (
                        <Chip
                          key={type}
                          label={`${type} (${count})`}
                          size="small"
                          sx={{
                            bgcolor: style.bg,
                            color: style.color,
                            border: `1px solid ${style.border}`,
                            fontWeight: 700,
                            fontSize: '11px',
                            height: '24px',
                            borderRadius: '6px',
                          }}
                        />
                      );
                    })}
                  </Box>
                </TableCell>

                {/* 4. จำนวน Error รวม (แสดงตัวเลขคมชัดตามระบบ ไม่ใช้สีแดงจัด) */}
                <TableCell align="center">
                  <Typography sx={{ fontWeight: 500, fontSize: '13px', color: '#0f172a' }}>
                    {ex.activities.length} ครั้ง
                  </Typography>
                </TableCell>

                {/* 5. เวลาที่พบล่าสุด */}
                <TableCell>
                  <Typography
                    variant="caption"
                    sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.6, fontSize: '12.5px', fontWeight: 500 }}
                  >
                    {latestActivity ? formatThaiTime(latestActivity.submittedAt) : '-'}
                  </Typography>
                </TableCell>

                {/* 6. ปุ่มตรวจประวัติโค้ด (Solid Royal Blue) */}
                <TableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onInspectExercise(ex)}
                    sx={{
                      borderRadius: '8px',
                      bgcolor: '#2563eb',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '12px',
                      textTransform: 'none',
                      boxShadow: 'none',
                      py: 0.6,
                      px: 1.6,
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        bgcolor: '#1d4ed8',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    ตรวจประวัติโค้ด
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* ส่วนเปลี่ยนหน้า (Pagination) ใต้ตารางตามมาตรฐาน SaaS */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={exercises.length}
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
  );
}
