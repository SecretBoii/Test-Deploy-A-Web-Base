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
      {/* Segmented Tabs เลือกประเภทกิจกรรม สไตล์ KOKISO Capsule */}
      <Box sx={{ display: 'inline-flex', p: '3px', bgcolor: '#f1f5f9', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => onTabChange(val)}
          sx={{
            minHeight: 'auto',
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTabs-flexContainer': { gap: '4px' },
            '& .MuiTab-root': {
              fontSize: '13px',
              fontWeight: 600,
              minHeight: '34px',
              borderRadius: '9px',
              textTransform: 'none',
              px: 2,
              py: 0.5,
              color: '#64748b',
              transition: 'all 0.15s ease',
              '&:hover': { color: '#0f172a' },
              '&.Mui-selected': { 
                bgcolor: '#ffffff', 
                color: '#0f172a', 
                fontWeight: 700, 
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)' 
              }
            }
          }}
        >
          <Tab value="all" label={`ทั้งหมด (${tabCounts.all})`} />
          <Tab value="submit" label={`การส่งตรวจประเมิน (${tabCounts.submit})`} />
          <Tab value="run" label={`การทดลองรันโค้ด (${tabCounts.run})`} />
        </Tabs>
      </Box>

      {/* ตัวเลือกกรองสถานะ และช่องค้นหา */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        {/* ปุ่มกรอง Passed / Failed สไตล์ Segmented Control */}
        <Box sx={{ display: 'flex', gap: 0.5, bgcolor: '#f1f5f9', p: '3px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <Button
            size="small"
            onClick={() => onStatusFilterChange('all')}
            sx={{
              fontSize: '12px',
              fontWeight: statusFilter === 'all' ? 700 : 500,
              textTransform: 'none',
              borderRadius: '7px',
              py: 0.4,
              px: 1.4,
              bgcolor: statusFilter === 'all' ? '#ffffff' : 'transparent',
              color: statusFilter === 'all' ? '#0f172a' : '#64748b',
              boxShadow: statusFilter === 'all' ? '0 1px 2px rgba(15, 23, 42, 0.06)' : 'none',
              '&:hover': { bgcolor: statusFilter === 'all' ? '#ffffff' : 'rgba(255,255,255,0.5)', color: '#0f172a' },
            }}
          >
            ทั้งหมด
          </Button>
          <Button
            size="small"
            onClick={() => onStatusFilterChange('passed')}
            sx={{
              fontSize: '12px',
              fontWeight: statusFilter === 'passed' ? 700 : 500,
              textTransform: 'none',
              borderRadius: '7px',
              py: 0.4,
              px: 1.4,
              bgcolor: statusFilter === 'passed' ? '#ffffff' : 'transparent',
              color: statusFilter === 'passed' ? '#0f172a' : '#64748b',
              boxShadow: statusFilter === 'passed' ? '0 1px 2px rgba(15, 23, 42, 0.06)' : 'none',
              '&:hover': { bgcolor: statusFilter === 'passed' ? '#ffffff' : 'rgba(255,255,255,0.5)', color: '#0f172a' },
            }}
          >
            เฉพาะที่ผ่าน (Passed)
          </Button>
          <Button
            size="small"
            onClick={() => onStatusFilterChange('failed')}
            sx={{
              fontSize: '12px',
              fontWeight: statusFilter === 'failed' ? 700 : 500,
              textTransform: 'none',
              borderRadius: '7px',
              py: 0.4,
              px: 1.4,
              bgcolor: statusFilter === 'failed' ? '#ffffff' : 'transparent',
              color: statusFilter === 'failed' ? '#0f172a' : '#64748b',
              boxShadow: statusFilter === 'failed' ? '0 1px 2px rgba(15, 23, 42, 0.06)' : 'none',
              '&:hover': { bgcolor: statusFilter === 'failed' ? '#ffffff' : 'rgba(255,255,255,0.5)', color: '#0f172a' },
            }}
          >
            เฉพาะที่ไม่ผ่าน (Failed)
          </Button>
        </Box>

        {/* ช่องค้นหาชื่อโจทย์ พื้นขาวคลีน */}
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
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                width: '240px',
                height: '38px',
                fontWeight: 500,
                color: '#0f172a',
                '& fieldset': { border: 'none' },
                '&:hover': { borderColor: '#94a3b8' },
                '&.Mui-focused': { borderColor: '#0f172a' },
                transition: 'all 0.15s ease',
              }
            }
          }}
        />
      </Box>
    </Box>
  );
}
