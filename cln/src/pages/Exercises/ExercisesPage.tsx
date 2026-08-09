import { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Card,
  Pagination,
} from '@mui/material'
import { Search, FileText } from 'lucide-react'
import { MainLayout } from '../../components/Layout/MainLayout'
import { apiClient } from '../../api/client'
import { ExerciseDialog } from './components/ExerciseDialog'
import { ExerciseTable } from './components/ExerciseTable'
import { ConfirmDialog } from './components/ConfirmDialog'

interface Exercise {
  exerciseId: number
  title: string
  description: string
  topic: string
  objective: string
  difficultyLevel: number
  expectedTime: number
  status: string
  hint: string
}

export function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  
  // Sorting state
  const [sortField, setSortField] = useState<'id' | 'bloom'>('id')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Pagination state
  const [page, setPage] = useState<number>(1)
  const rowsPerPage = 10

  // Confirm Delete Dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [exerciseToDelete, setExerciseToDelete] = useState<number | null>(null)

  useEffect(() => {
    fetchExercises()
  }, [])

  useEffect(() => {
    setPage(1) // Reset page to 1 when search query changes
    if (searchQuery.trim() === '') {
      setFilteredExercises(exercises)
    } else {
      const q = searchQuery.toLowerCase()
      setFilteredExercises(
        exercises.filter(
          (ex) =>
            ex.title.toLowerCase().includes(q) ||
            ex.topic.toLowerCase().includes(q) ||
            ex.description.toLowerCase().includes(q) ||
            String(ex.exerciseId).includes(q)
        )
      )
    }
  }, [searchQuery, exercises])

  const fetchExercises = async () => {
    try {
      const res = await apiClient.get('/exercises/manage/all')
      setExercises(res.data)
      setFilteredExercises(res.data)
    } catch (err) {
      console.error('ไม่สามารถดึงข้อมูลโจทย์ได้:', err)
    }
  }

  const handleOpenCreate = () => {
    setSelectedExercise(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setDialogOpen(true)
  }

  const handleSave = async (formData: any) => {
    try {
      if (selectedExercise) {
        // แก้ไขโจทย์เดิม
        await apiClient.put(`/exercises/${selectedExercise.exerciseId}`, formData)
      } else {
        // สร้างโจทย์ใหม่
        await apiClient.post('/exercises', formData)
      }
      setDialogOpen(false)
      fetchExercises()
    } catch (err) {
      console.error('ไม่สามารถบันทึกข้อมูลโจทย์ได้:', err)
    }
  }

  const handleOpenDeleteConfirm = (id: number) => {
    setExerciseToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (exerciseToDelete !== null) {
      try {
        await apiClient.delete(`/exercises/${exerciseToDelete}`)
        setDeleteConfirmOpen(false)
        setExerciseToDelete(null)
        fetchExercises()
      } catch (err) {
        console.error('ไม่สามารถลบโจทย์ได้:', err)
      }
    }
  }

  // Sort exercises function
  const handleSort = (field: 'id' | 'bloom') => {
    const isAsc = sortField === field && sortOrder === 'asc'
    setSortOrder(isAsc ? 'desc' : 'asc')
    setSortField(field)
    setPage(1) // Reset page to 1 on sort change
  }

  const sortedExercises = [...filteredExercises].sort((a, b) => {
    if (sortField === 'id') {
      return sortOrder === 'asc' ? a.exerciseId - b.exerciseId : b.exerciseId - a.exerciseId
    } else if (sortField === 'bloom') {
      return sortOrder === 'asc'
        ? a.difficultyLevel - b.difficultyLevel
        : b.difficultyLevel - a.difficultyLevel
    }
    return 0
  })

  // Pagination calculation
  const totalPages = Math.ceil(sortedExercises.length / rowsPerPage)
  const paginatedExercises = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    return sortedExercises.slice(start, start + rowsPerPage)
  }, [sortedExercises, page])

  return (
    <MainLayout activeItem="Exercises">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Table Container wrapped in Card to match Dashboard style */}
        <Card sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
          
          {/* Header Action Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FileText size={24} color="#f97316" />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                โจทย์ทั้งหมด ({filteredExercises.length} ข้อ)
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleOpenCreate}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: '#10b981', // mockup bright green
                color: '#ffffff',
                px: 2.5,
                py: 1,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#059669',
                  boxShadow: 'none',
                },
                transition: 'all 0.15s ease',
              }}
            >
              + เพิ่มโจทย์
            </Button>
          </Box>

          {/* Search Field */}
          <TextField
            fullWidth
            placeholder="ค้นหาโจทย์ตามชื่อเรื่อง, หัวข้อ หรือรายละเอียดโจทย์..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 3 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: '#94a3b8', mr: 1 }}>
                    <Search size={20} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  height: '46px',
                  '& fieldset': { border: 'none' },
                },
              }
            }}
          />

          {/* Table Component (Passing paginated subset) */}
          <ExerciseTable
            exercises={paginatedExercises}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDeleteConfirm}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, borderTop: '1px solid #e2e8f0', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="medium"
              />
            </Box>
          )}
        </Card>
      </Box>

      {/* Main dialog for Creation & Edit */}
      <ExerciseDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        exerciseData={selectedExercise}
      />

      {/* Beautiful Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="ยืนยันการลบโจทย์?"
        message={`คุณแน่ใจหรือไม่ว่าต้องการลบโจทย์รหัส #${exerciseToDelete} นี้ออกจากคลัง? การกระทำนี้ไม่สามารถย้อนกลับได้`}
        confirmColor="error"
      />
    </MainLayout>
  )
}

export default ExercisesPage;
