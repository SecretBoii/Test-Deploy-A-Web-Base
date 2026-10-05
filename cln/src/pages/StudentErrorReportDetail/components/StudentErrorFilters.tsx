import { Box, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { Search, RotateCcw } from 'lucide-react';

interface StudentErrorFiltersProps {
  selectedErrorType: string;
  onSelectErrorType: (type: string) => void;
  typeCountMap: Record<string, number>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const selectSx = {
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
};

const labelSx = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#64748b',
  '&.Mui-focused': { color: '#0f172a' },
};

// แถบตัวกรองแถวเดียวสมบูรณ์ (Single Unified Toolbar) - สไตล์ Modern Dark-Navy SaaS 44px
export function StudentErrorFilters({
  selectedErrorType,
  onSelectErrorType,
  typeCountMap,
  searchQuery,
  onSearchChange,
}: StudentErrorFiltersProps) {
  const isFiltered = selectedErrorType !== 'ALL' || searchQuery.trim() !== '';

  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
      {/* 1. ช่องค้นหาชื่อโจทย์ หรือ หัวข้อ (ความสูง 44px) */}
      <TextField
        size="small"
        placeholder="ค้นหาชื่อโจทย์ หรือหัวข้อ..."
        value={searchQuery}
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
        sx={{ width: { xs: '100%', sm: 280 } }}
      />

      {/* 2. Dropdown กรองประเภท Error (แสดงเฉพาะชื่อข้อความ ไม่มีตัวเลข) */}
      <FormControl size="small" sx={{ width: { xs: '100%', sm: 200 }, flexShrink: 0 }}>
        <InputLabel sx={labelSx}>ประเภท Error</InputLabel>
        <Select
          value={selectedErrorType}
          onChange={(e) => onSelectErrorType(e.target.value)}
          label="ประเภท Error"
          sx={selectSx}
        >
          <MenuItem value="ALL" sx={{ fontSize: '13px', fontWeight: 600 }}>
            ทั้งหมด
          </MenuItem>
          {Object.keys(typeCountMap).map((type) => (
            <MenuItem key={type} value={type} sx={{ fontSize: '13px', fontWeight: 500 }}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 3. ปุ่มล้างตัวกรอง แสดงผลตลอดเวลา (Always Visible) ตามมาตรฐานของระบบ */}
      <Button
        variant="outlined"
        startIcon={<RotateCcw size={15} />}
        onClick={() => {
          onSelectErrorType('ALL');
          onSearchChange('');
        }}
        disabled={!isFiltered}
        sx={{
          height: '44px',
          borderRadius: '10px',
          px: 2,
          borderColor: isFiltered ? '#0f172a' : '#e2e8f0',
          color: isFiltered ? '#0f172a' : '#94a3b8',
          bgcolor: '#ffffff',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '13px',
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
  );
}
