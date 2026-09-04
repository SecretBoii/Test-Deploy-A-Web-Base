import React from 'react';
import { Card, CardContent, Box, Stack, TextField, MenuItem, IconButton } from '@mui/material';
import { RefreshCw } from 'lucide-react';

interface AuditLogFilterProps {
  search: string;
  setSearch: (val: string) => void;
  actionFilter: string;
  setActionFilter: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onRefresh: () => void;
}

/**
 * Subcomponent สำหรับส่วน Filter / Search Form
 */
export const AuditLogFilter: React.FC<AuditLogFilterProps> = ({
  search,
  setSearch,
  actionFilter,
  setActionFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onSearch,
  onRefresh,
}) => {
  return (
    <Card sx={{ mb: 3, p: 1 }}>
      <CardContent>
        <Box component="form" onSubmit={onSearch}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
            <TextField
              size="small"
              label="ค้นหา (User, IP, Entity)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 220 }}
            />

            <TextField
              select
              size="small"
              label="Action Filter"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">ทั้งหมด</MenuItem>
              <MenuItem value="LOGIN">LOGIN</MenuItem>
              <MenuItem value="CREATE_EXERCISE">CREATE_EXERCISE</MenuItem>
              <MenuItem value="UPDATE_EXERCISE">UPDATE_EXERCISE</MenuItem>
              <MenuItem value="DELETE_EXERCISE">DELETE_EXERCISE</MenuItem>
            </TextField>

            <TextField
              type="date"
              size="small"
              label="ตั้งแต่วันที่"
              slotProps={{ inputLabel: { shrink: true } }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <TextField
              type="date"
              size="small"
              label="ถึงวันที่"
              slotProps={{ inputLabel: { shrink: true } }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <IconButton onClick={onRefresh} title="รีเฟรชข้อมูล">
              <RefreshCw size={18} />
            </IconButton>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};