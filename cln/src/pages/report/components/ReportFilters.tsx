import { Box, TextField, Button, Grid, InputAdornment } from '@mui/material';
import { Search, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { ReportFilterParams } from '../../../api/reports';

interface ReportFiltersProps {
  onFilterChange: (filters: ReportFilterParams) => void;
}

export function ReportFilters({ onFilterChange }: ReportFiltersProps) {
  const [filters, setFilters] = useState<ReportFilterParams>({
    search: '',
    startDate: '',
    endDate: '',
    education: '',
  });

  const handleInputChange = (field: keyof ReportFilterParams, value: any) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    const defaultFilters = { search: '', startDate: '', endDate: '', education: '' };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <Box sx={{ p: 2.5, bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', mb: 3 }}>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="ค้นหาชื่อผู้เรียน หรือ Username..."
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#64748b" />
                  </InputAdornment>
                ),
              }
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="สังกัด / สถาบันการศึกษา"
            value={filters.education || ''}
            onChange={(e) => handleInputChange('education', e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#64748b" />
                  </InputAdornment>
                ),
              }
            }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            fullWidth
            type="date"
            size="small"
            label="วันที่เริ่มต้น"
            slotProps={{
              inputLabel: { shrink: true }
            }}
            value={filters.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            fullWidth
            type="date"
            size="small"
            label="วันที่สิ้นสุด"
            slotProps={{
              inputLabel: { shrink: true }
            }}
            value={filters.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleReset}
            startIcon={<RotateCcw size={16} />}
            sx={{ color: '#64748b', borderColor: '#cbd5e1', textTransform: 'none', borderRadius: '8px', height: '40px' }}
          >
            ล้างตัวกรอง
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
