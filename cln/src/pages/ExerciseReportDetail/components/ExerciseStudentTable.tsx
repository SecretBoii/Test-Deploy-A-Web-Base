import { useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Button, TablePagination, Box
} from '@mui/material';
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
          <TableHead sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <TableRow sx={{ '& th': { bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', py: 1.8, fontWeight: 700, color: '#475569', fontSize: '13px' } }}>
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
                <TableCell colSpan={8} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
                    ไม่พบข้อมูลนักศึกษาตามเงื่อนไขที่เลือก
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedStudents.map((st) => (
                <TableRow 
                  key={st.userId} 
                  hover
                  sx={{
                    '& td': { borderBottom: '1px solid #f1f5f9', py: 1.6 },
                    transition: 'background-color 0.15s ease',
                    '&:hover': { bgcolor: '#f8fafc' },
                  }}
                >
                  <TableCell>
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{st.fullName}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>@{st.username}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{st.university || '-'}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>{st.faculty || '-'}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    {st.bestScore !== null ? (
                      <Typography sx={{ fontWeight: 500, fontSize: '13px', color: '#0f172a' }}>
                        {st.bestScore} / 100
                      </Typography>
                    ) : (
                      <Typography sx={{ color: '#94a3b8', fontSize: '13px' }}>-</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {st.status === 'PASSED' && (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.6,
                          px: 1.5,
                          py: 0.4,
                          borderRadius: '20px',
                          bgcolor: '#ecfdf5',
                          color: '#10b981',
                          fontSize: '12px',
                          fontWeight: 700,
                          border: '1px solid #a7f3d0',
                        }}
                      >
                        ผ่าน
                      </Box>
                    )}
                    {st.status === 'FAILED' && (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.6,
                          px: 1.5,
                          py: 0.4,
                          borderRadius: '20px',
                          bgcolor: '#fff1f2',
                          color: '#ef4444',
                          fontSize: '12px',
                          fontWeight: 700,
                          border: '1px solid #fecdd3',
                        }}
                      >
                        ไม่ผ่าน
                      </Box>
                    )}
                    {st.status === 'NOT_SUBMITTED' && (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          px: 1.5,
                          py: 0.4,
                          borderRadius: '20px',
                          bgcolor: '#f1f5f9',
                          color: '#475569',
                          fontSize: '12px',
                          fontWeight: 600,
                          border: '1px solid #cbd5e1',
                        }}
                      >
                        ยังไม่ส่งตรวจ
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 500, fontSize: '13px', color: '#0f172a' }}>{st.runCount} ครั้ง</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 500, fontSize: '13px', color: '#0f172a' }}>{st.submitCount} ครั้ง</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
                      {st.lastSubmittedAt ? new Date(st.lastSubmittedAt).toLocaleDateString('th-TH') : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      disabled={!st.latestActivity}
                      onClick={() => onInspectCode(st)}
                      sx={{
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                        px: 1.6,
                        py: 0.6,
                        color: '#ffffff',
                        bgcolor: '#0f172a',
                        boxShadow: 'none',
                        '&:hover': {
                          bgcolor: '#1e293b',
                          boxShadow: 'none',
                        },
                        '&.Mui-disabled': {
                          bgcolor: '#f1f5f9',
                          color: '#cbd5e1',
                        }
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
