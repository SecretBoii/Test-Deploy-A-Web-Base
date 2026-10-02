import React from 'react';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import { Play, Send, Clock, Inbox } from 'lucide-react';
import type { StudentActivityItem } from '../../../api/reports';
import { formatThaiDateTime } from '../../../utils/dateUtils';

export interface ActivityWithMeta {
  activity: StudentActivityItem;
  label: string;
  isSubmit: boolean;
  isRun: boolean;
  timestamp: string;
}

interface InspectionHistorySidebarProps {
  timeline: ActivityWithMeta[];
  selectedActivityId: number | null;
  onSelectActivity: (activityId: number) => void;
  filterType: 'all' | 'submit' | 'run';
  onFilterChange: (type: 'all' | 'submit' | 'run') => void;
  totalSubmits: number;
  totalRuns: number;
  totalCount: number;
}

export const InspectionHistorySidebar: React.FC<InspectionHistorySidebarProps> = ({
  timeline,
  selectedActivityId,
  onSelectActivity,
  filterType,
  onFilterChange,
  totalSubmits,
  totalRuns,
  totalCount,
}) => {
  return (
    <Box
      sx={{
        width: { xs: '100%', md: '310px' },
        borderRight: { xs: 'none', md: '1px solid #e2e8f0' },
        borderBottom: { xs: '1px solid #e2e8f0', md: 'none' },
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* ส่วนหัว Sidebar & ปุ่มฟิลเตอร์ */}
      <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '13px', mb: 1.2 }}>
          ลำดับประวัติการทำ ({totalCount} รอบ)
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, bgcolor: '#f1f5f9', p: '3px', borderRadius: '8px' }}>
          <Button
            size="small"
            onClick={() => onFilterChange('all')}
            sx={{
              flex: 1,
              fontSize: '11.5px',
              fontWeight: filterType === 'all' ? 700 : 500,
              textTransform: 'none',
              borderRadius: '6px',
              py: 0.3,
              bgcolor: filterType === 'all' ? '#ffffff' : 'transparent',
              color: filterType === 'all' ? '#0f172a' : '#64748b',
              boxShadow: filterType === 'all' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            ทั้งหมด ({totalCount})
          </Button>
          <Button
            size="small"
            onClick={() => onFilterChange('submit')}
            sx={{
              flex: 1,
              fontSize: '11.5px',
              fontWeight: filterType === 'submit' ? 700 : 500,
              textTransform: 'none',
              borderRadius: '6px',
              py: 0.3,
              bgcolor: filterType === 'submit' ? '#ffffff' : 'transparent',
              color: filterType === 'submit' ? '#0f172a' : '#64748b',
              boxShadow: filterType === 'submit' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Submit ({totalSubmits})
          </Button>
          <Button
            size="small"
            onClick={() => onFilterChange('run')}
            sx={{
              flex: 1,
              fontSize: '11.5px',
              fontWeight: filterType === 'run' ? 700 : 500,
              textTransform: 'none',
              borderRadius: '6px',
              py: 0.3,
              bgcolor: filterType === 'run' ? '#ffffff' : 'transparent',
              color: filterType === 'run' ? '#0f172a' : '#64748b',
              boxShadow: filterType === 'run' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Run ({totalRuns})
          </Button>
        </Box>
      </Box>

      {/* รายการประวัติใน Sidebar (Scrollable) */}
      <Box sx={{ overflowY: 'auto', maxHeight: '540px', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {timeline.length === 0 ? (
          <Box
            sx={{
              py: 8,
              px: 2,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.2,
            }}
          >
            <Inbox size={38} color="#94a3b8" />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px' }}>
              {filterType === 'submit' ? 'ยังไม่มีประวัติการส่งตรวจ' : 'ยังไม่มีประวัติการรันโค้ด'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11.5px', maxWidth: 200, lineHeight: 1.4 }}>
              {filterType === 'submit'
                ? 'ผู้เรียนยังไม่ได้กดส่งตรวจคำตอบ'
                : 'ผู้เรียนยังไม่ได้กดทดลองรันโค้ด'}
            </Typography>
          </Box>
        ) : (
          timeline.map((item) => {
            const isSelected = item.activity.activityId === selectedActivityId;
            const isSubmit = item.isSubmit;

            return (
              <Paper
                key={item.activity.activityId}
                elevation={0}
                onClick={() => onSelectActivity(item.activity.activityId)}
                sx={{
                  p: 1.5,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  bgcolor: isSelected ? '#eff6ff' : '#ffffff',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isSelected ? '#eff6ff' : '#f8fafc',
                    borderColor: isSelected ? '#2563eb' : '#cbd5e1',
                  },
                }}
              >
                {/* แถว 1: ป้ายประเภท (Submit/Run), ป้าย Best Score และคะแนน */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.8 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Chip
                      icon={isSubmit ? <Send size={12} /> : <Play size={12} />}
                      label={item.label}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: '11.5px',
                        height: '22px',
                        bgcolor: isSubmit ? '#dbeafe' : '#f1f5f9',
                        color: isSubmit ? '#1d4ed8' : '#475569',
                        border: `1px solid ${isSubmit ? '#bfdbfe' : '#e2e8f0'}`,
                        '& .MuiChip-icon': {
                          color: 'inherit',
                          ml: '4px',
                        },
                      }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '12.5px',
                      color: '#475569',
                    }}
                  >
                    {item.activity.score ?? 0}/100
                  </Typography>
                </Box>

                {/* แถว 2: เวลาของรอบนี้ */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Clock size={12} color="#94a3b8" />
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '11px' }}>
                    {formatThaiDateTime(item.timestamp)}
                  </Typography>
                </Box>
              </Paper>
            );
          })
        )}
      </Box>
    </Box>
  );
};
