import React from 'react';
import {
  Card,
  Box,
  Stack,
  TextField,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  InputAdornment,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import { RefreshCw, Search, LayoutList, Activity, Calendar, RotateCcw } from 'lucide-react';

interface AuditLogFilterProps {
  search: string;
  setSearch: (val: string) => void;
  actionFilter: string;
  setActionFilter: (val: string) => void;
  startDate?: string;
  setStartDate?: (val: string) => void;
  endDate?: string;
  setEndDate?: (val: string) => void;
  viewMode?: 'timeline' | 'table';
  onViewModeChange?: (mode: 'timeline' | 'table') => void;
  onSearch: (e: React.FormEvent) => void;
  onRefresh: () => void;
  onReset?: () => void;
}

export const AuditLogFilter: React.FC<AuditLogFilterProps> = ({
  search,
  setSearch,
  actionFilter,
  setActionFilter,
  startDate = '',
  setStartDate,
  endDate = '',
  setEndDate,
  viewMode = 'timeline',
  onViewModeChange,
  onSearch,
  onRefresh,
  onReset,
}) => {
  const isFiltered = Boolean(search || actionFilter || startDate || endDate);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // ดักจับคีย์ลัด Ctrl + F หรือ Cmd + F เพื่อ auto-focus ที่ช่องค้นหาของหน้า Audit Log
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const quickActions = [
    { label: 'ทั้งหมด', value: '', color: '#475569', bg: '#f8fafc' },
    { label: 'Login', value: 'LOGIN', color: '#1d4ed8', bg: '#eff6ff' },
    { label: 'Logout', value: 'LOGOUT', color: '#64748b', bg: '#f1f5f9' },
    { label: 'Create', value: 'CREATE', color: '#047857', bg: '#ecfdf5' },
    { label: 'Update', value: 'UPDATE', color: '#b45309', bg: '#fffbeb' },
    { label: 'Delete', value: 'DELETE', color: '#dc2626', bg: '#fef2f2' },
    { label: 'Run Code', value: 'RUN_CODE', color: '#4338ca', bg: '#eef2ff' },
    { label: 'Submit', value: 'SUBMIT', color: '#7c3aed', bg: '#f5f3ff' },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box component="form" onSubmit={onSearch}>
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', lg: 'center' },
          }}
        >
          {/* แถบตัวกรองและควบคุมข้อมูลด้านบน: สไตล์ Modern Slate (ขอบมน 10px, พื้นหลังขาวคมชัด, Focus สี #0f172a ตามรูปที่ 2) */}
          {/* Left Section: Inputs (Search, Date Pickers) */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{
              alignItems: 'center',
              flexWrap: 'wrap',
              flex: 1,
            }}
          >
            {/* 1. Search Box (สไตล์รูปที่ 2: ขอบมน 10px, ขอบบาง #e2e8f0, โฟกัส #0f172a พร้อมรองรับคีย์ลัด) */}
            <TextField
              inputRef={searchInputRef}
              size="small"
              placeholder="ค้นหาชื่อผู้ใช้ หรือ Username..."
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
              sx={{ minWidth: { xs: '100%', sm: 250 }, flex: { sm: 1 } }}
            />

            {/* 2. Start Date Picker (สไตล์รูปที่ 2) */}
            {setStartDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: { xs: '100%', sm: 'auto' } }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  เริ่ม:
                </Typography>
                <TextField
                  type="date"
                  size="small"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: '#94a3b8', mr: 0.5 }}>
                          <Calendar size={16} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: '10px',
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        height: '44px',
                        fontSize: '13px',
                        color: '#0f172a',
                        fontWeight: 500,
                        '& fieldset': { border: 'none' },
                        '&:hover': { borderColor: '#94a3b8' },
                        '&.Mui-focused': { borderColor: '#0f172a' },
                        transition: 'all 0.15s ease',
                      },
                    },
                  }}
                  sx={{ minWidth: 155 }}
                />
              </Box>
            )}

            {/* 3. End Date Picker (สไตล์รูปที่ 2) */}
            {setEndDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: { xs: '100%', sm: 'auto' } }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  ถึง:
                </Typography>
                <TextField
                  type="date"
                  size="small"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: '#94a3b8', mr: 0.5 }}>
                          <Calendar size={16} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: '10px',
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        height: '44px',
                        fontSize: '13px',
                        color: '#0f172a',
                        fontWeight: 500,
                        '& fieldset': { border: 'none' },
                        '&:hover': { borderColor: '#94a3b8' },
                        '&.Mui-focused': { borderColor: '#0f172a' },
                        transition: 'all 0.15s ease',
                      },
                    },
                  }}
                  sx={{ minWidth: 155 }}
                />
              </Box>
            )}
          </Stack>

          {/* Right Section: Reset Button, View Mode Toggle & Refresh Button */}
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: 'center',
              justifyContent: { xs: 'flex-end', lg: 'flex-end' },
            }}
          >
            {/* ปุ่มล้างตัวกรอง (สไตล์รูปที่ 2 เป๊ะๆ: ขอบมน 10px, พื้นขาว, ไอคอน RotateCcw) */}
            {onReset && (
              <Button
                variant="outlined"
                onClick={onReset}
                disabled={!isFiltered}
                startIcon={<RotateCcw size={15} />}
                sx={{
                  height: '44px',
                  borderRadius: '10px',
                  px: 2,
                  borderColor: '#e2e8f0',
                  color: isFiltered ? '#475569' : '#94a3b8',
                  bgcolor: '#ffffff',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '13px',
                  '&:hover': {
                    bgcolor: '#f8fafc',
                    borderColor: '#94a3b8',
                    color: '#0f172a',
                  },
                  '&.Mui-disabled': {
                    borderColor: '#e2e8f0',
                    color: '#cbd5e1',
                  },
                  transition: 'all 0.15s ease',
                }}
              >
                ล้างตัวกรอง
              </Button>
            )}

            {/* View Mode Switcher (Modern Slate Toggle: ขอบมน 10px, Active สี #0f172a) */}
            {onViewModeChange && (
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, nextMode) => {
                  if (nextMode) onViewModeChange(nextMode);
                }}
                size="small"
                sx={{
                  bgcolor: '#f8fafc',
                  p: '4px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  height: '44px',
                  '& .MuiToggleButton-root': {
                    border: 'none',
                    borderRadius: '8px',
                    px: 1.8,
                    fontWeight: 600,
                    fontSize: '13px',
                    color: '#64748b',
                    textTransform: 'none',
                    transition: 'all 0.15s ease-in-out',
                    '&.Mui-selected': {
                      bgcolor: '#0f172a',
                      color: '#ffffff',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
                      fontWeight: 600,
                      '&:hover': { bgcolor: '#1e293b' },
                    },
                    '&:hover': { bgcolor: '#f1f5f9' },
                  },
                }}
              >
                <ToggleButton value="timeline">
                  <Activity size={15} style={{ marginRight: 6 }} /> Timeline Stream
                </ToggleButton>
                <ToggleButton value="table">
                  <LayoutList size={15} style={{ marginRight: 6 }} /> Table Grid
                </ToggleButton>
              </ToggleButtonGroup>
            )}

            {/* Refresh Button (ขอบมน 10px สูง 44px เข้าเซ็ต) */}
            <Tooltip title="รีเฟรชข้อมูล Log">
              <IconButton
                onClick={onRefresh}
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  height: '44px',
                  width: '44px',
                  bgcolor: '#ffffff',
                  '&:hover': { bgcolor: '#f8fafc', borderColor: '#94a3b8' },
                  transition: 'all 0.15s ease',
                }}
              >
                <RefreshCw size={17} color="#475569" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Quick Filter Chips Row */}
        <Box sx={{ mt: 2, pt: 1.8, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, mr: 0.5 }}>
            กรองด่วน:
          </Typography>
          {quickActions.map((act) => {
            const isSelected = actionFilter === act.value;
            return (
              <Chip
                key={act.value}
                label={act.label}
                onClick={() => setActionFilter(act.value)}
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 700 : 500,
                  bgcolor: isSelected ? act.color : '#f8fafc',
                  color: isSelected ? '#ffffff' : '#475569',
                  border: `1px solid ${isSelected ? act.color : '#e2e8f0'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isSelected ? act.color : act.bg,
                    color: isSelected ? '#ffffff' : act.color,
                    borderColor: act.color,
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Card>
  );
};