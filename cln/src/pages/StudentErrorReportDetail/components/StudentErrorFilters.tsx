import { Card, Box, Typography, Chip, TextField, InputAdornment } from '@mui/material';
import { Search } from 'lucide-react';
import { getErrorBadgeStyle } from '../StudentErrorReportDetailPage';

interface StudentErrorFiltersProps {
  selectedErrorType: string;
  onSelectErrorType: (type: string) => void;
  typeCountMap: Record<string, number>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function StudentErrorFilters({
  selectedErrorType,
  onSelectErrorType,
  typeCountMap,
  searchQuery,
  onSearchChange,
}: StudentErrorFiltersProps) {
  return (
    <Card sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: '#ffffff' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        {/* กลุ่มปุ่ม Chips สำหรับกรองประเภท Exception */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', mr: 0.5 }}>
            กรองตามประเภท Error:
          </Typography>
          <Chip
            label="ทั้งหมด"
            size="small"
            onClick={() => onSelectErrorType('ALL')}
            sx={{
              cursor: 'pointer',
              fontWeight: 700,
              bgcolor: selectedErrorType === 'ALL' ? '#2563eb' : '#f1f5f9',
              color: selectedErrorType === 'ALL' ? '#ffffff' : '#64748b',
            }}
          />
          {Object.entries(typeCountMap).map(([type, count]) => {
            const isSelected = selectedErrorType === type;
            const style = getErrorBadgeStyle(type);
            return (
              <Chip
                key={type}
                label={`${type} (${count})`}
                size="small"
                onClick={() => onSelectErrorType(isSelected ? 'ALL' : type)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 700,
                  bgcolor: isSelected ? style.color : style.bg,
                  color: isSelected ? '#ffffff' : style.color,
                  border: `1px solid ${style.border}`,
                }}
              />
            );
          })}
        </Box>

        {/* ช่อง Input ค้นหาชื่อแบบฝึกหัด */}
        <TextField
          size="small"
          placeholder="ค้นหาชื่อโจทย์ หรือหัวข้อ..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ color: '#94a3b8' }}>
                  <Search size={16} />
                </InputAdornment>
              ),
              sx: { borderRadius: '10px', fontSize: '13px', width: { xs: '100%', sm: '250px' } },
            },
          }}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        />
      </Box>
    </Card>
  );
}
