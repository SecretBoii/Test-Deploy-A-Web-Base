import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Button, IconButton, Chip
} from '@mui/material';
import { X, Code, BookOpen } from 'lucide-react';
import type { StudentActivityItem } from '../../../api/reports';
import type { GroupedExerciseItem } from '../StudentErrorReportDetailPage';
import { ExerciseErrorActivityItem } from './ExerciseErrorActivityItem';

interface ExerciseErrorHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  exercise: GroupedExerciseItem | null;
  onInspectSingleActivity: (activity: StudentActivityItem) => void;
}

export function ExerciseErrorHistoryDialog({
  open,
  onClose,
  exercise,
  onInspectSingleActivity,
}: ExerciseErrorHistoryDialogProps) {
  if (!exercise) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* 1. ส่วนหัว Dialog: ชื่อโจทย์และข้อมูลสรุป */}
      <DialogTitle sx={{ px: 3, py: 2.2, bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ p: 1, bgcolor: '#eff6ff', color: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
              <Code size={20} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.3, fontSize: '1.1rem' }}>
                {exercise.title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 1, mt: 0.2 }}>
                <span>บทเรียน: <strong>{exercise.topic || 'ทั่วไป'}</strong></span>
                <span>•</span>
                <span>พบข้อผิดพลาดทั้งหมด <strong style={{ color: '#dc2626' }}>{exercise.activities.length} ครั้ง</strong></span>
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* 2. เนื้อหาข้างใน: รายการประวัติการรัน/ส่งโค้ดทั้งหมดของข้อนี้ */}
      <DialogContent sx={{ p: 3, bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookOpen size={16} color="#2563eb" />
            ประวัติการรันและส่งโค้ดที่เกิด Error (เรียงจากล่าสุดไปเก่าสุด)
          </Typography>
          <Chip
            label={`${exercise.activities.length} รายการ`}
            size="small"
            sx={{ bgcolor: '#e2e8f0', color: '#334155', fontWeight: 700, fontSize: '11.5px' }}
          />
        </Box>

        {exercise.activities.map((act, index) => {
          const runNumber = exercise.activities.length - index;
          return (
            <ExerciseErrorActivityItem
              key={act.activityId}
              activity={act}
              runNumber={runNumber}
              onInspect={onInspectSingleActivity}
            />
          );
        })}
      </DialogContent>

      {/* 3. ส่วนท้าย Dialog: ปุ่มปิด */}
      <DialogActions sx={{ px: 3, py: 1.8, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: '#475569',
            borderColor: '#cbd5e1',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 700,
            px: 2.5,
            '&:hover': { bgcolor: '#f8fafc', borderColor: '#94a3b8' },
          }}
        >
          ปิดหน้าต่าง
        </Button>
      </DialogActions>
    </Dialog>
  );
}
