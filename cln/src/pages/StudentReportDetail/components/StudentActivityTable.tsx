import {
  Box, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip,
  TablePagination
} from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import type { StudentActivityItem } from '../../../api/reports';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';

interface StudentActivityTableProps {
  activities: StudentActivityItem[];
  onSelectActivity: (activity: StudentActivityItem) => void;
}

export function StudentActivityTable({ activities, onSelectActivity }: StudentActivityTableProps) {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // เมื่อรายการกิจกรรมเปลี่ยน (เช่น เปลี่ยนแท็บ หรือค้นหา) ให้รีเซ็ตกลับหน้าแรกเสมอ ป้องกันกรณีหน้าค้าง
  useEffect(() => {
    setPage(0);
  }, [activities]);

  // ฟังก์ชันจัดรูปแบบวันเวลาไทย
  const formatThaiDateTime = (dateStr?: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return `${d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' })} ${d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`;
  };

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ป้องกัน Pagination ค้างหน้าที่เกินจากจำนวนข้อมูลจริงเมื่อผลการกรองลดลง
  const totalPages = Math.ceil(activities.length / rowsPerPage);
  const safePage = (page >= totalPages && totalPages > 0) ? 0 : page;

  // แบ่งหน้าข้อมูลกิจกรรมตาม safePage และ rowsPerPage
  const paginatedActivities = useMemo(() => {
    return activities.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);
  }, [activities, safePage, rowsPerPage]);

  return (
    <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflowX: 'auto' }}>
      <Table sx={{ minWidth: 1100 }}>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow sx={{ '& th': { bgcolor: '#f8fafc', fontWeight: 700, color: '#475569', fontSize: '13px', py: 1.8, whiteSpace: 'nowrap' } }}>
            <TableCell sx={{ whiteSpace: 'nowrap', minWidth: '200px' }}>ชื่อโจทย์ / แบบฝึกหัด</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', minWidth: '180px' }}>บทเรียน (Session)</TableCell>
            <TableCell align="center" sx={{ whiteSpace: 'nowrap', minWidth: '140px' }}>ระดับความยาก</TableCell>
            <TableCell align="center" sx={{ whiteSpace: 'nowrap', minWidth: '100px' }}>ประเภท</TableCell>
            <TableCell align="center" sx={{ whiteSpace: 'nowrap', minWidth: '110px' }}>ผลการประเมิน</TableCell>
            <TableCell align="center" sx={{ whiteSpace: 'nowrap', minWidth: '70px' }}>คะแนน</TableCell>
            <TableCell align="center" sx={{ whiteSpace: 'nowrap', minWidth: '120px' }}>จำนวนครั้งที่รัน</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', minWidth: '140px' }}>วันและเวลาที่ทำ</TableCell>
            <TableCell align="center" sx={{ whiteSpace: 'nowrap', minWidth: '110px' }}>รายละเอียด</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center" sx={{ py: 8, color: '#94a3b8' }}>
                <BookOpen size={36} color="#cbd5e1" style={{ marginBottom: 8 }} />
                <Typography sx={{ fontWeight: 600, fontSize: '15px' }}>
                  ไม่พบประวัติกิจกรรมที่ตรงกับเงื่อนไขการค้นหา
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            paginatedActivities.map((act) => {
              const isPassed = act.score >= 80;
              const diffLevel = act.exercise?.difficultyLevel || 1;
              const diffMeta = DIFFICULTY_LEVELS[diffLevel] || DIFFICULTY_LEVELS[1];

              return (
                <TableRow
                  key={act.activityId}
                  hover
                  onClick={() => onSelectActivity(act)}
                  sx={{
                    cursor: 'pointer',
                    '& td': { borderBottom: '1px solid #f1f5f9', py: 1.6 },
                    transition: 'background-color 0.15s ease',
                    '&:hover': { bgcolor: '#f8fafc' }
                  }}
                >
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14px', whiteSpace: 'nowrap' }}>
                      {act.exercise?.title || 'แบบฝึกหัดทั่วไป'}
                    </Typography>
                    {act.exercise?.topic && (
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', whiteSpace: 'nowrap' }}>
                        หัวข้อ: {act.exercise.topic}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ color: '#475569', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {act.session?.sessionName || '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={diffMeta.label}
                      size="small"
                      sx={{
                        bgcolor: diffMeta.bg,
                        color: diffMeta.color,
                        border: `1px solid ${diffMeta.border}`,
                        fontWeight: 700,
                        fontSize: '12px',
                        borderRadius: '8px',
                        px: 0.5
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1.2,
                        py: 0.3,
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        bgcolor: act.eventType === 'submit' ? '#f1f5f9' : '#f8fafc',
                        color: act.eventType === 'submit' ? '#0f172a' : '#64748b',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      {act.eventType === 'submit' ? 'Submit' : 'Run Code'}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.6,
                        px: 1.2,
                        py: 0.3,
                        borderRadius: '6px',
                        bgcolor: isPassed ? '#f0fdf4' : '#fef2f2',
                        color: isPassed ? '#166534' : '#991b1b',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: isPassed ? '1px solid #bbf7d0' : '1px solid #fecaca'
                      }}
                    >
                      {isPassed ? 'Passed' : 'Failed'}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 500, color: '#0f172a', fontSize: '13px' }}>
                      {act.score}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 500, color: '#0f172a', fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {act.runCount} ครั้ง
                  </TableCell>
                  <TableCell sx={{ color: '#64748b', fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {formatThaiDateTime(act.submittedAt)}
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectActivity(act);
                      }}
                      sx={{
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                        px: 1.6,
                        py: 0.6,
                        bgcolor: '#0f172a',
                        color: '#ffffff',
                        boxShadow: 'none',
                        '&:hover': {
                          bgcolor: '#1e293b',
                          boxShadow: 'none',
                        }
                      }}
                    >
                      ตรวจโค้ด
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
        count={activities.length}
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
