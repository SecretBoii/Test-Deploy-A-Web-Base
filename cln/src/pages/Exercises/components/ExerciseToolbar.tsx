import React from 'react'
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
} from '@mui/material'
import { Search, BookOpen, Plus, RotateCcw, RefreshCw } from 'lucide-react'

interface ExerciseToolbarProps {
  totalCount: number
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedLevel: string
  onLevelChange: (value: string) => void
  selectedStatus: string
  onStatusChange: (value: string) => void
  isFiltered: boolean
  onResetFilters: () => void
  onOpenCreate: () => void
  onRefresh?: () => void
  loading?: boolean
}

export const ExerciseToolbar: React.FC<ExerciseToolbarProps> = ({
  totalCount,
  searchQuery,
  onSearchChange,
  selectedLevel,
  onLevelChange,
  selectedStatus,
  onStatusChange,
  isFiltered,
  onResetFilters,
  onOpenCreate,
  onRefresh,
  loading = false,
}) => {
  return (
    <>
      {/* Header Action Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <BookOpen size={24} color="#4f46e5" />
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            คลังโจทย์และแบบฝึกหัด ({totalCount} ข้อ)
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={onOpenCreate}
          startIcon={<Plus size={18} />}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 700,
            bgcolor: '#4f46e5',
            color: '#ffffff',
            px: 2.5,
            py: 1,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#4338ca',
              boxShadow: 'none',
            },
            transition: 'all 0.15s ease',
          }}
        >
          เพิ่มโจทย์ใหม่
        </Button>
      </Box>

      {/* Search Field and Filter Controls */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          flexWrap: 'wrap',
          mb: 3,
        }}
      >
        {/* Search Field */}
        <TextField
          placeholder="ค้นหาโจทย์ตามชื่อเรื่อง, หัวข้อ หรือรายละเอียดโจทย์..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            flexGrow: 1,
            minWidth: { xs: '100%', sm: 260 },
          }}
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
                fontSize: '14px',
                '& fieldset': { border: 'none' },
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: '#ffffff',
                  borderColor: '#cbd5e1',
                },
                '&.Mui-focused': {
                  bgcolor: '#ffffff',
                  borderColor: '#4f46e5',
                  boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
                },
              },
            },
          }}
        />

        {/* Filter: Bloom Level */}
        <TextField
          select
          value={selectedLevel}
          onChange={(e) => onLevelChange(e.target.value)}
          sx={{ minWidth: { xs: '100%', sm: 195 }, flexShrink: 0 }}
          slotProps={{
            input: {
              sx: {
                borderRadius: '12px',
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
                height: '46px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                '& fieldset': { border: 'none' },
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: '#ffffff',
                  borderColor: '#cbd5e1',
                },
                '&.Mui-focused': {
                  bgcolor: '#ffffff',
                  borderColor: '#4f46e5',
                  boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
                },
              },
            },
          }}
        >
          <MenuItem value="all">ระดับความยาก: ทั้งหมด</MenuItem>
          <MenuItem value="1">Lv.1 - จดจำ & เข้าใจ</MenuItem>
          <MenuItem value="2">Lv.2 - นำไปใช้</MenuItem>
          <MenuItem value="3">Lv.3 - วิเคราะห์</MenuItem>
          <MenuItem value="4">Lv.4 - ประเมินค่า</MenuItem>
          <MenuItem value="5">Lv.5 - สร้างสรรค์</MenuItem>
        </TextField>

        {/* Filter: Status */}
        <TextField
          select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          sx={{ minWidth: { xs: '100%', sm: 165 }, flexShrink: 0 }}
          slotProps={{
            input: {
              sx: {
                borderRadius: '12px',
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
                height: '46px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                '& fieldset': { border: 'none' },
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: '#ffffff',
                  borderColor: '#cbd5e1',
                },
                '&.Mui-focused': {
                  bgcolor: '#ffffff',
                  borderColor: '#4f46e5',
                  boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
                },
              },
            },
          }}
        >
          <MenuItem value="all">สถานะ: ทั้งหมด</MenuItem>
          <MenuItem value="active">Active (เปิดใช้งาน)</MenuItem>
          <MenuItem value="inactive">Inactive (ฉบับร่าง)</MenuItem>
        </TextField>

        {/* Refresh Button (สไตล์เดียวกับ UsersPage) */}
        {onRefresh && (
          <Tooltip title="รีเฟรชข้อมูล" arrow>
            <span>
              <IconButton
                onClick={onRefresh}
                disabled={loading}
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  width: '46px',
                  height: '46px',
                  bgcolor: '#f8fafc',
                  color: '#64748b',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: '#ffffff',
                    borderColor: '#cbd5e1',
                    color: '#4f46e5',
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#f8fafc',
                    borderColor: '#e2e8f0',
                    color: '#cbd5e1',
                  },
                }}
              >
                <RefreshCw
                  size={18}
                  style={{
                    animation: loading ? 'spin 1s linear infinite' : 'none',
                  }}
                />
              </IconButton>
            </span>
          </Tooltip>
        )}

        {/* Reset Button (ขนาดสมส่วน ป้องกันการถูกบีบด้วย flexShrink: 0 และ minWidth: 120px) */}
        <Button
          variant="outlined"
          disabled={!isFiltered}
          onClick={onResetFilters}
          startIcon={<RotateCcw size={15} />}
          sx={{
            height: '46px',
            borderRadius: '12px',
            px: 2.5,
            minWidth: '120px',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            borderColor: isFiltered ? '#cbd5e1' : '#e2e8f0',
            color: isFiltered ? '#475569' : '#94a3b8',
            bgcolor: isFiltered ? '#f8fafc' : 'transparent',
            fontWeight: 600,
            fontSize: '13px',
            textTransform: 'none',
            transition: 'all 0.15s ease',
            '&:hover': {
              borderColor: '#ef4444',
              bgcolor: '#fef2f2',
              color: '#ef4444',
            },
            '&.Mui-disabled': {
              bgcolor: 'transparent',
              borderColor: '#e2e8f0',
              color: '#cbd5e1',
            },
          }}
        >
          ล้างตัวกรอง
        </Button>
      </Box>
    </>
  )
}

export default ExerciseToolbar
