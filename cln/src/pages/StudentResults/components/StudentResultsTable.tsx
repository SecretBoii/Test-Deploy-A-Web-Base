import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  TablePagination,
} from '@mui/material';
import { Search, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { StudentReportData } from '../../../api/reports';

interface StudentResultsTableProps {
  students: StudentReportData[];
  page: number;
  rowsPerPage: number;
  searchQuery?: string;
  onPageChange: (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onResetSearch?: () => void;
}

/**
 * คอมโพเนนต์ตารางแสดงผลรายชื่อผู้เรียนและสถิติการเรียนรู้รายบุคคล
 * ถอดแบบ Design Style จากรูปที่ 1 (Exercise Results Table)
 * แสดงข้อมูลข้อเท็จจริง 6 คอลัมน์หลัก ชัดเจน ไม่ซ้ำซ้อน และอ่านง่าย
 */
export const StudentResultsTable: React.FC<StudentResultsTableProps> = ({
  students,
  page,
  rowsPerPage,
  searchQuery,
  onPageChange,
  onRowsPerPageChange,
  onResetSearch,
}) => {
  const navigate = useNavigate();

  // ตรวจสอบ Pagination ไม่ให้หน้าปัจจุบันเกินข้อมูลที่มีจริงเมื่อผลการกรองลดลง
  const totalPages = Math.ceil(students.length / rowsPerPage);
  const safePage = page >= totalPages && totalPages > 0 ? 0 : page;
  const paginatedStudents = students.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);

  // กรณีไม่พบข้อมูลนักเรียนตามเงื่อนไขค้นหา
  if (students.length === 0) {
    if (searchQuery) {
      return (
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
          <Search size={44} color="#94a3b8" />
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>
            ไม่พบรายชื่อนักเรียนที่ตรงกับคำค้นหา &quot;{searchQuery}&quot;
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 450 }}>
            ลองเปลี่ยนคำค้นหาเป็นชื่อ-นามสกุล หรือ รหัสนักศึกษาอื่น
          </Typography>
          {onResetSearch && (
            <Button
              variant="outlined"
              size="small"
              onClick={onResetSearch}
              sx={{
                mt: 1,
                borderRadius: '8px',
                textTransform: 'none',
                color: '#0f172a',
                borderColor: '#cbd5e1',
              }}
            >
              ล้างคำค้นหา
            </Button>
          )}
        </Box>
      );
    }

    return (
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
        <Inbox size={48} color="#94a3b8" />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#475569' }}>
          ยังไม่มีผู้เรียนที่เริ่มเข้าทำแบบฝึกหัด
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 450 }}>
          ระบบจะแสดงข้อมูลสถิติเฉพาะผู้เรียนที่มีการเริ่มเข้าทำ (ทดลองรันโค้ด หรือส่งตรวจ) แล้วเท่านั้น
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 1040 }}>
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
              {/* คอลัมน์ 1: ชื่อผู้เรียน / รหัสนักศึกษา */}
              <TableCell sx={{ minWidth: 240 }}>ชื่อผู้เรียน / รหัสนักศึกษา</TableCell>

              {/* คอลัมน์ 2: โจทย์ที่เข้าทำทั้งหมด */}
              <TableCell align="center" sx={{ minWidth: 140 }}>โจทย์ที่เข้าทำทั้งหมด</TableCell>

              {/* คอลัมน์ 3: โจทย์ที่ผ่าน */}
              <TableCell align="center" sx={{ minWidth: 120 }}>โจทย์ที่ผ่าน</TableCell>

              {/* คอลัมน์ 4: ความคืบหน้า */}
              <TableCell align="center" sx={{ minWidth: 110 }}>ความคืบหน้า</TableCell>

              {/* คอลัมน์ 5: คะแนนเฉลี่ย */}
              <TableCell align="center" sx={{ minWidth: 110 }}>คะแนนเฉลี่ย</TableCell>

              {/* คอลัมน์ 6: รัน/ส่งเฉลี่ย */}
              <TableCell align="center" sx={{ minWidth: 150 }}>รัน/ส่งเฉลี่ย</TableCell>

              {/* คอลัมน์ 7: รายละเอียด (ปุ่ม Dark Navy สไตล์รูปที่ 1) */}
              <TableCell align="center" sx={{ minWidth: 100 }}>รายละเอียด</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedStudents.map((student) => {
              const attemptedEx = student.attemptedExercises ?? (student.passedExercises ?? 0);
              const totalEx = student.totalExercises && student.totalExercises > 0 ? student.totalExercises : 1;
              const passedEx = student.passedExercises ?? 0;
              const passPercent = Math.min(100, Math.round((passedEx / totalEx) * 100));
              const score = Number(student.averageScore ?? 0);
              const avgRuns = Number(student.averageAttempts ?? 0);
              const submits = Number(student.totalSubmissions ?? 0);
              const avgSubmits = attemptedEx > 0 ? Number((submits / attemptedEx).toFixed(1)) : 0;

              return (
                <TableRow
                  key={student.userId}
                  hover
                  sx={{
                    '& td': { borderBottom: '1px solid #f1f5f9', py: 1.8 },
                    transition: 'background-color 0.15s ease',
                    '&:hover': { bgcolor: '#f8fafc' },
                  }}
                >
                  {/* 1. ชื่อผู้เรียน / รหัสนักศึกษา */}
                  <TableCell>
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14px', lineHeight: 1.3 }}>
                      {student.fullName || student.username}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.4, fontSize: '12px' }}>
                      @{student.username}
                      {student.faculty && student.faculty !== '-' ? ` • ${student.faculty}` : ''}
                    </Typography>
                  </TableCell>

                  {/* 2. โจทย์ที่เข้าทำทั้งหมด */}
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                      {attemptedEx} ข้อ
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.3 }}>
                      จาก {student.totalExercises || 0} ข้อที่เปิดให้ทำ
                    </Typography>
                  </TableCell>

                  {/* 3. โจทย์ที่ผ่าน */}
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                      {passedEx} ข้อ
                    </Typography>
                  </TableCell>

                  {/* 4. ความคืบหน้า */}
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>
                      {passPercent}%
                    </Typography>
                  </TableCell>

                  {/* 5. คะแนนเฉลี่ย */}
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                      {score > 0 ? score.toFixed(1) : '0.0'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      / 100
                    </Typography>
                  </TableCell>

                  {/* 6. รัน/ส่งเฉลี่ย */}
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>
                      รัน {avgRuns.toFixed(1)} / ส่ง {avgSubmits.toFixed(1)} ครั้ง
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      ส่งรวม {submits} ครั้ง
                    </Typography>
                  </TableCell>

                  {/* 6. รายละเอียด (ปุ่ม Solid Dark Navy มน 8px ถอดแบบรูปที่ 1) */}
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/student-results/${student.userId}`)}
                      sx={{
                        bgcolor: '#0f172a',
                        color: '#ffffff',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        px: 2,
                        py: 0.7,
                        boxShadow: 'none',
                        '&:hover': {
                          bgcolor: '#1e293b',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      ดูเพิ่มเติม
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination ควบคุมจำนวนรายการต่อหน้า */}
      <TablePagination
        component="div"
        count={students.length}
        page={safePage}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="แสดงแถวต่อหน้า:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count !== -1 ? count : `มากกว่า ${to}`}`}
        sx={{
          borderTop: '1px solid #e2e8f0',
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontSize: '13px',
            color: '#64748b',
          },
        }}
      />
    </Box>
  );
};
