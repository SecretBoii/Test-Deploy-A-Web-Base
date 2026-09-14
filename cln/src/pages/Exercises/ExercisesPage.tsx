import { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Card,
  Pagination,
} from '@mui/material'
import { MainLayout } from '../../components/Layout/MainLayout'
import { apiClient } from '../../api/client'
import { ExerciseDialog } from './components/ExerciseDialog'
import { ExerciseTable } from './components/ExerciseTable'
import { ConfirmDialog } from './components/ConfirmDialog'
import { ExerciseToolbar } from './components/ExerciseToolbar'
import { ExercisePreviewDialog } from './components/ExercisePreviewDialog'
import type { Exercise, SortField, SortOrder } from './types'

export function ExercisesPage() {
  const [loading, setLoading] = useState(true)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null)
  
  // Filter states
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('id')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // Pagination state
  const [page, setPage] = useState<number>(1)
  const rowsPerPage = 10

  // Confirm Delete Dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [exerciseToDelete, setExerciseToDelete] = useState<number | null>(null)


  useEffect(() => {
    fetchExercises()
  }, [])

  // Filter & Sort Pipeline (Clean single-pass useMemo, eliminates derived state & double re-renders)
  const sortedExercises = useMemo(() => {
    let result = exercises

    // 1. กรองคำค้นหา (ชื่อเรื่อง, หัวข้อ, คำอธิบาย หรือ ID)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (ex) =>
          ex.title.toLowerCase().includes(q) ||
          ex.topic.toLowerCase().includes(q) ||
          ex.description.toLowerCase().includes(q) ||
          String(ex.exerciseId).includes(q)
      )
    }

    // 2. กรองตามระดับความยาก (Bloom's Taxonomy)
    if (selectedLevel !== 'all') {
      const lvl = Number(selectedLevel)
      result = result.filter((ex) => ex.difficultyLevel === lvl)
    }

    // 3. กรองตามสถานะ (Active / Inactive)
    if (selectedStatus !== 'all') {
      result = result.filter((ex) => ex.status === selectedStatus)
    }

    // 4. จัดเรียงลำดับ (Sort)
    return [...result].sort((a, b) => {
      if (sortField === 'id') {
        return sortOrder === 'asc' ? a.exerciseId - b.exerciseId : b.exerciseId - a.exerciseId
      } else if (sortField === 'bloom') {
        return sortOrder === 'asc'
          ? a.difficultyLevel - b.difficultyLevel
          : b.difficultyLevel - a.difficultyLevel
      }
      return 0
    })
  }, [exercises, searchQuery, selectedLevel, selectedStatus, sortField, sortOrder])

  const handleSearchChange = (q: string) => {
    setSearchQuery(q)
    setPage(1)
  }

  const handleLevelChange = (lvl: string) => {
    setSelectedLevel(lvl)
    setPage(1)
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
    setPage(1)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedLevel('all')
    setSelectedStatus('all')
    setPage(1)
  }

  const isFiltered = searchQuery.trim() !== '' || selectedLevel !== 'all' || selectedStatus !== 'all'

  const fetchExercises = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get('/exercises/manage/all')
      setExercises(res.data)
    } catch (err) {
      console.error('ไม่สามารถดึงข้อมูลโจทย์ได้:', err)
    } finally {
      setLoading(false)
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
  const handleSort = (field: SortField) => {
    const isAsc = sortField === field && sortOrder === 'asc'
    setSortOrder(isAsc ? 'desc' : 'asc')
    setSortField(field)
    setPage(1)
  }

  // Pagination calculation
  const totalPages = Math.ceil(sortedExercises.length / rowsPerPage)
  const paginatedExercises = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    return sortedExercises.slice(start, start + rowsPerPage)
  }, [sortedExercises, page])

  return (
    <MainLayout activeItem="Exercises">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Table Container wrapped in Card to match System style */}
        <Card sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden', bgcolor: '#ffffff' }}>
          
          {/* Header Action, Search & Filter Toolbar Component */}
          <ExerciseToolbar
            totalCount={sortedExercises.length}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedLevel={selectedLevel}
            onLevelChange={handleLevelChange}
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
            isFiltered={isFiltered}
            onResetFilters={handleResetFilters}
            onOpenCreate={handleOpenCreate}
            onRefresh={fetchExercises}
            loading={loading}
          />

          {/* Table Component (Passing paginated subset and loading state) */}
          <ExerciseTable
            exercises={paginatedExercises}
            loading={loading}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            onPreview={(ex) => setPreviewExercise(ex)}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDeleteConfirm}
          />

          {/* Pagination & Summary Controls */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              pt: 2.5,
              borderTop: '1px solid #e2e8f0',
              mt: 2,
            }}
          >
            <Box sx={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
              แสดง{' '}
              {sortedExercises.length === 0 ? 0 : (page - 1) * rowsPerPage + 1} –{' '}
              {Math.min(page * rowsPerPage, sortedExercises.length)} จากทั้งหมด{' '}
              <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>
                {sortedExercises.length}
              </Box>{' '}
              ข้อ
            </Box>

            {totalPages > 1 && (
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                shape="rounded"
                size="medium"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontWeight: 600,
                    fontSize: '13px',
                    borderRadius: '8px',
                    color: '#475569',
                  },
                  '& .Mui-selected': {
                    bgcolor: '#4f46e5 !important',
                    color: '#ffffff !important',
                  },
                }}
              />
            )}
          </Box>
        </Card>
      </Box>

      {/* Quick Preview Dialog */}
      <ExercisePreviewDialog
        open={Boolean(previewExercise)}
        exercise={previewExercise}
        onClose={() => setPreviewExercise(null)}
        onEdit={(exercise) => {
          setPreviewExercise(null)
          handleOpenEdit(exercise)
        }}
      />

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
