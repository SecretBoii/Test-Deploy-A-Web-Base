import { useState } from 'react';
import { Paper, Box, Chip, Typography, Button, Grid } from '@mui/material';
import { Clock, Copy, Check, Code } from 'lucide-react';
import type { StudentActivityItem } from '../../../api/reports';
import { parseErrorType, getErrorBadgeStyle, formatThaiTime } from '../StudentErrorReportDetailPage';

interface ExerciseErrorActivityItemProps {
  activity: StudentActivityItem;
  runNumber: number;
  onInspect: (activity: StudentActivityItem) => void;
}

export function ExerciseErrorActivityItem({
  activity,
  runNumber,
  onInspect,
}: ExerciseErrorActivityItemProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const errType = parseErrorType(activity.exceptionMessage);
  const style = getErrorBadgeStyle(errType);

  const handleCopyCode = () => {
    if (!activity.answer) return;
    navigator.clipboard.writeText(activity.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        bgcolor: '#f8fafc',
        transition: 'box-shadow 0.15s ease',
        '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
          <Chip
            label={`รันครั้งที่ ${runNumber}`}
            size="small"
            sx={{ bgcolor: '#ffffff', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '11px' }}
          />
          <Chip
            label={errType}
            size="small"
            sx={{ bgcolor: style.bg, color: style.color, border: `1px solid ${style.border}`, fontWeight: 700, fontSize: '11.5px' }}
          />
          <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Clock size={13} /> {formatThaiTime(activity.submittedAt)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            onClick={handleCopyCode}
            sx={{
              fontSize: '11.5px',
              textTransform: 'none',
              bgcolor: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#475569',
              borderRadius: '6px',
              py: 0.2,
            }}
          >
            {copied ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}
          </Button>
          <Button
            size="small"
            startIcon={<Code size={13} />}
            onClick={() => onInspect(activity)}
            sx={{
              fontSize: '11.5px',
              textTransform: 'none',
              bgcolor: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#2563eb',
              fontWeight: 700,
              borderRadius: '6px',
              py: 0.2,
            }}
          >
            ตรวจโค้ดเต็มจอ
          </Button>
        </Box>
      </Box>

      {/* กล่องโค้ดภาษา Python คู่กับข้อความ Error Traceback */}
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            sx={{
              bgcolor: '#0f172a',
              color: '#f8fafc',
              p: 1.8,
              borderRadius: '8px',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '12px',
              lineHeight: 1.5,
              maxHeight: '200px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {activity.answer || '# ไม่มีข้อมูลโค้ด'}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              bgcolor: '#ffffff',
              color: '#dc2626',
              p: 1.8,
              borderRadius: '8px',
              border: '1px solid #fecdd3',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '12px',
              lineHeight: 1.5,
              maxHeight: '200px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {activity.exceptionMessage || 'ไม่พบข้อความ Error'}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
