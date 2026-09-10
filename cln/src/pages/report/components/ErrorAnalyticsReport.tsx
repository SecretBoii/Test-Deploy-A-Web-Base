import { Paper, Typography, Box, Grid, LinearProgress, Chip } from '@mui/material';
import { AlertTriangle, CheckCircle, Bug, Activity, Layers } from 'lucide-react';
import type { ErrorAnalyticsData } from '../../../api/reports';

interface ErrorAnalyticsReportProps {
  data: ErrorAnalyticsData[];
  isLoading: boolean;
}

// ฟังก์ชันช่วยกำหนดธีมสีและป้ายบอกหมวดหมู่ของ Exception แต่ละประเภท
const getErrorTheme = (errorType: string, index: number = 0) => {
  if (errorType.includes('Syntax') || errorType.includes('Indentation')) {
    return {
      chipBg: '#fffbe6', chipColor: '#b45309', chipBorder: '#fde68a',
      cardBorder: '#fef08a', barColor: '#d97706', barBg: '#fffbeb',
      headerColor: '#92400e', iconColor: '#d97706', textColor: '#fbbf24', label: 'ไวยากรณ์ (Syntax)'
    };
  }
  if (errorType.includes('Runtime') || errorType.includes('ZeroDivision') || errorType.includes('Recursion')) {
    return {
      chipBg: '#fff1f2', chipColor: '#be123c', chipBorder: '#fecdd3',
      cardBorder: '#ffe4e6', barColor: '#e11d48', barBg: '#fef2f2',
      headerColor: '#9f1239', iconColor: '#e11d48', textColor: '#f87171', label: 'การทำงาน (Runtime)'
    };
  }
  if (errorType.includes('Name') || errorType.includes('Type') || errorType.includes('Value')) {
    return {
      chipBg: '#f5f3ff', chipColor: '#6d28d9', chipBorder: '#ddd6fe',
      cardBorder: '#ede9fe', barColor: '#7c3aed', barBg: '#faf5ff',
      headerColor: '#5b21b6', iconColor: '#7c3aed', textColor: '#c084fc', label: 'ตัวแปร/ชนิดข้อมูล (Type/Name)'
    };
  }
  if (errorType.includes('Index') || errorType.includes('Key') || errorType.includes('Attribute')) {
    return {
      chipBg: '#f0f9ff', chipColor: '#0369a1', chipBorder: '#bae6fd',
      cardBorder: '#e0f2fe', barColor: '#0284c7', barBg: '#f0f9ff',
      headerColor: '#075985', iconColor: '#0284c7', textColor: '#38bdf8', label: 'ดัชนี/คีย์ (Index/Key)'
    };
  }
  
  const fallbacks = [
    { chipBg: '#fff1f2', chipColor: '#be123c', chipBorder: '#fecdd3', cardBorder: '#ffe4e6', barColor: '#e11d48', barBg: '#fef2f2', headerColor: '#9f1239', iconColor: '#e11d48', textColor: '#f87171', label: 'การทำงาน (Runtime)' },
    { chipBg: '#f5f3ff', chipColor: '#6d28d9', chipBorder: '#ddd6fe', cardBorder: '#ede9fe', barColor: '#7c3aed', barBg: '#faf5ff', headerColor: '#5b21b6', iconColor: '#7c3aed', textColor: '#c084fc', label: 'ตัวแปร (Variables)' },
    { chipBg: '#fffbe6', chipColor: '#b45309', chipBorder: '#fde68a', cardBorder: '#fef08a', barColor: '#d97706', barBg: '#fffbeb', headerColor: '#92400e', iconColor: '#d97706', textColor: '#fbbf24', label: 'ไวยากรณ์ (Syntax)' },
    { chipBg: '#ecfdf5', chipColor: '#047857', chipBorder: '#a7f3d0', cardBorder: '#d1fae5', barColor: '#10b981', barBg: '#ecfdf5', headerColor: '#065f46', iconColor: '#10b981', textColor: '#34d399', label: 'ระบบ (System)' },
  ];
  return fallbacks[index % fallbacks.length];
};

