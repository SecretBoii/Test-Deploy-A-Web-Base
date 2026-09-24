import {
  Box, Typography, TextField, InputAdornment,
  FormControl, InputLabel, Select, MenuItem, Button
} from '@mui/material';
import { Search, RotateCcw } from 'lucide-react';

interface ExerciseStudentFiltersProps {
  filteredCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onReset: () => void;
  isFiltered: boolean;
}

export function ExerciseStudentFilters({
  filteredCount,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onReset,
  isFiltered,
}: ExerciseStudentFiltersProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
        รายชื่อนักศึกษาและประวัติการทำ ({filteredCount} คน)
      </Typography>

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="ค้นหาชื่อ หรือ Username..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ color: '#94a3b8', mr: 1 }}>
                  <Search size={18} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
                height: '46px',
                fontSize: '13px',
                '& fieldset': { border: 'none' },
              },
            },
          }}
          sx={{ width: { xs: '100%', sm: 260 } }}
        />

        <FormControl size="small" sx={{ width: { xs: '100%', sm: 180 }, flexShrink: 0 }}>
          <InputLabel sx={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>สถานะการทำ</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            label="สถานะการทำ"
            sx={{
              borderRadius: '12px',
              bgcolor: '#f8fafc',
              height: '46px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#334155',
              '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #e2e8f0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb', borderWidth: '1.5px' },
            }}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            <MenuItem value="PASSED">ผ่าน (≥ 80)</MenuItem>
            <MenuItem value="FAILED">ยังไม่ผ่าน (&lt; 80)</MenuItem>
            <MenuItem value="NOT_STARTED">ยังไม่เริ่มทำ</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          onClick={onReset}
          disabled={!isFiltered}
          startIcon={<RotateCcw size={15} />}
          sx={{
            height: '46px',
            borderRadius: '12px',
            px: 2,
            borderColor: isFiltered ? '#cbd5e1' : '#e2e8f0',
            color: isFiltered ? '#475569' : '#94a3b8',
            bgcolor: isFiltered ? '#f8fafc' : 'transparent',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            '&:hover': {
              bgcolor: '#f1f5f9',
              borderColor: '#94a3b8',
              color: '#0f172a',
            },
            '&.Mui-disabled': {
              bgcolor: 'transparent',
              borderColor: '#e2e8f0',
              color: '#cbd5e1',
            },
            transition: 'all 0.15s ease',
          }}
        >
          ล้างตัวกรอง
        </Button>
      </Box>
    </Box>
  );
}
