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
} from '@mui/material'
import { X, Save, Pencil, Plus } from 'lucide-react'
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty'
import { ConfirmDialog } from './ConfirmDialog'

interface ExerciseDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: any) => void
  exerciseData?: any
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'active - เผยแพร่แล้ว' },
  { value: 'inactive', label: 'inactive - แบบร่าง' },
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
  const [confirmOpen, setConfirmOpen] = useState(false)

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
    setConfirmOpen(false)
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
      setConfirmOpen(true)
    }
  }

  const handleConfirmSave = () => {
    setConfirmOpen(false)
    onSave(form)
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            },
          }
        }}
      >
        {/* Header aligned with UI mockup */}
        <Box
          sx={{
            px: 3,
            py: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f1f5f9',
            color: '#0f172a',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {exerciseData ? (
              <Pencil size={20} color="#f97316" />
            ) : (
              <Plus size={20} color="#10b981" />
            )}
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {exerciseData ? 'แก้ไขโจทย์' : 'สร้างโจทย์ใหม่'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: '#94a3b8', '&:hover': { color: '#64748b' } }}>
            <X size={20} />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 4, bgcolor: '#ffffff' }}>
          <Grid container spacing={3}>
            
            {/* TITLE */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 0.75 }}>
                  TITLE *
                </Typography>
                <TextField
                  required
                  fullWidth
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  placeholder="กรอกชื่อโจทย์..."
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: '8px',
                        bgcolor: '#ffffff',
                        fontSize: '14px',
                      }
                    }
                  }}
                />
              </Box>
            </Grid>

            {/* TOPIC */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 0.75 }}>
                  TOPIC *
                </Typography>
                <TextField
                  required
                  fullWidth
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  error={!!errors.topic}
                  helperText={errors.topic}
                  placeholder="เช่น Variables, Syntax"
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: '8px',
                        bgcolor: '#ffffff',
                        fontSize: '14px',
                      }
                    }
                  }}
                />
              </Box>
            </Grid>

            {/* OBJECTIVE */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 0.75 }}>
                  OBJECTIVE
                </Typography>
                <TextField
                  fullWidth
                  name="objective"
                  value={form.objective}
                  onChange={handleChange}
                  placeholder="เช่น Variables, Print"
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: '8px',
                        bgcolor: '#ffffff',
                        fontSize: '14px',
                      }
                    }
                  }}
                />
              </Box>
            </Grid>

            {/* EXPECTED TIME */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 0.75 }}>
                  EXPECTED_TIME (นาที)
                </Typography>
                <TextField
                  required
                  fullWidth
                  type="number"
                  name="expectedTime"
                  value={form.expectedTime}
                  onChange={handleChange}
                  error={!!errors.expectedTime}
                  helperText={errors.expectedTime}
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: '8px',
                        bgcolor: '#ffffff',
                        fontSize: '14px',
                      }
                    }
                  }}
                />
              </Box>
            </Grid>

            {/* DIFFICULTY */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 0.75 }}>
                  DIFFICULTY (BLOOM'S TAXONOMY)
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
                        borderRadius: '8px',
                        bgcolor: '#ffffff',
                        fontSize: '14px',
                      }
                    }
                  }}
                >
                  {Object.entries(DIFFICULTY_LEVELS).map(([key, meta]) => (
                    <MenuItem key={key} value={Number(key)}>
                      {`Lv.${key} - ${meta.label}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>

            {/* STATUS */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 0.75 }}>
                  STATUS
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
                        borderRadius: '8px',
                        bgcolor: '#ffffff',
                        fontSize: '14px',
                      }
                    }
                  }}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>

            {/* DESCRIPTION */}
            <Grid size={12}>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 0.75 }}>
                  DESCRIPTION * (พิมพ์โจทย์)
                </Typography>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={5}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  placeholder="ประกาศตัวแปร x=10 และ y=Python แล้วแสดงผลลัพธ์..."
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: '8px',
                        bgcolor: '#ffffff',
                        fontFamily: 'inherit',
                        fontSize: '14px',
                      },
                    }
                  }}
                />
              </Box>
            </Grid>

            {/* HINT */}
            <Grid size={12}>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 0.75 }}>
                  HINT (ไม่บังคับ)
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  name="hint"
                  value={form.hint}
                  onChange={handleChange}
                  placeholder="พิมพ์คำใบ้ เช่น ใช้ print() และ = ..."
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: '8px',
                        bgcolor: '#ffffff',
                        fontSize: '14px',
                      }
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 4, py: 2.5, borderTop: '1px solid #f1f5f9', gap: 1.5 }}>
          <Button
            onClick={handleSubmitClick}
            variant="contained"
            startIcon={<Save size={16} />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: '#10b981', // mockup green
              color: '#ffffff',
              px: 3,
              py: 1,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#059669',
                boxShadow: 'none',
              },
              transition: 'all 0.15s ease',
            }}
          >
            บันทึก
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 700,
              borderColor: '#cbd5e1',
              color: '#475569',
              px: 3,
              py: 1,
              '&:hover': {
                bgcolor: '#f8fafc',
                borderColor: '#cbd5e1',
              },
            }}
          >
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reusable Confirm Save Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title={exerciseData ? 'ยืนยันการแก้ไขโจทย์?' : 'ยืนยันการสร้างโจทย์ใหม่?'}
        message={
          exerciseData
            ? 'คุณแน่ใจหรือไม่ว่าต้องการบันทึกการแก้ไขข้อมูลโจทย์ข้อนี้?'
            : 'คุณแน่ใจหรือไม่ว่าต้องการสร้างโจทย์ใหม่นี้ลงในคลัง?'
        }
        confirmColor="primary"
      />
    </>
  )
}

export default ExerciseDialog;
