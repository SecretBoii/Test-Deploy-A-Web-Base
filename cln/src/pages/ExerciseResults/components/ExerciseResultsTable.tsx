import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  Button,
  TablePagination,
} from '@mui/material';
import { Inbox, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ExerciseAnalyticsData } from '../../../api/reports';
import { DIFFICULTY_LEVELS, type DifficultyMetadata } from '../../../constants/difficulty';

interface ExerciseResultsTableProps {
  exercises: ExerciseAnalyticsData[];
  page: number;
  rowsPerPage: number;
  searchQuery?: string;
  onResetSearch?: () => void;
  onPageChange: (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ExerciseResultsTable: React.FC<ExerciseResultsTableProps> = ({
  exercises,
  page,
  rowsPerPage,
  searchQuery,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const navigate = useNavigate();

  // ป้องกันกรณีหน้าปัจจุบันเกินจากจำนวนข้อมูลจริงเมื่อผลการกรองลดลง
  const totalPages = Math.ceil(exercises.length / rowsPerPage);
  const safePage = page >= totalPages && totalPages > 0 ? 0 : page;
  const paginatedExercises = exercises.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);

  // แปลงเวลาใช้จริงเป็นหน่วยที่อ่านง่าย (วินาที / นาที / ชม.) โดยตัดเวลาเป้าหมายออกตามที่ผู้ใช้ร้องขอเพื่อความกระชับ
  const formatTimeSpent = (actualMinutes?: number) => {
    if (!actualMinutes || actualMinutes <= 0) {
      return '-';
    }
    if (actualMinutes < 1) {
      const sec = Math.round(actualMinutes * 60);
      return `${sec} วินาที`;
    }
    if (actualMinutes < 60) {
      return `${actualMinutes.toFixed(1)} นาที`;
    }
    const hours = Math.floor(actualMinutes / 60);
    const mins = Math.round(actualMinutes % 60);
    return mins > 0 ? `${hours} ชม. ${mins} น.` : `${hours} ชม.`;
  };

  if (exercises.length === 0) {
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
          <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 450 }}>
            ลองเปลี่ยนคำค้นหา หรือค้นหาด้วยรหัสข้อแบบฝึกหัด
          </Typography>
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
          ยังไม่มีแบบฝึกหัดที่ถูกเข้าทำ
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 450 }}>
          ระบบจะแสดงข้อมูลสถิติเฉพาะแบบฝึกหัดที่มีนักเรียนเริ่มเข้าทำและส่งตรวจแล้วเท่านั้น
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 1180 }}>
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
              {/* คอลัมน์ 1: ชื่อโจทย์ / แบบฝึกหัด */}
              <TableCell sx={{ minWidth: 260 }}>ชื่อโจทย์ / แบบฝึกหัด</TableCell>

              {/* คอลัมน์ 2: ระดับความยาก */}
              <TableCell align="center" sx={{ minWidth: 160 }}>ระดับความยาก</TableCell>

              {/* คอลัมน์ 3: จำนวนผู้เข้าทำ */}
              <TableCell align="center" sx={{ minWidth: 100 }}>ผู้เข้าทำ</TableCell>

              {/* คอลัมน์ 4: อัตราการผ่าน */}
              <TableCell align="center" sx={{ minWidth: 110 }}>อัตราการผ่าน</TableCell>

              {/* คอลัมน์ 5: คะแนนเฉลี่ย */}
              <TableCell align="center" sx={{ minWidth: 110 }}>คะแนนเฉลี่ย</TableCell>

              {/* คอลัมน์ 6: เวลาเฉลี่ยที่ใช้จริง */}
              <TableCell align="center" sx={{ minWidth: 140 }}>เวลาเฉลี่ยที่ใช้จริง</TableCell>

              {/* คอลัมน์ 7: รัน/ส่งเฉลี่ย */}
              <TableCell align="center" sx={{ minWidth: 140 }}>รัน/ส่งเฉลี่ย</TableCell>

              {/* คอลัมน์ 8: รายละเอียด / การจัดการ */}
              <TableCell align="center" sx={{ minWidth: 100 }}>รายละเอียด</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedExercises.map((row) => {
              const passRate = Number(row.passRateAttempted ?? row.successRate ?? 0);
              const difficultyMeta: DifficultyMetadata = DIFFICULTY_LEVELS[row.difficultyLevel] || {
                label: `Level ${row.difficultyLevel}`,
                description: `ระดับความยาก Level ${row.difficultyLevel}`,
                color: '#0284c7',
                bg: '#f0f9ff',
                border: '#bae6fd',
              };

              const avgRuns = Number(row.avgRuns ?? 0);
              const avgSubmits = Number(row.avgSubmits ?? 0);
              const totalRuns = Number(row.totalRuns ?? 0);

              return (
                <TableRow
                  key={row.exerciseId}
                  hover
                  sx={{
                    '& td': { borderBottom: '1px solid #f1f5f9', py: 1.8 },
                    transition: 'background-color 0.15s ease',
                    '&:hover': { bgcolor: '#f8fafc' },
                  }}
                >
                  {/* 1. ชื่อโจทย์ / แบบฝึกหัด (แสดงชื่อโจทย์ตัวหนา พร้อมรหัสและหัวข้อบทเรียนด้านล่าง) */}
                  <TableCell>
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14px', lineHeight: 1.3 }}>
                      {row.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.4, fontSize: '12px' }}>
                      รหัส #{row.exerciseId} {row.topic ? `• หัวข้อ: ${row.topic}` : ''}
                    </Typography>
                  </TableCell>

                  {/* 2. ระดับความยาก (สไตล์รูปที่ 1: กล่องมนสีฟ้า Remembering & Understanding) */}
                  <TableCell align="center">
                    <Chip
                      label={difficultyMeta.label}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '12px',
                        color: difficultyMeta.color,
                        bgcolor: difficultyMeta.bg,
                        border: `1px solid ${difficultyMeta.border}`,
                        borderRadius: '8px',
                        px: 0.5,
                      }}
                    />
                  </TableCell>

                  {/* 3. ผู้เข้าทำ (แสดงเฉพาะจำนวนคนเข้าทำจริงตามคำสั่ง) */}
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                      {row.attemptedStudents ?? 0} คน
                    </Typography>
                  </TableCell>

                  {/* 4. อัตราการผ่าน (แสดงตัวเลขเปอร์เซ็นต์สีเข้มมาตรฐาน คลีนสะบายตา ไม่แบ่งสีเขียว/ส้ม/แดง) */}
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>
                      {passRate.toFixed(0)}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.3 }}>
                      ผ่าน {row.passedStudents ?? 0} คน
                    </Typography>
                  </TableCell>

                  {/* 5. คะแนนเฉลี่ย */}
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                      {Number(row.avgScore ?? 0).toFixed(1)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      / 100
                    </Typography>
                  </TableCell>

                  {/* 6. เวลาเฉลี่ยที่ใช้จริง (ตัดเป้าหมายออก แสดงเฉพาะเวลาจริงที่ใช้) */}
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '13px' }}>
                      {formatTimeSpent(row.avgTimeSpentMinutes)}
                    </Typography>
                  </TableCell>

                  {/* 7. รัน/ส่งเฉลี่ย */}
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>
                      รัน {avgRuns.toFixed(1)} / ส่ง {avgSubmits.toFixed(1)} ครั้ง
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      รันรวม {totalRuns} ครั้ง
                    </Typography>
                  </TableCell>

                  {/* 8. รายละเอียด / การจัดการ (ปุ่ม Solid Royal Blue มน 8px) */}
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/exercise-results/${row.exerciseId}`)}
                      sx={{
                        bgcolor: '#2563eb',
                        color: '#ffffff',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        px: 2,
                        py: 0.7,
                        boxShadow: 'none',
                        '&:hover': {
                          bgcolor: '#1d4ed8',
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

      {/* แถบควบคุมการแบ่งหน้า (Pagination) */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={exercises.length}
        rowsPerPage={rowsPerPage}
        page={safePage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="แถวต่อหน้า:"
        labelDisplayedRows={({ from, to, count }) => `${from} - ${to} จาก ${count} ข้อ`}
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
