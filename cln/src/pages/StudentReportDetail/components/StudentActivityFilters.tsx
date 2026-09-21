import { Box, Button, Tabs, Tab, TextField, InputAdornment } from '@mui/material';
import { Search } from 'lucide-react';

interface TabCounts {
  all: number;
  submit: number;
  run: number;
}

interface StudentActivityFiltersProps {
  activeTab: 'all' | 'submit' | 'run';
  onTabChange: (tab: 'all' | 'submit' | 'run') => void;
  tabCounts: TabCounts;
  statusFilter: 'all' | 'passed' | 'failed';
  onStatusFilterChange: (status: 'all' | 'passed' | 'failed') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function StudentActivityFilters({
  activeTab,
  onTabChange,
  tabCounts,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
}: StudentActivityFiltersProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
      {/* Segmented Tabs เลือกประเภทกิจกรรม */}
      <Tabs
        value={activeTab}
        onChange={(_, val) => onTabChange(val)}
        sx={{
          minHeight: '40px',
          bgcolor: '#f1f5f9',
          borderRadius: '12px',
          p: '4px',
          '& .MuiTab-root': {
            fontSize: '13px',
            fontWeight: 700,
            minHeight: '32px',
            borderRadius: '8px',
            textTransform: 'none',
            px: 2.5,
            color: '#64748b',
            '&.Mui-selected': { bgcolor: '#ffffff', color: '#2563eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }
          },
          '& .MuiTabs-indicator': { display: 'none' }
        }}
      >
        <Tab value="all" label={`ทั้งหมด (${tabCounts.all})`} />
        <Tab value="submit" label={`การส่งตรวจประเมิน (${tabCounts.submit})`} />
        <Tab value="run" label={`การทดลองรันโค้ด (${tabCounts.run})`} />
      </Tabs>

      {/* ตัวเลือกกรองสถานะ และช่องค้นหา */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        {/* ปุ่มกรอง Passed / Failed */}
        <Box sx={{ display: 'flex', gap: 0.5, bgcolor: '#f8fafc', p: '3px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <Button
            size="small"
            onClick={() => onStatusFilterChange('all')}
            sx={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '6px',
              py: 0.3,
              px: 1.2,
              bgcolor: statusFilter === 'all' ? '#ffffff' : 'transparent',
              color: statusFilter === 'all' ? '#0f172a' : '#64748b',
              boxShadow: statusFilter === 'all' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            ทั้งหมด
          </Button>
          <Button
            size="small"
            onClick={() => onStatusFilterChange('passed')}
            sx={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '6px',
              py: 0.3,
              px: 1.2,
              bgcolor: statusFilter === 'passed' ? '#ecfdf5' : 'transparent',
              color: statusFilter === 'passed' ? '#10b981' : '#64748b',
              boxShadow: statusFilter === 'passed' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            เฉพาะที่ผ่าน (Passed)
          </Button>
          <Button
            size="small"
            onClick={() => onStatusFilterChange('failed')}
            sx={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '6px',
              py: 0.3,
              px: 1.2,
              bgcolor: statusFilter === 'failed' ? '#fff1f2' : 'transparent',
              color: statusFilter === 'failed' ? '#ef4444' : '#64748b',
              boxShadow: statusFilter === 'failed' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            เฉพาะที่ไม่ผ่าน (Failed)
          </Button>
        </Box>

        {/* ช่องค้นหาชื่อโจทย์ */}
        <TextField
          size="small"
          placeholder="ค้นหาชื่อโจทย์ หรือ บทเรียน..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ color: '#94a3b8' }}>
                  <Search size={16} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '10px',
                fontSize: '13px',
                bgcolor: '#f8fafc',
                width: '260px',
              }
            }
          }}
        />
      </Box>
    </Box>
  );
}
