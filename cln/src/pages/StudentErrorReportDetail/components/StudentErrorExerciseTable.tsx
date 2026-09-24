import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Box, Typography, Chip, Button
} from '@mui/material';
import { Code, Clock, CheckCircle } from 'lucide-react';
import { getErrorBadgeStyle, formatThaiTime, type GroupedExerciseItem } from '../StudentErrorReportDetailPage';

interface StudentErrorExerciseTableProps {
  exercises: GroupedExerciseItem[];
  onInspectExercise: (exercise: GroupedExerciseItem) => void;
}

export function StudentErrorExerciseTable({
  exercises,
  onInspectExercise,
}: StudentErrorExerciseTableProps) {
  if (exercises.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '14px', border: '1px dashed #cbd5e1', bgcolor: '#ffffff', boxShadow: 'none' }}>
        <CheckCircle size={36} color="#10b981" style={{ marginBottom: 8 }} />
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
        borderRadius: '14px',
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
          {exercises.map((ex) => {
            const latestActivity = ex.activities[0];
            return (
              <TableRow
                key={ex.exerciseId}
                hover
                sx={{ '& td': { borderBottom: '1px solid #f1f5f9', py: 1.8 } }}
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
                      color: '#334155',
                      fontWeight: 600,
                      fontSize: '12px',
                      borderRadius: '6px',
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

                {/* 4. จำนวน Error รวม */}
                <TableCell align="center">
                  <Chip
                    label={`${ex.activities.length} ครั้ง`}
                    size="small"
                    sx={{
                      bgcolor: '#fff1f2',
                      color: '#dc2626',
                      border: '1px solid #fecdd3',
                      fontWeight: 800,
                      fontSize: '12.5px',
                      borderRadius: '8px',
                      px: 0.5,
                    }}
                  />
                </TableCell>

                {/* 5. เวลาที่พบล่าสุด */}
                <TableCell>
                  <Typography
                    variant="caption"
                    sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.6, fontSize: '12.5px' }}
                  >
                    <Clock size={13} color="#94a3b8" />
                    {latestActivity ? formatThaiTime(latestActivity.submittedAt) : '-'}
                  </Typography>
                </TableCell>

                {/* 6. ปุ่มตรวจประวัติโค้ด */}
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Code size={14} />}
                    onClick={() => onInspectExercise(ex)}
                    sx={{
                      borderRadius: '8px',
                      borderColor: '#cbd5e1',
                      color: '#2563eb',
                      fontWeight: 700,
                      fontSize: '12px',
                      textTransform: 'none',
                      py: 0.6,
                      px: 1.8,
                      whiteSpace: 'nowrap',
                      bgcolor: '#ffffff',
                      '&:hover': { bgcolor: '#eff6ff', borderColor: '#93c5fd' },
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
    </TableContainer>
  );
}
