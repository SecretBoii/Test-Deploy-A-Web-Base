import { useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Button, TablePagination
} from '@mui/material';
import { Code } from 'lucide-react';
import type { ExerciseStudentItem } from '../../../api/reports';

interface ExerciseStudentTableProps {
  students: ExerciseStudentItem[];
  page: number;
  rowsPerPage: number;
  onPageChange: (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onInspectCode: (student: ExerciseStudentItem) => void;
}

export function ExerciseStudentTable({
  students,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onInspectCode,
}: ExerciseStudentTableProps) {
  // ตัดข้อมูลแสดงผลเฉพาะหน้าที่เลือก
  const paginatedStudents = useMemo(() => {
    return students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [students, page, rowsPerPage]);

  return (
    <>
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
            {students.length === 0 ? (
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
                      onClick={() => onInspectCode(st)}
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
        count={students.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
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
    </>
  );
}
