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
                borderRadius: '10px',
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                height: '44px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#0f172a',
                '& fieldset': { border: 'none' },
                '&:hover': { borderColor: '#94a3b8' },
                '&.Mui-focused': { borderColor: '#0f172a' },
                transition: 'all 0.15s ease',
              },
            },
          }}
          sx={{ width: { xs: '100%', sm: 260 } }}
        />

        <FormControl size="small" sx={{ width: { xs: '100%', sm: 180 }, flexShrink: 0 }}>
          <InputLabel sx={{ fontSize: '13px', fontWeight: 600, color: '#64748b', '&.Mui-focused': { color: '#0f172a' } }}>
            สถานะการทำ
          </InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            label="สถานะการทำ"
            sx={{
              borderRadius: '10px',
              bgcolor: '#ffffff',
              height: '44px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0f172a',
              '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #e2e8f0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0f172a', borderWidth: '1.5px' },
              '& .MuiSelect-select': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                pr: '32px !important',
              },
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
            height: '44px',
            borderRadius: '10px',
            px: 2,
            borderColor: isFiltered ? '#0f172a' : '#e2e8f0',
            color: isFiltered ? '#0f172a' : '#94a3b8',
            bgcolor: '#ffffff',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#f8fafc',
              borderColor: '#0f172a',
              color: '#0f172a',
              boxShadow: 'none',
            },
            '&.Mui-disabled': {
              bgcolor: '#ffffff',
              borderColor: '#f1f5f9',
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
