import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Divider,
} from '@mui/material'
import { X, Eye, Clock, Lightbulb, Target, BookOpen, Edit3 } from 'lucide-react'
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty'
import type { Exercise } from '../types'

interface ExercisePreviewDialogProps {
  open: boolean
  exercise: Exercise | null
  onClose: () => void
  onEdit?: (exercise: Exercise) => void
}

export const ExercisePreviewDialog: React.FC<ExercisePreviewDialogProps> = ({
  open,
  exercise,
  onClose,
  onEdit,
}) => {
  if (!exercise) return null

  const diffMeta = DIFFICULTY_LEVELS[exercise.difficultyLevel] || {
    label: `Lv.${exercise.difficultyLevel}`,
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
  }

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
      {/* 1. ส่วนหัวของ Modal (Header Section) */}
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
            <Eye size={20} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
              พรีวิวโจทย์ #{exercise.exerciseId}: {exercise.title}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              แบบฝึกหัดการเขียนโปรแกรม Python (มุมมองอาจารย์)
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#94a3b8', '&:hover': { color: '#0f172a' } }}>
          <X size={20} />
        </IconButton>
      </Box>

      {/* 2. เนื้อหาโจทย์และข้อมูลสรุป (Content Section) */}
      <DialogContent sx={{ p: 3.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* แถบ Badges สรุปสถานะ, ระดับความยาก, หัวข้อ และเวลา */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip
            label={exercise.topic}
            size="small"
            sx={{
              bgcolor: '#f1f5f9',
              color: '#334155',
              fontWeight: 600,
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
            }}
          />
          <Chip
            label={`Lv.${exercise.difficultyLevel} - ${diffMeta.label}`}
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
            <span>{exercise.expectedTime} นาที</span>
          </Box>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              px: 1.25,
              py: 0.4,
              borderRadius: '20px',
              bgcolor: exercise.status === 'active' ? '#ecfdf5' : '#f1f5f9',
              border: `1px solid ${exercise.status === 'active' ? '#a7f3d0' : '#e2e8f0'}`,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: exercise.status === 'active' ? '#10b981' : '#94a3b8',
              }}
            />
            <Typography
              sx={{
                fontSize: '11.5px',
                fontWeight: 700,
                color: exercise.status === 'active' ? '#059669' : '#64748b',
              }}
            >
              {exercise.status === 'active' ? 'Active (เปิดใช้งาน)' : 'Inactive (ฉบับร่าง)'}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* รายละเอียดโจทย์ (Problem Description) */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: '#1e293b', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <BookOpen size={17} color="#4f46e5" /> รายละเอียดโจทย์ (Problem Description)
          </Typography>
          <Box
            sx={{
              p: 2.5,
              bgcolor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              whiteSpace: 'pre-line',
              color: '#334155',
              fontSize: '14px',
              lineHeight: 1.6,
            }}
          >
            {exercise.description}
          </Box>
        </Box>

        {/* วัตถุประสงค์การเรียนรู้ (Learning Objective) */}
        {exercise.objective && (
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: '#1e293b', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Target size={17} color="#059669" /> วัตถุประสงค์การเรียนรู้ (Objective)
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', pl: 1, lineHeight: 1.5 }}>
              {exercise.objective}
            </Typography>
          </Box>
        )}

        {/* คำใบ้และแนวทางแก้ไข (Hint) */}
        {exercise.hint ? (
          <Box sx={{ p: 2.5, bgcolor: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7' }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: '#b45309', mb: 0.75, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Lightbulb size={17} /> คำใบ้ / แนวทางการแก้โจทย์ (Hint)
            </Typography>
            <Typography variant="body2" sx={{ color: '#92400e', fontSize: '13.5px', lineHeight: 1.5 }}>
              {exercise.hint}
            </Typography>
          </Box>
        ) : (
          <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
            * ไม่มีคำใบ้สำหรับโจทย์ข้อนี้
          </Typography>
        )}
      </DialogContent>

      {/* 3. ส่วนท้าย Actions */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #f1f5f9', justifyContent: 'space-between' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: '8px',
            color: '#64748b',
            borderColor: '#cbd5e1',
            textTransform: 'none',
            fontWeight: 600,
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
            startIcon={<Edit3 size={16} />}
            onClick={() => {
              onClose()
              onEdit(exercise)
            }}
            sx={{
              borderRadius: '8px',
              bgcolor: '#4f46e5',
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#4338ca',
                boxShadow: 'none',
              },
            }}
          >
            ไปที่หน้าแก้ไขโจทย์
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ExercisePreviewDialog
