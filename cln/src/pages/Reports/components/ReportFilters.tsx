import { Box, TextField, Button, Grid, InputAdornment } from '@mui/material';
import { Search, RotateCcw, Building2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { ReportFilterParams } from '../../../api/reports';

interface ReportFiltersProps {
  activeTab: number;
  onFilterChange: (filters: ReportFilterParams) => void;
}

export function ReportFilters({ activeTab, onFilterChange }: ReportFiltersProps) {
  const [search, setSearch] = useState('');
  const [education, setEducation] = useState('');

  // ติดตามการสลับแท็บเพื่อรีเซ็ตข้อความค้นหา โดยไม่ปล่อยให้ Debounce ยิง API ซ้ำรอบสอง
  const prevTabRef = useRef(activeTab);
  const skipDebounceRef = useRef(false);

  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      prevTabRef.current = activeTab;
      skipDebounceRef.current = true;
      setSearch('');
    }
  }, [activeTab]);

  const isInitialMount = useRef(true);
  const onFilterChangeRef = useRef(onFilterChange);
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  });

  // ใช้ useEffect สำหรับ Debounce หน่วงเวลา 400ms เมื่อผู้ใช้พิมพ์ค้นหา
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onFilterChangeRef.current({ search, education });
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [search, education]);

  // รีเซ็ตค่าการกรองทั้งหมดกลับเป็นค่าเริ่มต้น
  const handleReset = () => {
    setSearch('');
    setEducation('');
    onFilterChangeRef.current({ search: '', education: '' });
  };

  // กำหนดข้อความ Placeholder ช่องค้นหาให้ตรงตาม Context ของ Tab ที่เปิดอยู่
  const getSearchPlaceholder = () => {
    if (activeTab === 0) return 'ค้นหาชื่อผู้เรียน, นามสกุล หรือ Username...';
    if (activeTab === 1) return 'ค้นหาชื่อโจทย์ หรือ หัวข้อบทเรียน...';
    return 'ค้นหาประเภท Exception (เช่น SyntaxError, RuntimeError)...';
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        {/* ช่องค้นหา - ปรับ Dynamic Placeholder ตาม Context ของ Tab */}
        <Grid size={{ xs: 12, md: 5 }}>
          <TextField
            fullWidth
            placeholder={getSearchPlaceholder()}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                  fontSize: '14px',
                  '& fieldset': { border: 'none' },
                  '&:hover': { bgcolor: '#f1f5f9' },
                  transition: 'all 0.15s ease',
                },
              }
            }}
          />
        </Grid>

        {/* ช่องกรองสังกัด / สถาบันการศึกษา - ขอบมน 12px */}
        <Grid size={{ xs: 12, md: 5 }}>
          <TextField
            fullWidth
            placeholder="สังกัด / สถาบันการศึกษา / มหาวิทยาลัย..."
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: '#94a3b8', mr: 1 }}>
                    <Building2 size={18} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  height: '46px',
                  fontSize: '14px',
                  '& fieldset': { border: 'none' },
                  '&:hover': { bgcolor: '#f1f5f9' },
                  transition: 'all 0.15s ease',
                },
              }
            }}
          />
        </Grid>

        {/* ปุ่มล้างตัวกรอง - ขอบมน 12px */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleReset}
            startIcon={<RotateCcw size={16} />}
            sx={{
              color: '#64748b',
              borderColor: '#e2e8f0',
              bgcolor: '#f8fafc',
              textTransform: 'none',
              borderRadius: '12px',
              height: '46px',
              fontWeight: 700,
              fontSize: '14px',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#f1f5f9',
                borderColor: '#cbd5e1',
                color: '#334155',
                boxShadow: 'none',
              },
              transition: 'all 0.15s ease',
            }}
          >
            ล้างตัวกรอง
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
