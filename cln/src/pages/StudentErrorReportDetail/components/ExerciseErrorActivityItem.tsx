import { Paper, Box, Chip, Typography, Button, Grid } from '@mui/material';
import type { StudentActivityItem } from '../../../api/reports';
import { parseErrorType, getErrorBadgeStyle, formatThaiTime } from '../StudentErrorReportDetailPage';

interface ExerciseErrorActivityItemProps {
  activity: StudentActivityItem & { parsedErrorType?: string };
  runNumber: number;
  onInspect: (activity: StudentActivityItem) => void;
}

export function ExerciseErrorActivityItem({
  activity,
  runNumber,
  onInspect,
}: ExerciseErrorActivityItemProps) {
  const errType = activity.parsedErrorType || parseErrorType(activity.exceptionMessage);
  const style = getErrorBadgeStyle(errType);

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        boxShadow: 'none',
        transition: 'box-shadow 0.15s ease',
        '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
          <Chip
            label={`รันครั้งที่ ${runNumber}`}
            size="small"
            sx={{ bgcolor: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', fontWeight: 600, fontSize: '11px' }}
          />
          <Chip
            label={errType}
            size="small"
            sx={{ bgcolor: style.bg, color: style.color, border: `1px solid ${style.border}`, fontWeight: 700, fontSize: '11.5px' }}
          />
          <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {formatThaiTime(activity.submittedAt)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          onClick={() => onInspect(activity)}
          sx={{
            fontSize: '11.5px',
            textTransform: 'none',
            bgcolor: '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
            borderRadius: '8px',
            boxShadow: 'none',
            py: 0.4,
            px: 1.4,
            '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' },
          }}
        >
          ตรวจโค้ดละเอียด
        </Button>
      </Box>

      {/* กล่องโค้ดภาษา Python คู่กับข้อความ Error Traceback พร้อมหัวข้อกำกับชัดเจน */}
      <Grid container spacing={1.5} sx={{ alignItems: 'stretch' }}>
        {/* ฝั่งซ้าย: ซอร์สโค้ด Python */}
        <Grid size={{ xs: 12, md: 7 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.6 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', fontSize: '11.5px' }}>
              โค้ดภาษา Python ที่ส่งตรวจ:
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              bgcolor: '#0f172a',
              color: '#f8fafc',
              p: 1.8,
              borderRadius: '8px',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '12px',
              lineHeight: 1.5,
              minHeight: '80px',
              maxHeight: '220px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              border: '1px solid #1e293b',
            }}
          >
            {activity.answer || '# ไม่มีข้อมูลโค้ด'}
          </Box>
        </Grid>

        {/* ฝั่งขวา: ข้อผิดพลาด Exception Traceback (สไตล์ Monochrome ขาวคลีน ไร้สีจาง) */}
        <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.6 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', fontSize: '11.5px' }}>
              ข้อความ Error Traceback:
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              bgcolor: '#ffffff',
              color: '#0f172a',
              p: 1.8,
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '12px',
              lineHeight: 1.5,
              minHeight: '80px',
              maxHeight: '220px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              fontWeight: 500,
            }}
          >
            {activity.exceptionMessage || 'ไม่พบข้อความ Error'}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
