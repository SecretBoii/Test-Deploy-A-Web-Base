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

  const quickActions = [
    { label: 'ทั้งหมด', value: '', color: '#2563eb', bg: '#eff6ff' },
    { label: '🔑 Login', value: 'LOGIN', color: '#059669', bg: '#ecfdf5' },
    { label: '➕ Create', value: 'CREATE_EXERCISE', color: '#047857', bg: '#e6f4ea' },
    { label: '✏️ Update', value: 'UPDATE_EXERCISE', color: '#d97706', bg: '#fffbeb' },
    { label: '🗑️ Delete', value: 'DELETE_EXERCISE', color: '#dc2626', bg: '#fef2f2' },
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
            {/* 1. Search Box */}
            <TextField
              size="small"
              placeholder="ค้นหาชื่อผู้ใช้, IP หรือ Entity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ color: '#94a3b8', mr: 0.5 }}>
                      <Search size={18} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    bgcolor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    height: '44px',
                    fontSize: '14px',
                    '& fieldset': { border: 'none' },
                    '&:hover': { bgcolor: '#f1f5f9' },
                    transition: 'all 0.15s ease',
                  },
                },
              }}
              sx={{ minWidth: { xs: '100%', sm: 240 }, flex: { sm: 1 } }}
            />

            {/* 2. Start Date Picker */}
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
                        borderRadius: '12px',
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        height: '44px',
                        fontSize: '13px',
                        color: '#334155',
                        '& fieldset': { border: 'none' },
                        '&:hover': { bgcolor: '#f1f5f9' },
                        transition: 'all 0.15s ease',
                      },
                    },
                  }}
                  sx={{ minWidth: 150 }}
                />
              </Box>
            )}

            {/* 3. End Date Picker */}
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
                        borderRadius: '12px',
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        height: '44px',
                        fontSize: '13px',
                        color: '#334155',
                        '& fieldset': { border: 'none' },
                        '&:hover': { bgcolor: '#f1f5f9' },
                        transition: 'all 0.15s ease',
                      },
                    },
                  }}
                  sx={{ minWidth: 150 }}
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
            {/* ปุ่มล้างตัวกรอง (Reset Filters Button) */}
            {onReset && (
              <Button
                size="small"
                variant="outlined"
                onClick={onReset}
                disabled={!isFiltered}
                startIcon={<RotateCcw size={15} />}
                sx={{
                  height: '44px',
                  borderRadius: '12px',
                  px: 2,
                  borderColor: isFiltered ? '#cbd5e1' : '#e2e8f0',
                  color: isFiltered ? '#475569' : '#94a3b8',
                  bgcolor: isFiltered ? '#f8fafc' : 'transparent',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.825rem',
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                    borderColor: '#94a3b8',
                    color: '#0f172a',
                  },
                  transition: 'all 0.15s ease',
                }}
              >
                ล้างตัวกรอง
              </Button>
            )}

            {/* View Mode Switcher */}
            {onViewModeChange && (
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, nextMode) => {
                  if (nextMode) onViewModeChange(nextMode);
                }}
                size="small"
                sx={{
                  bgcolor: '#f1f5f9',
                  p: '3px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  '& .MuiToggleButton-root': {
                    border: 'none',
                    borderRadius: '9px',
                    px: 1.8,
                    py: 0.7,
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    color: '#64748b',
                    textTransform: 'none',
                    transition: 'all 0.15s ease-in-out',
                    '&.Mui-selected': {
                      bgcolor: '#ffffff',
                      color: '#2563eb',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                      fontWeight: 700,
                      '&:hover': { bgcolor: '#ffffff' },
                    },
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.5)' },
                  },
                }}
              >
                <ToggleButton value="timeline">
                  <Activity size={16} style={{ marginRight: 6 }} /> Timeline Stream
                </ToggleButton>
                <ToggleButton value="table">
                  <LayoutList size={16} style={{ marginRight: 6 }} /> Table Grid
                </ToggleButton>
              </ToggleButtonGroup>
            )}

            {/* Refresh Button */}
            <Tooltip title="รีเฟรชข้อมูล Log">
              <IconButton
                onClick={onRefresh}
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  height: '44px',
                  width: '44px',
                  bgcolor: '#f8fafc',
                  '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' },
                  transition: 'all 0.15s ease',
                }}
              >
                <RefreshCw size={18} color="#475569" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Quick Filter Chips Row */}
        <Box sx={{ mt: 2, pt: 1.8, borderTop: '1px stroke #f1f5f9', display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
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