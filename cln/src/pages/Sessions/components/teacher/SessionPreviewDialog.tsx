import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import { X, Layers, BookOpen, Edit3 } from 'lucide-react';
import { DIFFICULTY_LEVELS } from '../../../../constants/difficulty';
import type { TeacherSessionItem } from '../../types';

interface SessionPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  session: TeacherSessionItem | null;
  onEdit?: (session: TeacherSessionItem) => void;
}

export const SessionPreviewDialog: React.FC<SessionPreviewDialogProps> = ({
  open,
  onClose,
  session,
  onEdit,
}) => {
  if (!session) return null;

  const diffMeta = DIFFICULTY_LEVELS[session.targetLevel] || {
    label: `Lv.${session.targetLevel}`,
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
  };

  // รวมเวลาโดยประมาณของโจทย์ทั้งหมดใน Session
  const totalExerciseTime = (session.exercises || []).reduce(
    (sum, ex) => sum + (ex.expectedTime || 0),
    0
  );

  // สไตล์มาตรฐานสำหรับกล่องแสดงค่าแบบ Read-only สไตล์เดียวกับ ExercisePreviewDialog
  const readonlyBoxSx = {
    borderRadius: '10px',
    bgcolor: '#ffffff',
    border: '1px solid #cbd5e1',
    px: 1.75,
    py: 1.1,
    minHeight: '42px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '13.5px',
    color: '#0f172a',
    fontWeight: 500,
  };

  // สไตล์ข้อความหัวข้อกำกับด้านบน (Top Label)
  const labelSx = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#334155',
    mb: 0.75,
  };

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
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* 1. ส่วนหัวของหน้าต่าง (Modal Header) สไตล์เดียวกับ ExercisePreviewDialog */}
      <Box
        sx={{
          px: 3,
          py: 2.25,
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              bgcolor: '#eef2ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(79, 70, 229, 0.08)',
            }}
          >
            <Layers size={20} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '18px', lineHeight: 1.2 }}>
              พรีวิวชุดบทเรียน #{session.sessionId}: {session.sessionName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12.5px', mt: 0.25, display: 'block' }}>
              แสดงรายละเอียดและการตั้งค่าของชุดบทเรียนในมุมมองอาจารย์
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

      {/* 2. เนื้อหาพรีวิวแบบ 2 คอลัมน์ซ้าย-ขวา (Split Layout แบบที่ 2) */}
      <DialogContent sx={{ p: 3, bgcolor: '#ffffff', overflowY: 'auto', maxHeight: 'calc(88vh - 130px)' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '4.6fr 7.4fr' },
            gap: 2.5,
            alignItems: 'start',
          }}
        >
          {/* คอลัมน์ซ้าย: ข้อมูลทั่วไปและการตั้งค่า Session */}
          <Box
            sx={{
              p: 2.5,
              bgcolor: '#f8fafc',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {/* หัวข้อหมวดที่ 1 */}
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
                ข้อมูลทั่วไปของชุดบทเรียน
              </Typography>
            </Box>

            {/* ชื่อชุดบทเรียน */}
            <Box>
              <Typography sx={labelSx}>ชื่อชุดบทเรียน (Session Name)</Typography>
              <Box sx={readonlyBoxSx}>
                {session.sessionName}
              </Box>
            </Box>

            {/* จุดประสงค์การเรียนรู้ */}
            <Box>
              <Typography sx={labelSx}>จุดประสงค์การเรียนรู้ (Objective)</Typography>
              <Box
                sx={{
                  borderRadius: '10px',
                  bgcolor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  p: 1.5,
                  minHeight: '64px',
                  fontSize: '13.5px',
                  color: '#0f172a',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}
              >
                {session.sessionObjective || '-'}
              </Box>
            </Box>

            {/* ระดับเป้าหมาย Bloom */}
            <Box>
              <Typography sx={labelSx}>ระดับเป้าหมาย (Target Level)</Typography>
              <Box sx={readonlyBoxSx}>
                {`Lv.${session.targetLevel} - ${diffMeta.label}`}
              </Box>
            </Box>

            {/* แถวระยะเวลา และ สถานะ */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <Box>
                <Typography sx={labelSx}>ระยะเวลาที่กำหนด</Typography>
                <Box sx={{ ...readonlyBoxSx, justifyContent: 'space-between' }}>
                  <span>{session.duration}</span>
                  <Typography component="span" sx={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
                    นาที
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography sx={labelSx}>สถานะการเผยแพร่</Typography>
                <Box sx={readonlyBoxSx}>
                  {session.status === 'active' ? 'Active (เปิดใช้)' : 'Inactive (ปิด)'}
                </Box>
              </Box>
            </Box>

            {/* การ์ดสรุปตัวเลขสั้นๆ */}
            <Box
              sx={{
                p: 1.75,
                bgcolor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                mt: 0.5,
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12px', fontWeight: 600, display: 'block' }}>
                  จำนวนโจทย์
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#4f46e5', fontSize: '16px', mt: 0.25 }}>
                  {session.exercises?.length || session.exerciseCount || 0} ข้อ
                </Typography>
              </Box>
              <Box sx={{ width: '1px', height: '28px', bgcolor: '#e2e8f0' }} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12px', fontWeight: 600, display: 'block' }}>
                  เวลารวมโจทย์
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '16px', mt: 0.25 }}>
                  {totalExerciseTime} นาที
                </Typography>
              </Box>
              <Box sx={{ width: '1px', height: '28px', bgcolor: '#e2e8f0' }} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12px', fontWeight: 600, display: 'block' }}>
                  เวลา Session
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '16px', mt: 0.25 }}>
                  {session.duration} นาที
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* คอลัมน์ขวา: รายการแบบฝึกหัดใน Session */}
          <Box
            sx={{
              p: 2.5,
              bgcolor: '#f8fafc',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {/* หัวข้อหมวดที่ 2 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                  <BookOpen size={16} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                    แบบฝึกหัดที่บรรจุใน Session ({session.exercises?.length || 0} ข้อ)
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12px' }}>
                    เรียงตามลำดับการเรียนรู้ที่กำหนดไว้สำหรับนักศึกษา
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* รายการโจทย์ Scrollable แบบอ่านง่าย */}
            {session.exercises && session.exercises.length > 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.25,
                  maxHeight: 460,
                  overflowY: 'auto',
                  pr: 0.5,
                }}
              >
                {session.exercises.map((ex, idx) => {
                  const exDiff = DIFFICULTY_LEVELS[ex.difficultyLevel] || {
                    label: `Lv.${ex.difficultyLevel}`,
                    bg: '#eff6ff',
                    color: '#3b82f6',
                    border: '#bfdbfe',
                  };

                  return (
                    <Box
                      key={ex.exerciseId}
                      sx={{
                        p: 1.75,
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                        '&:hover': {
                          borderColor: '#cbd5e1',
                          bgcolor: '#f8fafc',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        },
                      }}
                    >
                      {/* ฝั่งซ้าย: ลำดับที่, รหัส, ชื่อ และหัวข้อ */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '8px',
                            bgcolor: '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '13px',
                            color: '#475569',
                            flexShrink: 0,
                          }}
                        >
                          {idx + 1}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: '#0f172a',
                              fontSize: '13.5px',
                              lineHeight: 1.3,
                            }}
                          >
                            #{ex.exerciseId} {ex.title}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#64748b',
                              fontSize: '12px',
                              fontWeight: 500,
                              mt: 0.25,
                            }}
                          >
                            หัวข้อ: {ex.topic}
                          </Typography>
                        </Box>
                      </Box>

                      {/* ฝั่งขวา: Bloom Badge และ เวลา */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0, ml: 2 }}>
                        <Chip
                          size="small"
                          label={`Lv.${ex.difficultyLevel} - ${exDiff.label.split('&')[0].trim()}`}
                          sx={{
                            bgcolor: exDiff.bg,
                            color: exDiff.color,
                            border: `1px solid ${exDiff.border}`,
                            fontWeight: 700,
                            fontSize: '11px',
                            height: '24px',
                            borderRadius: '6px',
                          }}
                        />
                        <Typography sx={{ color: '#334155', fontWeight: 600, fontSize: '13px', minWidth: '55px', textAlign: 'right' }}>
                          {ex.expectedTime || 5} นาที
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  color: '#94a3b8',
                  bgcolor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px dashed #cbd5e1',
                }}
              >
                <Typography variant="body2" sx={{ fontSize: '13.5px', fontWeight: 500 }}>
                  ยังไม่มีแบบฝึกหัดที่ผูกกับชุดบทเรียนนี้
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      {/* 3. Actions สไตล์เดียวกับ ExercisePreviewDialog */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', bgcolor: '#ffffff' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: '10px',
            height: '40px',
            color: '#475569',
            borderColor: '#cbd5e1',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '13px',
            px: 2.5,
            '&:hover': {
              bgcolor: '#f8fafc',
              borderColor: '#94a3b8',
            },
          }}
        >
          ปิดหน้าต่าง
        </Button>
        {onEdit && (
          <Button
            variant="contained"
            startIcon={<Edit3 size={15} />}
            onClick={() => {
              onClose();
              onEdit(session);
            }}
            sx={{
              borderRadius: '10px',
              height: '40px',
              bgcolor: '#4f46e5',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '13px',
              px: 2.5,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#4338ca',
                boxShadow: 'none',
              },
            }}
          >
            ไปที่หน้าแก้ไข Session
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SessionPreviewDialog;
