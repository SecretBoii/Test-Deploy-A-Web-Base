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
import type { Exercise, ExerciseFormData } from '../types'

interface ExerciseDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: ExerciseFormData) => void
  exerciseData?: Exercise | null
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
  const [form, setForm] = useState<ExerciseFormData>({
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

  // สไตล์มาตรฐานสำหรับช่องกรอกข้อมูลเดี่ยว ให้มีความสูง 42px กระชับแบบ Modern SaaS สอดคล้องกับหน้าพรีวิว (รูปที่ 3)
  const inputBaseSx = {
    borderRadius: '10px',
    bgcolor: '#ffffff',
    height: '42px',
    fontSize: '13.5px',
    color: '#0f172a',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#4f46e5',
      borderWidth: '1.5px',
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.12)',
    },
    '& .MuiInputBase-input': {
      py: 0,
      height: '42px',
      boxSizing: 'border-box',
      fontSize: '13.5px',
      color: '#0f172a',
    },
  }

  // สไตล์สำหรับ Dropdown (Select) ให้ข้อความและปุ่มลูกศรจัดกึ่งกลางพอดีที่ความสูง 42px เท่ากับหน้าพรีวิว
  const selectBaseSx = {
    borderRadius: '10px',
    bgcolor: '#ffffff',
    height: '42px',
    fontSize: '13.5px',
    color: '#0f172a',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#4f46e5',
      borderWidth: '1.5px',
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.12)',
    },
    '& .MuiSelect-select': {
      py: 0,
      height: '42px',
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
      fontSize: '13.5px',
      color: '#0f172a',
    },
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
              bgcolor: '#ffffff',
            },
          },
        }}
      >
        {/* 1. ส่วนหัว Header ของหน้าต่าง (ปรับขนาด padding และ icon ให้เท่ากับ ExercisePreviewDialog) */}
        <Box
          sx={{
            px: 3,
            py: 2.25,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e2e8f0',
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
              }}
            >
              {exerciseData ? <Pencil size={20} /> : <Plus size={20} />}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '17px', lineHeight: 1.2 }}>
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
            size="small"
            sx={{
              color: '#94a3b8',
              borderRadius: '8px',
              '&:hover': { color: '#0f172a', bgcolor: '#f1f5f9' },
              transition: 'all 0.15s ease',
            }}
          >
            <X size={18} />
          </IconButton>
        </Box>

        {/* 2. เนื้อหาฟอร์ม (ปรับระยะ Padding เป็น 3.5 ให้เท่ากับ ExercisePreviewDialog รูปที่ 3) */}
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
                    size="small"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    error={!!errors.title}
                    helperText={errors.title}
                    placeholder="เช่น ประกาศตัวแปรและพิมพ์ผลลัพธ์..."
                    slotProps={{
                      input: {
                        sx: inputBaseSx,
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
                    size="small"
                    name="topic"
                    value={form.topic}
                    onChange={handleChange}
                    error={!!errors.topic}
                    helperText={errors.topic}
                    placeholder="เช่น Variables, Loops"
                    slotProps={{
                      input: {
                        sx: inputBaseSx,
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
                    size="small"
                    name="objective"
                    value={form.objective}
                    onChange={handleChange}
                    placeholder="เช่น เพื่อให้ผู้เรียนเข้าใจการกำหนดค่าตัวแปรและแสดงผลออกหน้าจอ"
                    slotProps={{
                      input: {
                        sx: inputBaseSx,
                      },
                    }}
                  />
                </Box>
              </Grid>

              {/* ระดับความยาก Bloom */}
              <Grid size={{ xs: 12, sm: 5.4 }}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155', mb: 0.75 }}>
                    ระดับความยาก (Bloom's Taxonomy)
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    name="difficultyLevel"
                    value={form.difficultyLevel}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        sx: selectBaseSx,
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
              <Grid size={{ xs: 12, sm: 3.2 }}>
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
                    size="small"
                    type="number"
                    name="expectedTime"
                    value={form.expectedTime}
                    onChange={handleChange}
                    error={!!errors.expectedTime}
                    helperText={errors.expectedTime}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end" sx={{ color: '#64748b', mr: 0.5, '& p': { fontSize: '13px' } }}>
                            นาที
                          </InputAdornment>
                        ),
                        sx: inputBaseSx,
                      },
                    }}
                  />
                </Box>
              </Grid>

              {/* สถานะการเผยแพร่ */}
              <Grid size={{ xs: 12, sm: 3.4 }}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155', mb: 0.75 }}>
                    สถานะการเผยแพร่
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        sx: selectBaseSx,
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
                rows={3}
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
                      fontSize: '13.5px',
                      p: 1.5,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
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
                      lineHeight: 1.6,
                      p: 1.5,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
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

        {/* 3. ส่วนท้าย Actions (ปรับความสูงปุ่ม 40px, padding px: 3, py: 2 ให้เท่ากับ ExercisePreviewDialog) */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            gap: 1.5,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: '10px',
              height: '40px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '13px',
              borderColor: '#cbd5e1',
              color: '#475569',
              px: 2.5,
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
              height: '40px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '13px',
              bgcolor: '#4f46e5',
              color: '#ffffff',
              px: 2.5,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#4338ca',
                boxShadow: 'none',
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