export function ErrorAnalyticsReport({ data, isLoading }: ErrorAnalyticsReportProps) {
  // คำนวณภาพรวมสถิติ Exception
  const totalOccurrences = data.reduce((acc, curr) => acc + curr.occurrenceCount, 0);
  const topError = data.length > 0 ? [...data].sort((a, b) => b.occurrenceCount - a.occurrenceCount)[0] : null;

  return (
    <Box>
      {/* Header สรุปข้อผิดพลาด */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.5 }}>
        <Box sx={{ p: 1, bgcolor: '#fff1f2', borderRadius: '8px', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertTriangle size={18} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
          รายงานสถิติข้อผิดพลาดและ Exceptions ภาษาไพทอน ({data.length} ประเภท)
        </Typography>
      </Box>

      {/* Top KPI Analytics Summary Cards */}
      {!isLoading && data.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#f8fafc', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ p: 1, bgcolor: '#fee2e2', color: '#dc2626', borderRadius: '8px' }}>
                <Bug size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>พบบ่อยที่สุด</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{topError?.errorType || '-'}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#f8fafc', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ p: 1, bgcolor: '#e0f2fe', color: '#0284c7', borderRadius: '8px' }}>
                <Activity size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>จำนวนเกิดขึ้นทั้งหมด</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{totalOccurrences} ครั้ง</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#f8fafc', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ p: 1, bgcolor: '#f3e8ff', color: '#9333ea', borderRadius: '8px' }}>
                <Layers size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>หมวดหมู่ Error ที่พบ</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{data.length} หมวด</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Grid รายการข้อผิดพลาดที่พบในระบบ - ขอบมน 16px ตามแบบ Student Home */}
      <Grid container spacing={2.5}>
        {isLoading ? (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ py: 6, textAlign: 'center', maxWidth: 300, mx: 'auto' }}>
              <LinearProgress sx={{ borderRadius: 3, height: 8, bgcolor: '#fef2f2', '& .MuiLinearProgress-bar': { bgcolor: '#ef4444', borderRadius: 3 } }} />
              <Typography variant="caption" sx={{ color: '#64748b', mt: 1, display: 'block' }}>กำลังโหลดวิเคราะห์ข้อผิดพลาด...</Typography>
            </Box>
          </Grid>
        ) : data.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ py: 6, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <CheckCircle size={36} color="#10b981" style={{ marginBottom: 8 }} />
              <Typography sx={{ color: '#64748b', fontWeight: 700, fontSize: '14px' }}>ไม่พบประวัติข้อผิดพลาดในระบบ</Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>นักเรียนสามารถรันโค้ดและผ่านโจทย์โดยไม่มี Exception รุนแรง</Typography>
            </Box>
          </Grid>
        ) : (
          data.map((err, index) => {
            const theme = getErrorTheme(err.errorType, index);
            return (
              <Grid size={{ xs: 12, md: 6 }} key={err.errorType}>
                <Paper 
                  sx={{ 
                    p: 2.5, 
                    borderRadius: '16px', 
                    border: `1px solid ${theme.cardBorder}`, 
                    bgcolor: '#ffffff',
                    boxShadow: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.8,
                    transition: 'all 0.25s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(15, 23, 42, 0.05)',
                    }
                  }}
                >
                  {/* Error Header & Occurrence Chip */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AlertTriangle size={18} color={theme.iconColor} />
                      <Typography sx={{ fontWeight: 700, fontSize: '15px', color: theme.headerColor }}>{err.errorType}</Typography>
                    </Box>
                    <Chip
                      label={`${err.occurrenceCount} ครั้ง (${err.percentage.toFixed(1)}%)`}
                      size="small"
                      sx={{
                        bgcolor: theme.chipBg,
                        color: theme.chipColor,
                        border: `1px solid ${theme.chipBorder}`,
                        fontWeight: 700,
                        borderRadius: '8px',
                        fontSize: '12px',
                        px: 0.5,
                      }}
                    />
                  </Box>

                  {/* Progress Bar ของข้อผิดพลาด */}
                  <LinearProgress 
                    variant="determinate" 
                    value={err.percentage} 
                    sx={{ height: 7, borderRadius: 3, bgcolor: theme.barBg, '& .MuiLinearProgress-bar': { bgcolor: theme.barColor, borderRadius: 3 } }}
                  />

                  {/* กล่อง Terminal จำลองแสดง Exception Message (มุมมน 12px) */}
                  <Box sx={{ p: 2, bgcolor: '#0f172a', borderRadius: '12px', color: '#f8fafc' }}>
                    <Typography sx={{ fontFamily: 'Consolas, Monaco, "Courier New", monospace', fontSize: '12px', color: theme.textColor, wordBreak: 'break-all', lineHeight: 1.5 }}>
                      {err.commonExceptionMessage || 'ไม่มีตัวอย่างข้อความสถิติ'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
}




