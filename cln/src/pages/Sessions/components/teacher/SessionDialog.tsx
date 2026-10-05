import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { X, Save, Pencil, Plus, Layers } from 'lucide-react';
import { DIFFICULTY_LEVELS } from '../../../../constants/difficulty';
import { apiClient } from '../../../../api/client';
import type { TeacherSessionItem, SessionFormData } from '../../types';
import { ConfirmDialog } from './ConfirmDialog';
import { ExercisePicker, type ExerciseOption } from './ExercisePicker';

interface SessionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SessionFormData) => Promise<void> | void;
  sessionData?: TeacherSessionItem | null;
}

export const SessionDialog: React.FC<SessionDialogProps> = ({
  open,
  onClose,
  onSave,
  sessionData,
}) => {
  // ฟอร์มหลัก: ใช้โครงสร้าง state เดียวกับ ExerciseDialog
  const [form, setForm] = useState({
    sessionName: '',
    sessionObjective: '',
    targetLevel: 1,
    duration: 0,
    status: 'active',
  });

  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);
  const [allExercises, setAllExercises] = useState<ExerciseOption[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  // แปลง Array เป็น Set เพื่อให้ ExercisePicker เช็คได้เร็ว O(1)
  const selectedExerciseIdsSet = useMemo(() => {
    return new Set(selectedExerciseIds);
  }, [selectedExerciseIds]);

  // คำนวณเวลารวมโดยประมาณของโจทย์ที่เลือก (นาที)
  const totalEstimatedTime = useMemo(() => {
    return allExercises
      .filter((ex) => selectedExerciseIdsSet.has(ex.exerciseId))
      .reduce((sum, ex) => sum + (ex.expectedTime || 5), 0);
  }, [allExercises, selectedExerciseIdsSet]);

  // โหลดรายชื่อโจทย์เมื่อเปิด Dialog
  useEffect(() => {
    if (open) {
      fetchExercises();
    }
  }, [open]);

  // ซิงค์ข้อมูลตั้งต้นเมื่อเปิด Dialog
  useEffect(() => {
    if (sessionData) {
      setForm({
        sessionName: sessionData.sessionName || '',
        sessionObjective: sessionData.sessionObjective || '',
        targetLevel: sessionData.targetLevel || 1,
        duration: sessionData.duration || 0,
        status: sessionData.status || 'active',
      });
      const initialIds = sessionData.exercises?.map((e) => e.exerciseId) || [];
      setSelectedExerciseIds(initialIds);
    } else {
      setForm({
        sessionName: '',
        sessionObjective: '',
        targetLevel: 1,
        duration: 0,
        status: 'active',
      });
      setSelectedExerciseIds([]);
    }
    setErrors({});
    setConfirmOpen(false);
  }, [sessionData, open]);

  const fetchExercises = async () => {
    try {
      setLoadingExercises(true);
      const res = await apiClient.get('/exercises/manage/all');
      setAllExercises(res.data);
    } catch (err) {
      console.error('Failed to fetch exercises for session picker:', err);
    } finally {
      setLoadingExercises(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'targetLevel' || name === 'duration' ? Number(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Callback สำหรับ toggle การเลือกโจทย์ (คำนวณเวลารวมโจทย์และอัปเดตเวลา duration อัตโนมัติ)
  const handleToggleExercise = useCallback((exerciseId: number) => {
    const exists = selectedExerciseIds.includes(exerciseId);
    const nextIds = exists
      ? selectedExerciseIds.filter((id) => id !== exerciseId)
      : [...selectedExerciseIds, exerciseId];

    // 1. อัปเดตรายการโจทย์ที่เลือก
    setSelectedExerciseIds(nextIds);

    // 2. รวมเวลา expectedTime ของโจทย์ทั้งหมดที่ถูกเลือก
    const nextSet = new Set(nextIds);
    const calculatedDuration = allExercises
      .filter((ex) => nextSet.has(ex.exerciseId))
      .reduce((sum, ex) => sum + (ex.expectedTime || 5), 0);

    // 3. อัปเดตเวลาลงฟอร์มแยกออกมาอย่างชัดเจน (ไม่ซ้อนใน State Updater)
    setForm((prev) => ({
      ...prev,
      duration: calculatedDuration,
    }));

    // 4. เคลียร์ error ของ duration หากมี
    setErrors((prev) => {
      if (!prev.duration) return prev;
      const next = { ...prev };
      delete next.duration;
      return next;
    });
  }, [selectedExerciseIds, allExercises]);

  // Callback สำหรับล้างการเลือกโจทย์ทั้งหมด
  const handleClearAllExercises = useCallback(() => {
    setSelectedExerciseIds([]);
    setForm((prev) => ({
      ...prev,
      duration: 0,
    }));
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.sessionName.trim()) newErrors.sessionName = 'กรุณากรอกชื่อ Session';
    if (!form.sessionObjective.trim()) newErrors.sessionObjective = 'กรุณากรอกจุดประสงค์การเรียนรู้';
    if (form.duration <= 0) newErrors.duration = 'ระยะเวลาต้องมากกว่า 0 นาที (กรุณาเลือกโจทย์หรือกำหนดเวลา)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // เมื่อกดปุ่มบันทึก ให้ตรวจสอบความถูกต้องของฟอร์มก่อน แล้วเปิดหน้าต่างยืนยัน
  const handleOpenConfirm = () => {
    if (!validate()) return;
    setConfirmOpen(true);
  };

  // เมื่อผู้ใช้กดยืนยันใน Confirm Dialog ให้ส่งข้อมูลไปยัง onSave แล้วปิด Dialog
  const handleConfirmSave = async () => {
    try {
      setSubmitting(true);
      await onSave({
        ...form,
        exerciseIds: selectedExerciseIds,
      });
      setConfirmOpen(false);
      onClose();
    } catch (err) {
      console.error('Save session error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            maxWidth: '1380px',
            width: '95vw',
          },
        },
      }}
    >
      {/* 1. ส่วนหัว Header ของหน้าต่าง (สไตล์เดียวกับ ExerciseDialog) */}
      <Box
        sx={{
          px: 3.5,
          py: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #f1f5f9',
          bgcolor: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              bgcolor: '#eef2ff',
              border: '1px solid #e0e7ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4f46e5',
              boxShadow: '0 2px 4px rgba(79, 70, 229, 0.08)',
            }}
          >
            {sessionData ? <Pencil size={20} /> : <Plus size={22} />}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '18px', lineHeight: 1.2 }}>
              {sessionData ? `แก้ไขชุดบทเรียน #${sessionData.sessionId}` : 'สร้างชุดบทเรียนใหม่ (Session)'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12.5px', mt: 0.25, display: 'block' }}>
              {sessionData
                ? 'ปรับปรุงข้อมูล จุดประสงค์การเรียนรู้ และแบบฝึกหัดที่บรรจุใน Session'
                : 'กำหนดรายละเอียดและเลือกแบบฝึกหัดเพื่อสร้างชุดบทเรียนสำหรับนักศึกษา'}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: '#94a3b8',
            borderRadius: '8px',
            p: 1,
            '&:hover': { color: '#0f172a', bgcolor: '#f1f5f9' },
            transition: 'all 0.15s ease',
          }}
        >
          <X size={20} />
        </IconButton>
      </Box>

      {/* 2. เนื้อหาฟอร์ม (แบ่ง 2 คอลัมน์ซ้าย-ขวา แบบ Split Layout) */}
      <DialogContent sx={{ p: 3, bgcolor: '#ffffff', overflowY: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '4.8fr 7.2fr' },
            gap: 2.5,
            alignItems: 'start',
          }}
        >
          {/* คอลัมน์ซ้าย: ข้อมูลทั่วไปและการตั้งค่า Session */}
          <Box
            sx={{
              p: 2.5,
              bgcolor: '#f8fafc',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box
                  sx={{
                    p: 0.6,
                    borderRadius: '8px',
                    bgcolor: '#eef2ff',
                    color: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Layers size={16} />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                  ข้อมูลทั่วไปและการตั้งค่า Session
                </Typography>
              </Box>

              {/* ชื่อ Session */}
              <Box>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#334155',
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  ชื่อ Session <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                </Typography>
                <TextField
                  fullWidth
                  name="sessionName"
                  value={form.sessionName}
                  onChange={handleChange}
                  error={!!errors.sessionName}
                  helperText={errors.sessionName}
                  placeholder="เช่น Basic Python Syntax & Data Types..."
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: '10px',
                        bgcolor: '#ffffff',
                        fontSize: '13.5px',
                        color: '#1e293b',
                        '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1px' },
                        '&:hover fieldset': { borderColor: '#cbd5e1' },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4f46e5',
                          borderWidth: '1px !important',
                          boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.08)',
                        },
                      },
                    },
                  }}
                />
              </Box>

              {/* จุดประสงค์การเรียนรู้ */}
              <Box>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#334155',
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  จุดประสงค์การเรียนรู้ (Objective) <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  name="sessionObjective"
                  value={form.sessionObjective}
                  onChange={handleChange}
                  error={!!errors.sessionObjective}
                  helperText={errors.sessionObjective}
                  placeholder="เช่น เข้าใจตัวแปร ตัวดำเนินการ และการรับค่า input เบื้องต้นในภาษา Python..."
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: '10px',
                        bgcolor: '#ffffff',
                        fontSize: '13.5px',
                        color: '#1e293b',
                        '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1px' },
                        '&:hover fieldset': { borderColor: '#cbd5e1' },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4f46e5',
                          borderWidth: '1px !important',
                          boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.08)',
                        },
                      },
                    },
                  }}
                />
              </Box>

              {/* Target Level */}
              <Box>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#334155',
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  Target Level <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="targetLevel"
                  value={form.targetLevel}
                  onChange={handleChange}
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: '10px',
                        bgcolor: '#ffffff',
                        fontSize: '13.5px',
                        fontWeight: 500,
                        color: '#1e293b',
                        '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1px' },
                        '&:hover fieldset': { borderColor: '#cbd5e1' },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4f46e5',
                          borderWidth: '1px !important',
                          boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.08)',
                        },
                      },
                    },
                  }}
                >
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <MenuItem key={lvl} value={lvl} sx={{ fontSize: '13.5px' }}>
                      Level {lvl} - {DIFFICULTY_LEVELS[lvl]?.label || ''}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* แถวระยะเวลา และ สถานะการใช้งาน */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#334155',
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    ระยะเวลา (นาที) <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    error={!!errors.duration}
                    helperText={errors.duration}
                    slotProps={{
                      input: {
                        sx: {
                          borderRadius: '10px',
                          bgcolor: '#ffffff',
                          fontSize: '13.5px',
                          fontWeight: 500,
                          color: '#1e293b',
                          '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1px' },
                          '&:hover fieldset': { borderColor: '#cbd5e1' },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4f46e5',
                            borderWidth: '1px !important',
                            boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.08)',
                          },
                        },
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#334155',
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    สถานะการใช้งาน <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        sx: {
                          borderRadius: '10px',
                          bgcolor: '#ffffff',
                          fontSize: '13.5px',
                          fontWeight: 500,
                          color: '#1e293b',
                          '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1px' },
                          '&:hover fieldset': { borderColor: '#cbd5e1' },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4f46e5',
                            borderWidth: '1px !important',
                            boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.08)',
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="active" sx={{ fontSize: '13.5px' }}>Active (เปิดใช้งาน)</MenuItem>
                    <MenuItem value="inactive" sx={{ fontSize: '13.5px' }}>Inactive (ปิดใช้งาน)</MenuItem>
                  </TextField>
                </Box>
              </Box>
            </Box>

            {/* การ์ดสรุปภาพรวมโจทย์ที่เลือก (Pedagogical Overview Card) */}
            <Box
              sx={{
                p: 2,
                bgcolor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                mt: 1.5,
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12px', fontWeight: 600, display: 'block' }}>
                  โจทย์ที่เลือก
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#4f46e5', fontSize: '17px', mt: 0.25 }}>
                  {selectedExerciseIds.length} ข้อ
                </Typography>
              </Box>
              <Box sx={{ width: '1px', height: '30px', bgcolor: '#e2e8f0' }} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12px', fontWeight: 600, display: 'block' }}>
                  เวลารวมโจทย์
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '17px', mt: 0.25 }}>
                  {totalEstimatedTime} นาที
                </Typography>
              </Box>
              <Box sx={{ width: '1px', height: '30px', bgcolor: '#e2e8f0' }} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12px', fontWeight: 600, display: 'block' }}>
                  เวลา Session
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '17px', mt: 0.25 }}>
                  {form.duration || 0} นาที
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* คอลัมน์ขวา: คอมโพเนนต์เลือกแบบฝึกหัด (ขยายความสูงเต็มพิกัด) */}
          <ExercisePicker
            allExercises={allExercises}
            loading={loadingExercises}
            selectedExerciseIdsSet={selectedExerciseIdsSet}
            onToggleExercise={handleToggleExercise}
            onClearAll={handleClearAllExercises}
          />
        </Box>
      </DialogContent>

      {/* 3. ส่วนท้าย Actions ตามแบบ ExerciseDialog */}
      <DialogActions
        sx={{
          px: 3.5,
          py: 2.25,
          borderTop: '1px solid #f1f5f9',
          bgcolor: '#ffffff',
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          disabled={submitting}
          variant="outlined"
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#cbd5e1',
            color: '#475569',
            px: 3,
            py: 0.9,
            '&:hover': {
              bgcolor: '#f8fafc',
              borderColor: '#94a3b8',
            },
          }}
        >
          ยกเลิก
        </Button>
        <Button
          onClick={handleOpenConfirm}
          disabled={submitting}
          variant="contained"
          startIcon={<Save size={16} />}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            bgcolor: '#4f46e5',
            color: '#ffffff',
            px: 3.5,
            py: 0.9,
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
            '&:hover': {
              bgcolor: '#4338ca',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
            },
            transition: 'all 0.15s ease',
          }}
        >
          {submitting ? 'กำลังบันทึก...' : sessionData ? 'บันทึกการแก้ไข' : 'บันทึก Session'}
        </Button>
      </DialogActions>
    </Dialog>

    {/* Dialog ยืนยันก่อนบันทึกข้อมูล */}
    <ConfirmDialog
      open={confirmOpen}
      onClose={() => setConfirmOpen(false)}
      onConfirm={handleConfirmSave}
      title={sessionData ? 'ยืนยันการแก้ไขชุดบทเรียน' : 'ยืนยันการสร้างชุดบทเรียนใหม่'}
      message={
        sessionData
          ? `คุณแน่ใจหรือไม่ว่าต้องการบันทึกการแก้ไขชุดบทเรียน "${form.sessionName}"?`
          : `คุณแน่ใจหรือไม่ว่าต้องการสร้างชุดบทเรียน "${form.sessionName}" เข้าระบบ?`
      }
      confirmText={sessionData ? 'ยืนยันการแก้ไข' : 'ยืนยันการสร้าง'}
      confirmColor="primary"
      loading={submitting}
    />
  </>
  );
};

export default SessionDialog;
