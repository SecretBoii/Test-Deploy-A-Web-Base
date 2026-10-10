import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Button, IconButton, Chip
} from '@mui/material';
import { X } from 'lucide-react';
import type { StudentActivityItem } from '../../../api/reports';
import type { GroupedExerciseItem } from '../StudentErrorReportDetailPage';
import { ExerciseErrorActivityItem } from './ExerciseErrorActivityItem';
import { ExerciseErrorCodeInspectionView } from './ExerciseErrorCodeInspectionView';

interface ExerciseErrorHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  exercise: GroupedExerciseItem | null;
  onInspectSingleActivity?: (activity: StudentActivityItem) => void;
}

export function ExerciseErrorHistoryDialog({
  open,
  onClose,
  exercise,
  onInspectSingleActivity,
}: ExerciseErrorHistoryDialogProps) {
  // State ภายในสำหรับจำว่ากำลังตรวจโค้ดกิจกรรมรอบใด (ถ้าเป็น null จะแสดงหน้ารายการประวัติ)
  const [inspectingActivity, setInspectingActivity] = useState<StudentActivityItem | null>(null);

  // รีเซ็ตกลับสู่หน้ารายการประวัติเสมอเมื่อ Dialog ถูกปิด (ไม่ว่าจะปิดด้วยปุ่มหรือ Backdrop)
  useEffect(() => {
    if (!open) {
      setInspectingActivity(null);
    }
  }, [open]);

  if (!exercise) return null;

  // ฟังก์ชันปิด Dialog พร้อมรีเซ็ตสถานะกลับสู่หน้ารวมประวัติเสมอ
  const handleClose = () => {
    setInspectingActivity(null);
    onClose();
  };

  // จัดการเมื่อคลิกตรวจโค้ดในแต่ละรอบ
  const handleSelectActivity = (act: StudentActivityItem) => {
    setInspectingActivity(act);
    if (onInspectSingleActivity) {
      onInspectSingleActivity(act);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      {/* สลับมุมมองตาม State: ถ้ามี inspectingActivity ให้แสดงหน้าตรวจโค้ด (View 2) ถ้าไม่มีให้แสดงหน้ารวมประวัติ (View 1) */}
      {inspectingActivity ? (
        <ExerciseErrorCodeInspectionView
          exercise={exercise}
          activity={inspectingActivity}
          onBack={() => setInspectingActivity(null)}
          onClose={handleClose}
        />
      ) : (
        <>
          {/* ส่วนหัว View 1: ชื่อโจทย์และข้อมูลสรุป */}
          <DialogTitle sx={{ px: 3, py: 2.2, bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.3, fontSize: '1.1rem' }}>
                    {exercise.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 1, mt: 0.2 }}>
                    <span>บทเรียน: <strong>{exercise.topic || 'ทั่วไป'}</strong></span>
                    <span>•</span>
                    <span>พบข้อผิดพลาดทั้งหมด <strong>{exercise.activities.length} ครั้ง</strong></span>
                  </Typography>
                </Box>
              </Box>

              <IconButton onClick={handleClose} size="small" sx={{ color: '#64748b' }}>
                <X size={20} />
              </IconButton>
            </Box>
          </DialogTitle>

          {/* เนื้อหา View 1: รายการประวัติการรัน/ส่งโค้ดทั้งหมดของข้อนี้ */}
          <DialogContent
            sx={{
              px: 3,
              pb: 3,
              pt: '24px !important',
              bgcolor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1, fontSize: '13.5px' }}>
                ประวัติการรันและส่งโค้ดที่เกิด Error (เรียงจากล่าสุดไปเก่าสุด)
              </Typography>
              <Chip
                label={`${exercise.activities.length} รายการ`}
                size="small"
                sx={{ bgcolor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', fontWeight: 700, fontSize: '11.5px' }}
              />
            </Box>

            {exercise.activities.map((act, index) => {
              const runNumber = exercise.activities.length - index;
              return (
                <ExerciseErrorActivityItem
                  key={act.activityId}
                  activity={act}
                  runNumber={runNumber}
                  onInspect={handleSelectActivity}
                />
              );
            })}
          </DialogContent>

          {/* ส่วนท้าย View 1: ปุ่มปิด */}
          <DialogActions sx={{ px: 3, py: 1.8, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{
                bgcolor: '#2563eb',
                color: '#ffffff',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '13px',
                boxShadow: 'none',
                px: 2.5,
                py: 0.7,
                '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' },
              }}
            >
              ปิดหน้าต่าง
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
