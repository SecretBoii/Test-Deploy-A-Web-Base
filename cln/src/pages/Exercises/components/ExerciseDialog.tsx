import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { X, Save, Pencil, Plus, BookOpen, FileText } from 'lucide-react'
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty'

interface ExerciseDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: any) => void
  exerciseData?: any
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active - เปิดใช้งานแล้ว' },
  { value: 'inactive', label: 'Inactive - ฉบับร่าง' },
]

export const ExerciseDialog: React.FC<ExerciseDialogProps> = ({
  open,
  onClose,
  onSave,
  exerciseData,
}) => {
  const [form, setForm] = useState({
    title: '',
    topic: '',
    objective: '',
    expectedTime: 5,
    difficultyLevel: 1,
    status: 'active',
    description: '',
    hint: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (exerciseData) {
      setForm({
        title: exerciseData.title || '',
        topic: exerciseData.topic || '',
        objective: exerciseData.objective || '',
        expectedTime: exerciseData.expectedTime || 5,
        difficultyLevel: exerciseData.difficultyLevel || 1,
        status: exerciseData.status || 'active',
        description: exerciseData.description || '',
        hint: exerciseData.hint || '',
      })
    } else {
      setForm({
        title: '',
        topic: '',
        objective: '',
        expectedTime: 5,
        difficultyLevel: 1,
        status: 'active',
        description: '',
        hint: '',
      })
    }
    setErrors({})
  }, [exerciseData, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'difficultyLevel' || name === 'expectedTime' ? Number(value) : value,
    }))

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.title.trim()) newErrors.title = 'กรุณากรอกชื่อโจทย์'
    if (!form.topic.trim()) newErrors.topic = 'กรุณากรอกหัวข้อเรื่อง'
    if (!form.description.trim()) newErrors.description = 'กรุณากรอกคำอธิบายโจทย์'
    if (form.expectedTime <= 0) newErrors.expectedTime = 'เวลาควรมากกว่า 0 นาที'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitClick = () => {
    if (validate()) {
      onSave(form)
    }
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
              borderRadius: '20px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
            },
          },
        }}
      >
        {/* 1. ส่วนหัว Header ของหน้าต่าง */}
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
              {exerciseData ? <Pencil size={20} /> : <Plus size={22} />}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '18px', lineHeight: 1.2 }}>
                {exerciseData ? `แก้ไขโจทย์ #${exerciseData.exerciseId}` : 'สร้างโจทย์แบบฝึกหัดใหม่'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12.5px', mt: 0.25, display: 'block' }}>
                {exerciseData
                  ? 'ปรับปรุงข้อมูล คำอธิบาย และการตั้งค่าของโจทย์ในระบบ'
                  : 'กรอกข้อมูลรายละเอียดและเนื้อหาโจทย์สำหรับให้นักเรียนฝึกเขียนโปรแกรม'}
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

        {/* 2. เนื้อหาฟอร์ม (Modern Clean Form แบ่งการ์ดซอฟต์ๆ #f8fafc พร้อม Top Labels) */}
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
                    ชื่อโจทย์ <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                  </Typography>
                  <TextField
                    fullWidth
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    error={!!errors.title}
                    helperText={errors.title}
                    placeholder="เช่น ประกาศตัวแปรและพิมพ์ผลลัพธ์..."
                    slotProps={{
                      input: {
                        sx: {
                          borderRadius: '10px',
                          bgcolor: '#ffffff',
                          '& fieldset': { borderColor: '#cbd5e1' },
                          '&:hover fieldset': { borderColor: '#94a3b8' },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4f46e5',
                            borderWidth: '1.5px',
                            boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.12)',
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>

              {/* หัวข้อบทเรียน */}
              <Grid size={{ xs: 12, sm: 4 }}>
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
                    หัวข้อบทเรียน (Topic) <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                  </Typography>
                  <TextField
                    fullWidth
                    name="topic"
                    value={form.topic}
                    onChange={handleChange}
                    error={!!errors.topic}
                    helperText={errors.topic}
                    placeholder="เช่น Variables, Loops"
                    slotProps={{
                      input: {
                        sx: {
                          borderRadius: '10px',
                          bgcolor: '#ffffff',
                          '& fieldset': { borderColor: '#cbd5e1' },
                          '&:hover fieldset': { borderColor: '#94a3b8' },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4f46e5',
                            borderWidth: '1.5px',
                            boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.12)',
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>

              {/* วัตถุประสงค์การเรียนรู้ */}
              <Grid size={12}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155', mb: 0.75 }}>
                    วัตถุประสงค์การเรียนรู้ (Objective)
                  </Typography>
                  <TextField
                    fullWidth
                    name="objective"
                    value={form.objective}
                    onChange={handleChange}
                    placeholder="เช่น เพื่อให้ผู้เรียนเข้าใจการกำหนดค่าตัวแปรและแสดงผลออกหน้าจอ"
                    slotProps={{
                      input: {
                        sx: {
                          borderRadius: '10px',
                          bgcolor: '#ffffff',
                          '& fieldset': { borderColor: '#cbd5e1' },
                          '&:hover fieldset': { borderColor: '#94a3b8' },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4f46e5',
                            borderWidth: '1.5px',
                            boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.12)',
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>

              {/* ระดับความยาก Bloom */}
              <Grid size={{ xs: 12, sm: 5 }}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155', mb: 0.75 }}>
                    ระดับความยาก (Bloom's Taxonomy)
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    name="difficultyLevel"
                    value={form.difficultyLevel}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        sx: {
                          borderRadius: '10px',
                          bgcolor: '#ffffff',
                          '& fieldset': { borderColor: '#cbd5e1' },
                          '&:hover fieldset': { borderColor: '#94a3b8' },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4f46e5',
                            borderWidth: '1.5px',
                            boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.12)',
                          },
                        },
                      },
                    }}
                  >
                    {Object.entries(DIFFICULTY_LEVELS).map(([key, meta]) => (
                      <MenuItem key={key} value={Number(key)} sx={{ fontSize: '13.5px', py: 1 }}>
                        {`Lv.${key} - ${meta.label}`}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Grid>

              {/* เวลาที่แนะนำ */}
              <Grid size={{ xs: 12, sm: 3.5 }}>
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
                    เวลาที่แนะนำ <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    name="expectedTime"
                    value={form.expectedTime}
                    onChange={handleChange}
                    error={!!errors.expectedTime}
                    helperText={errors.expectedTime}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end" sx={{ color: '#64748b', '& p': { fontSize: '13px' } }}>
                            นาที
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: '10px',
                          bgcolor: '#ffffff',
                          '& fieldset': { borderColor: '#cbd5e1' },
                          '&:hover fieldset': { borderColor: '#94a3b8' },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4f46e5',
                            borderWidth: '1.5px',
                            boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.12)',
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>

              {/* สถานะการเผยแพร่ */}
              <Grid size={{ xs: 12, sm: 3.5 }}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155', mb: 0.75 }}>
                    สถานะการเผยแพร่
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
                          '& fieldset': { borderColor: '#cbd5e1' },
                          '&:hover fieldset': { borderColor: '#94a3b8' },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4f46e5',
                            borderWidth: '1.5px',
                            boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.12)',
                          },
                        },
                      },
                    }}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value} sx={{ fontSize: '13.5px', py: 1 }}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
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
                คำอธิบายโจทย์ (Problem Description) <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                value={form.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                placeholder="พิมพ์คำอธิบายโจทย์ รายละเอียดเงื่อนไข และสิ่งที่ต้องการให้ผู้เรียนเขียนโค้ดแก้ปัญหา..."
                slotProps={{
                  input: {
                    sx: {
                      borderRadius: '10px',
                      bgcolor: '#ffffff',
                      lineHeight: 1.6,
                      fontSize: '14px',
                      '& fieldset': { borderColor: '#cbd5e1' },
                      '&:hover fieldset': { borderColor: '#94a3b8' },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4f46e5',
                        borderWidth: '1.5px',
                        boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.12)',
                      },
                    },
                  },
                }}
              />
            </Box>

            {/* คำใบ้สำหรับผู้เรียน */}
            <Box>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155', mb: 0.75 }}>
                คำใบ้สำหรับผู้เรียน (Hint - ไม่บังคับ)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="hint"
                value={form.hint}
                onChange={handleChange}
                placeholder="พิมพ์คำใบ้ หรือแนวทางสำหรับช่วยเหลือนักเรียนเมื่อติดปัญหา..."
                slotProps={{
                  input: {
                    sx: {
                      borderRadius: '10px',
                      bgcolor: '#ffffff',
                      fontSize: '13.5px',
                      '& fieldset': { borderColor: '#cbd5e1' },
                      '&:hover fieldset': { borderColor: '#94a3b8' },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4f46e5',
                        borderWidth: '1.5px',
                        boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.12)',
                      },
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        {/* 3. ส่วนท้าย Actions */}
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
            onClick={handleSubmitClick}
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
            {exerciseData ? 'บันทึกการแก้ไข' : 'บันทึกโจทย์'}
          </Button>
        </DialogActions>
      </Dialog>
  )
}

export default ExerciseDialog
