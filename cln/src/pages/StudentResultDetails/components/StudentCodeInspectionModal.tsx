import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Paper,
} from '@mui/material';
import { X, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';
import type { StudentExerciseItem } from './StudentHeaderCard';
import { formatThaiDateTime } from '../../../utils/dateUtils';
import { InspectionHistorySidebar, type ActivityWithMeta } from './InspectionHistorySidebar';

interface StudentCodeInspectionModalProps {
  open: boolean;
  onClose: () => void;
  exercise: StudentExerciseItem | null;
  studentName?: string;
  username?: string;
}

export const StudentCodeInspectionModal: React.FC<StudentCodeInspectionModalProps> = ({
  open,
  onClose,
  exercise,
  studentName,
  username,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'submit' | 'run'>('all');
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);

  // ดึงรายการกิจกรรมทั้งหมดของโจทย์ข้อนี้
  const allActivities = useMemo(() => {
    return exercise?.activities || (exercise?.bestActivity ? [exercise.bestActivity] : []);
  }, [exercise]);

  // คำนวณลำดับหมายเลขรอบ (Run #1, Run #2, Submit #1...) จากเก่าสุดไปล่าสุด
  const activitiesWithMeta: ActivityWithMeta[] = useMemo(() => {
    if (!allActivities.length) return [];

    // เรียงจากเก่าไปใหม่เพื่อรันเลขครั้งที่ 1, 2, 3...
    const chronological = [...allActivities].sort((a, b) => {
      const timeA = new Date(a.submittedAt || a.startedAt).getTime();
      const timeB = new Date(b.submittedAt || b.startedAt).getTime();
      return timeA - timeB;
    });

    let runCount = 0;
    let submitCount = 0;

    const mapped: ActivityWithMeta[] = chronological.map((act) => {
      const isSubmit = act.eventType === 'submit' || act.eventType === 'SUBMIT';
      const isRun = act.eventType === 'run' || act.eventType === 'RUN';
      let label = '';

      if (isSubmit) {
        submitCount += 1;
        label = `Submit #${submitCount}`;
        // รีเซ็ตตัวนับการ Run ให้เริ่มที่ 1 ใหม่สำหรับรอบส่งตรวจถัดไป
        runCount = 0;
      } else {
        runCount += 1;
        label = `Run #${runCount}`;
      }

      return {
        activity: act,
        label,
        isSubmit,
        isRun,
        timestamp: act.submittedAt || act.startedAt,
      };
    });

    // สำหรับแสดงผลใน Timeline Sidebar ให้เรียงรอบล่าสุดไว้ด้านบนสุด
    return mapped.reverse();
  }, [allActivities]);

  // ตั้งค่ารอบเริ่มต้นที่เลือกดู: เลือกรอบล่าสุดที่อยู่บนสุดของรายการ
  useEffect(() => {
    if (open && activitiesWithMeta.length > 0) {
      setSelectedActivityId(activitiesWithMeta[0].activity.activityId);
    }
  }, [open, activitiesWithMeta]);

  // กรองตามประเภทแท็บใน Sidebar
  const filteredTimeline = useMemo(() => {
    return activitiesWithMeta.filter((item) => {
      if (filterType === 'submit') return item.isSubmit;
      if (filterType === 'run') return item.isRun;
      return true;
    });
  }, [activitiesWithMeta, filterType]);

  // ซิงค์การเลือก: หากเปลี่ยนแท็บแล้วรายการที่เลือกไม่อยู่ในแท็บนี้ ให้เลือกรายการแรกของแท็บใหม่
  useEffect(() => {
    if (filteredTimeline.length > 0) {
      const isStillInList = filteredTimeline.some(
        (item) => item.activity.activityId === selectedActivityId,
      );
      if (!isStillInList) {
        setSelectedActivityId(filteredTimeline[0].activity.activityId);
      }
    }
  }, [filterType, filteredTimeline, selectedActivityId]);

  if (!exercise || activitiesWithMeta.length === 0) return null;

  // ข้อมูลของรอบที่ถูกเลือกอยู่ในปัจจุบัน
  const currentMeta =
    activitiesWithMeta.find((item) => item.activity.activityId === selectedActivityId) ||
    activitiesWithMeta[0];

  const currentActivity = currentMeta.activity;
  const isCurrentSubmit = currentMeta.isSubmit;
  const isCurrentPassed = isCurrentSubmit && currentActivity.score >= 80;
  const diffMeta = DIFFICULTY_LEVELS[exercise.difficultyLevel] || DIFFICULTY_LEVELS[1];

  const totalSubmits = activitiesWithMeta.filter((a) => a.isSubmit).length;
  const totalRuns = activitiesWithMeta.filter((a) => a.isRun).length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
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
      {/* ส่วนหัว Dialog: แสดงชื่อโจทย์, ข้อมูลผู้เรียน และปุ่มปิด */}
      <DialogTitle sx={{ px: 3, py: 2.2, bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap', mb: 0.4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.3, fontSize: '1.15rem' }}>
                {exercise.title}
              </Typography>
              <Chip
                label={diffMeta.label}
                size="small"
                sx={{
                  bgcolor: `${diffMeta.color}15`,
                  color: diffMeta.color,
                  fontWeight: 700,
                  fontSize: '11.5px',
                  borderRadius: '6px',
                  height: '22px',
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontSize: '12.5px' }}>
              ผู้เรียน: <span style={{ color: '#1e293b', fontWeight: 600 }}>{studentName || username}</span>
              {username && <> (@{username})</>}
              {' '}• บทเรียน: <span style={{ color: '#334155', fontWeight: 600 }}>{exercise.sessionName}</span>
              {' '}• ประวัติทั้งหมด: <span style={{ color: '#0f172a', fontWeight: 700 }}>ส่งตรวจ {totalSubmits} ครั้ง</span> / <span style={{ color: '#0f172a', fontWeight: 700 }}>รันโค้ด {totalRuns} ครั้ง</span>
            </Typography>
          </Box>

          <IconButton onClick={onClose} size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#0f172a' } }}>
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* เนื้อหา Dialog: ฝั่งซ้าย Timeline Sidebar + ฝั่งขวา Code & Console */}
      <DialogContent sx={{ p: 0, bgcolor: '#f8fafc' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: '560px',
          }}
        >
          {/* ================= ฝั่งซ้าย: TIMELINE SIDEBAR ================= */}
          <InspectionHistorySidebar
            timeline={filteredTimeline}
            selectedActivityId={selectedActivityId}
            onSelectActivity={setSelectedActivityId}
            filterType={filterType}
            onFilterChange={setFilterType}
            totalSubmits={totalSubmits}
            totalRuns={totalRuns}
            totalCount={activitiesWithMeta.length}
          />

          {/* ================= ฝั่งขวา: รายละเอียดโค้ด & ผลลัพธ์ของรอบที่เลือก ================= */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
              overflowY: 'auto',
              maxHeight: '620px',
            }}
          >
            {/* แถบสถานะของรอบที่กำลังตรวจดู */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                bgcolor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                  กำลังดู: {currentMeta.label}
                </Typography>

                <Chip
                  label={isCurrentSubmit ? 'Submit' : 'Run'}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '11.5px',
                    bgcolor: isCurrentSubmit ? '#eff6ff' : '#f1f5f9',
                    color: isCurrentSubmit ? '#2563eb' : '#64748b',
                    border: isCurrentSubmit ? '1px solid #bfdbfe' : '1px solid #cbd5e1',
                  }}
                />

                {isCurrentSubmit && (
                  <Chip
                    icon={isCurrentPassed ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                    label={isCurrentPassed ? 'Passed' : 'Failed'}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '11.5px',
                      bgcolor: isCurrentPassed ? '#ecfdf5' : '#fef2f2',
                      color: isCurrentPassed ? '#059669' : '#dc2626',
                      border: isCurrentPassed ? '1px solid #a7f3d0' : '1px solid #fecaca',
                    }}
                  />
                )}

              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '12px' }}>
                  เวลา: <span style={{ color: '#1e293b', fontWeight: 600 }}>{formatThaiDateTime(currentMeta.timestamp)}</span>
                </Typography>

                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1.5,
                    py: 0.3,
                    bgcolor: '#f1f5f9',
                    borderRadius: '8px',
                    color: '#0f172a',
                    border: '1px solid #e2e8f0',
                    fontWeight: 800,
                    fontSize: '13px',
                  }}
                >
                  {currentActivity.score ?? 0} / 100 คะแนน
                </Box>
              </Box>
            </Paper>

            {/* โค้ด Python (ซ้าย 7 ส่วน) และ Console Output (ขวา 5 ส่วน) */}
            <Grid container spacing={2}>
              {/* ซอร์สโค้ดภาษา Python ในรอบนี้ */}
              <Grid size={{ xs: 12, lg: 7 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>
                    ซอร์สโค้ดภาษา Python ในรอบนี้:
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: '#0f172a',
                    color: '#f8fafc',
                    p: 2.2,
                    borderRadius: '12px',
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    overflowX: 'auto',
                    minHeight: '260px',
                    maxHeight: '380px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    border: '1px solid #334155',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {currentActivity.answer || '# ไม่พบข้อมูลโค้ดคำตอบที่ส่ง'}
                </Box>
              </Grid>

              {/* ผลลัพธ์การรัน (Console Output / Errors) ในรอบนี้ */}
              <Grid size={{ xs: 12, lg: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>
                    ผลลัพธ์การรัน (Console Output / Errors):
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    p: 2.2,
                    borderRadius: '12px',
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    fontSize: '12.5px',
                    lineHeight: 1.5,
                    minHeight: '260px',
                    maxHeight: '380px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    color: currentActivity.exceptionMessage ? '#dc2626' : '#334155',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  {currentActivity.exceptionMessage
                    ? `[Exception / Error Occurred]\n${currentActivity.exceptionMessage}`
                    : currentActivity.output || 'โค้ดทำงานสำเร็จ (ไม่มีข้อความ print ออกมา)'}
                </Box>
              </Grid>
            </Grid>

            {/* กล่องคำแนะนำและการประเมินจากระบบ AI ในรอบนี้ (ถ้ามี) */}
            {currentActivity.aiFeedback && (
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Sparkles size={16} color="#2563eb" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>
                    คำแนะนำและการประเมินจากระบบ AI (รอบนี้):
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#334155',
                    fontSize: '13.5px',
                    lineHeight: 1.65,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {currentActivity.aiFeedback}
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </DialogContent>

      {/* ส่วนท้าย Dialog: ปุ่มปิดหน้าต่าง */}
      <DialogActions sx={{ px: 3, py: 1.8, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: '#0f172a',
            color: '#ffffff',
            borderRadius: '8px',
            px: 2.5,
            py: 0.8,
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#1e293b',
              boxShadow: 'none',
            },
          }}
        >
          ปิดหน้าต่าง
        </Button>
      </DialogActions>
    </Dialog>
  );
};
