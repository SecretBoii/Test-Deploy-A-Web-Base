import React from 'react'
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material'
import { Search, Plus, RotateCcw, RefreshCw, X } from 'lucide-react'

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

// สไตล์กลางสำหรับ Dropdown Select & Input สไตล์ Modern SaaS (สอดคล้องกับหน้า ExerciseResultsPage)
const selectSx = {
  borderRadius: '10px',
  bgcolor: '#ffffff',
  height: '42px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#0f172a',
  '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #e2e8f0' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0f172a', borderWidth: '1.5px' },
  '& .MuiSelect-select': {
    py: 0,
    display: 'flex',
    alignItems: 'center',
  },
}

const labelSx = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#64748b',
  '&.Mui-focused': { color: '#0f172a' },
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
      {/* ส่วนหัวการจัดการ (Header Action Section) */}
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            คลังโจทย์และแบบฝึกหัด ({totalCount} ข้อ)
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={onOpenCreate}
          startIcon={<Plus size={18} />}
          sx={{
            borderRadius: '10px',
            height: '42px',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '13.5px',
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
          เพิ่มโจทย์ใหม่
        </Button>
      </Box>

      {/* แถบตัวกรองและช่องค้นหา (Modern SaaS Single Unified Toolbar) */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          flexWrap: 'wrap',
          mb: 3,
        }}
      >
        {/* ช่องค้นหาโจทย์: สไตล์ Outlined สีขาวมน 10px สูง 42px พร้อมปุ่มกากบาท X ล้างคำค้น */}
        <TextField
          size="small"
          placeholder="ค้นหาโจทย์ตามชื่อเรื่อง, หัวข้อ หรือรายละเอียดโจทย์..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            flexGrow: 1,
            minWidth: { xs: '100%', sm: 260 },
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              bgcolor: '#ffffff',
              height: '42px',
              fontSize: '13px',
              color: '#0f172a',
              fontWeight: 500,
              '& fieldset': { borderColor: '#e2e8f0' },
              '&:hover fieldset': { borderColor: '#94a3b8' },
              '&.Mui-focused fieldset': { borderColor: '#0f172a', borderWidth: '1.5px' },
              transition: 'all 0.15s ease',
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ color: '#94a3b8', mr: 1 }}>
                  <Search size={18} />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => onSearchChange('')}
                    sx={{ p: 0.5, color: '#94a3b8', '&:hover': { color: '#64748b' } }}
                  >
                    <X size={15} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />

        {/* ตัวกรองระดับความยาก: มาตรฐาน FormControl + InputLabel ลอยบนกรอบ */}
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 180 }, flexShrink: 0 }}>
          <InputLabel sx={labelSx}>ระดับความยาก</InputLabel>
          <Select
            value={selectedLevel}
            onChange={(e) => onLevelChange(e.target.value)}
            label="ระดับความยาก"
            sx={selectSx}
          >
            <MenuItem value="all" sx={{ fontSize: '13px', fontWeight: 600 }}>ทั้งหมด</MenuItem>
            <MenuItem value="1" sx={{ fontSize: '13px' }}>Lv.1 - Remembering</MenuItem>
            <MenuItem value="2" sx={{ fontSize: '13px' }}>Lv.2 - Applying</MenuItem>
            <MenuItem value="3" sx={{ fontSize: '13px' }}>Lv.3 - Analyzing</MenuItem>
            <MenuItem value="4" sx={{ fontSize: '13px' }}>Lv.4 - Evaluating</MenuItem>
            <MenuItem value="5" sx={{ fontSize: '13px' }}>Lv.5 - Creating</MenuItem>
          </Select>
        </FormControl>

        {/* ตัวกรองสถานะ: มาตรฐาน FormControl + InputLabel ลอยบนกรอบ */}
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 160 }, flexShrink: 0 }}>
          <InputLabel sx={labelSx}>สถานะ</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            label="สถานะ"
            sx={selectSx}
          >
            <MenuItem value="all" sx={{ fontSize: '13px', fontWeight: 600 }}>ทั้งหมด</MenuItem>
            <MenuItem value="active" sx={{ fontSize: '13px' }}>Active (เปิดใช้งาน)</MenuItem>
            <MenuItem value="inactive" sx={{ fontSize: '13px' }}>Inactive (ฉบับร่าง)</MenuItem>
          </Select>
        </FormControl>

        {/* ปุ่มรีเฟรชข้อมูล: ทรงมน 10px สูง 42px สีขาวคมชัด */}
        {onRefresh && (
          <IconButton
            onClick={onRefresh}
            disabled={loading}
            sx={{
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              width: '42px',
              height: '42px',
              bgcolor: '#ffffff',
              color: '#64748b',
              flexShrink: 0,
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: '#f8fafc',
                borderColor: '#94a3b8',
                color: '#0f172a',
              },
              '&.Mui-disabled': {
                bgcolor: '#ffffff',
                borderColor: '#e2e8f0',
                color: '#cbd5e1',
              },
            }}
          >
            <RefreshCw
              size={16}
              style={{
                animation: loading ? 'spin 1s linear infinite' : 'none',
              }}
            />
          </IconButton>
        )}

        {/* ปุ่มล้างตัวกรอง: สไตล์มินิมอลแบบ ExerciseResultsPage */}
        <Button
          size="small"
          disabled={!isFiltered}
          onClick={onResetFilters}
          startIcon={<RotateCcw size={14} />}
          sx={{
            height: '42px',
            borderRadius: '10px',
            px: 1.8,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            color: isFiltered ? '#475569' : '#94a3b8',
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'none',
            transition: 'all 0.15s ease',
            '&:hover': {
              color: isFiltered ? '#ef4444' : '#94a3b8',
              bgcolor: isFiltered ? '#fef2f2' : 'transparent',
            },
            '&.Mui-disabled': {
              color: '#94a3b8',
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
