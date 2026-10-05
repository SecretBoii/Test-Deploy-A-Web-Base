import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
} from '@mui/material'
import { X, Eye, BookOpen, FileText, Edit3 } from 'lucide-react'
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

  // สไตล์มาตรฐานสำหรับกล่องแสดงค่าแบบ Read-only สไตล์เดียวกับ Input Box ใน ExerciseDialog
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
  }

  // สไตล์ข้อความหัวข้อกำกับด้านบน (Top Label)
  const labelSx = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#334155',
    mb: 0.75,
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
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* 1. ส่วนหัวของหน้าต่าง (Modal Header) */}
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
            <Eye size={20} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '18px', lineHeight: 1.2 }}>
              พรีวิวโจทย์ #{exercise.exerciseId}: {exercise.title}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12.5px', mt: 0.25, display: 'block' }}>
              แสดงรายละเอียดและการตั้งค่าของโจทย์ในมุมมองอาจารย์
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

      {/* 2. เนื้อหาพรีวิวแบ่งตามหมวดหมู่ (ถอดแบบโครงสร้างจาก ExerciseDialog) */}
      <DialogContent sx={{ p: 3.5, bgcolor: '#ffffff', display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* หมวดที่ 1: ข้อมูลทั่วไปและการตั้งค่าโจทย์ */}
        <Box
          sx={{
            p: 2.5,
            bgcolor: '#f8fafc',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
          }}
        >
          {/* หัวข้อหมวดที่ 1 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.25 }}>
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
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
              ข้อมูลทั่วไปและการตั้งค่าโจทย์
            </Typography>
          </Box>

          <Grid container spacing={2.25}>
            {/* ชื่อโจทย์ */}
            <Grid size={{ xs: 12, sm: 8 }}>
              <Box>
                <Typography sx={labelSx}>ชื่อโจทย์</Typography>
                <Box sx={readonlyBoxSx}>
                  {exercise.title}
                </Box>
              </Box>
            </Grid>

            {/* หัวข้อบทเรียน */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box>
                <Typography sx={labelSx}>หัวข้อบทเรียน (Topic)</Typography>
                <Box sx={readonlyBoxSx}>
                  {exercise.topic}
                </Box>
              </Box>
            </Grid>

            {/* วัตถุประสงค์การเรียนรู้ */}
            <Grid size={12}>
              <Box>
                <Typography sx={labelSx}>วัตถุประสงค์การเรียนรู้ (Objective)</Typography>
                <Box sx={readonlyBoxSx}>
                  {exercise.objective || '-'}
                </Box>
              </Box>
            </Grid>

            {/* ระดับความยาก Bloom */}
            <Grid size={{ xs: 12, sm: 5.4 }}>
              <Box>
                <Typography sx={labelSx}>ระดับความยาก (Bloom's Taxonomy)</Typography>
                <Box sx={readonlyBoxSx}>
                  {`Lv.${exercise.difficultyLevel} - ${diffMeta.label}`}
                </Box>
              </Box>
            </Grid>

            {/* เวลาที่แนะนำ */}
            <Grid size={{ xs: 12, sm: 3.2 }}>
              <Box>
                <Typography sx={labelSx}>เวลาที่แนะนำ</Typography>
                <Box sx={{ ...readonlyBoxSx, justifyContent: 'space-between' }}>
                  <span>{exercise.expectedTime}</span>
                  <Typography component="span" sx={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
                    นาที
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* สถานะการเผยแพร่ */}
            <Grid size={{ xs: 12, sm: 3.4 }}>
              <Box>
                <Typography sx={labelSx}>สถานะการเผยแพร่</Typography>
                <Box sx={readonlyBoxSx}>
                  {exercise.status === 'active' ? 'Active - เปิดใช้งานแล้ว' : 'Inactive - ฉบับร่าง'}
                </Box>
              </Box>
            </Grid>

            {/* บทเรียนที่นำโจทย์นี้ไปใช้งาน (Assigned Sessions) */}
            <Grid size={12}>
              <Box>
                <Typography sx={labelSx}>บทเรียนที่นำไปใช้ (Assigned Sessions)</Typography>
                {/* แสดงรายชื่อบทเรียนแบบข้อความธรรมดาในกล่องสไตล์เดียวกับฟิลด์อื่นๆ โดยไม่ใช้ชิปหรือกรอบไอคอนซ้อน */}
                <Box
                  sx={{
                    ...readonlyBoxSx,
                    minHeight: '42px',
                    height: 'auto',
                    lineHeight: 1.6,
                  }}
                >
                  {exercise.sessions && exercise.sessions.length > 0 ? (
                    exercise.sessions.map((s) => `Session #${s.sessionId}: ${s.sessionName}`).join(', ')
                  ) : (
                    <Typography sx={{ color: '#94a3b8', fontSize: '13.5px', fontStyle: 'italic' }}>
                      ยังไม่ได้ถูกนำไปใช้ในบทเรียนใด
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* หมวดที่ 2: เนื้อหาโจทย์และคำใบ้ */}
        <Box
          sx={{
            p: 2.5,
            bgcolor: '#f8fafc',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.25,
          }}
        >
          {/* หัวข้อหมวดที่ 2 */}
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
              <FileText size={16} />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
              เนื้อหาโจทย์และคำใบ้
            </Typography>
          </Box>

          {/* คำอธิบายโจทย์ */}
          <Box>
            <Typography sx={labelSx}>คำอธิบายโจทย์ (Problem Description)</Typography>
            <Box
              sx={{
                borderRadius: '10px',
                bgcolor: '#ffffff',
                border: '1px solid #cbd5e1',
                p: 2,
                minHeight: '84px',
                fontSize: '13.5px',
                color: '#0f172a',
                lineHeight: 1.65,
                whiteSpace: 'pre-line',
              }}
            >
              {exercise.description}
            </Box>
          </Box>

          {/* คำใบ้ / แนวทางการแก้โจทย์ */}
          <Box>
            <Typography sx={labelSx}>คำใบ้ / แนวทางการแก้โจทย์ (Hint)</Typography>
            <Box
              sx={{
                borderRadius: '10px',
                bgcolor: '#ffffff',
                border: '1px solid #cbd5e1',
                px: 2,
                py: 1.3,
                minHeight: '44px',
                fontSize: '13.5px',
                color: exercise.hint ? '#0f172a' : '#94a3b8',
                fontStyle: exercise.hint ? 'normal' : 'italic',
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {exercise.hint || 'ไม่มีคำใบ้สำหรับโจทย์ข้อนี้'}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      {/* 3. ส่วนท้าย Actions */}
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
              onClose()
              onEdit(exercise)
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
            ไปที่หน้าแก้ไขโจทย์
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ExercisePreviewDialog
