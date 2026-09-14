import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import { X, Clock, Layers, BookOpen, Target } from 'lucide-react';
import { DIFFICULTY_LEVELS } from '../../../../constants/difficulty';
import type { TeacherSessionItem } from '../../types';

interface SessionPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  session: TeacherSessionItem | null;
}

export const SessionPreviewDialog: React.FC<SessionPreviewDialogProps> = ({
  open,
  onClose,
  session,
}) => {
  if (!session) return null;

  const diffMeta = DIFFICULTY_LEVELS[session.targetLevel] || {
    label: `Level ${session.targetLevel}`,
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* 1. Header Modal สไตล์เดียวกับ ExercisePreviewDialog */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              bgcolor: '#eef2ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4f46e5',
            }}
          >
            <Layers size={20} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
              พรีวิวชุดบทเรียน #{session.sessionId}: {session.sessionName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              รายละเอียด Session และแบบฝึกหัดที่ผูกไว้ (มุมมองอาจารย์)
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#94a3b8', '&:hover': { color: '#0f172a' } }}>
          <X size={20} />
        </IconButton>
      </Box>

      {/* 2. เนื้อหาและข้อมูลสรุป */}
      <DialogContent sx={{ p: 3.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* แถบ Badges สรุปเป้าหมาย, เวลา, จำนวนข้อ และสถานะ */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip
            label={`Target: Lv.${session.targetLevel} - ${diffMeta.label}`}
            size="small"
            sx={{
              bgcolor: diffMeta.bg,
              color: diffMeta.color,
              border: `1px solid ${diffMeta.border}`,
              fontWeight: 700,
              borderRadius: '6px',
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: '#64748b', fontSize: '13px' }}>
            <Clock size={15} />
            <span>{session.duration} นาที</span>
          </Box>
          <Chip
            label={`${session.exercises?.length || session.exerciseCount || 0} แบบฝึกหัด`}
            size="small"
            sx={{
              bgcolor: '#f1f5f9',
              color: '#334155',
              fontWeight: 600,
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
            }}
          />
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              px: 1.25,
              py: 0.4,
              borderRadius: '20px',
              bgcolor: session.status === 'active' ? '#ecfdf5' : '#f1f5f9',
              border: `1px solid ${session.status === 'active' ? '#a7f3d0' : '#e2e8f0'}`,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: session.status === 'active' ? '#10b981' : '#94a3b8',
              }}
            />
            <Typography
              sx={{
                fontSize: '11.5px',
                fontWeight: 700,
                color: session.status === 'active' ? '#059669' : '#64748b',
              }}
            >
              {session.status === 'active' ? 'Active (เปิดใช้งาน)' : 'Inactive (ปิดใช้งาน)'}
            </Typography>
          </Box>
        </Box>

        {/* จุดประสงค์การเรียนรู้ (Session Objective) */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: '#1e293b', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Target size={17} color="#4f46e5" /> จุดประสงค์การเรียนรู้ (Learning Objective)
          </Typography>
          <Box
            sx={{
              p: 2.5,
              bgcolor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              color: '#334155',
              fontSize: '14px',
              lineHeight: 1.6,
            }}
          >
            {session.sessionObjective || '-'}
          </Box>
        </Box>

        <Divider />

        {/* รายการแบบฝึกหัดที่บรรจุใน Session */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: '#1e293b', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <BookOpen size={17} color="#4f46e5" /> แบบฝึกหัดใน Session ({session.exercises?.length || 0} ข้อ)
          </Typography>

          {session.exercises && session.exercises.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 260, overflowY: 'auto' }}>
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
                      p: 1.5,
                      px: 2,
                      bgcolor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.12s ease',
                      '&:hover': {
                        borderColor: '#cbd5e1',
                        bgcolor: '#f8fafc',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '6px',
                          bgcolor: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '12px',
                          color: '#475569',
                          flexShrink: 0,
                        }}
                      >
                        {idx + 1}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: '#0f172a',
                            fontSize: '13.5px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          #{ex.exerciseId} {ex.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12px' }}>
                          หัวข้อ: {ex.topic}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, ml: 2 }}>
                      <Chip
                        size="small"
                        label={`Lv.${ex.difficultyLevel}`}
                        sx={{
                          bgcolor: exDiff.bg,
                          color: exDiff.color,
                          border: `1px solid ${exDiff.border}`,
                          fontWeight: 700,
                          fontSize: '11px',
                          height: '22px',
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b', fontSize: '12px' }}>
                        <Clock size={13} />
                        <span>{ex.expectedTime || 5} นาที</span>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: 'center',
                color: '#94a3b8',
                bgcolor: '#f8fafc',
                borderRadius: '10px',
                border: '1px dashed #cbd5e1',
              }}
            >
              <Typography variant="body2" sx={{ fontSize: '13px' }}>
                ยังไม่มีแบบฝึกหัดที่ผูกกับ Session นี้
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* 3. Actions */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#cbd5e1',
            color: '#475569',
            '&:hover': {
              bgcolor: '#ffffff',
              borderColor: '#94a3b8',
            },
          }}
        >
          ปิดหน้าต่าง
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionPreviewDialog;
