import { Box, Card, Typography, LinearProgress } from '@mui/material';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';

interface LevelProgressProps {
  levelsSummary: any[];
}

export function LevelProgress({ levelsSummary }: LevelProgressProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Spacer to align card top with the first Recent Lesson card on desktop */}
      <Box sx={{ height: { xs: 0, lg: '52px' } }} />
      <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
          ความคืบหน้าตามระดับ
        </Typography>

        {levelsSummary.map((lvl) => {
          const val = lvl.totalExercises > 0 ? Math.round((lvl.completedExercises / lvl.totalExercises) * 100) : 0;
          const levelLabel = DIFFICULTY_LEVELS[lvl.level]?.label || `ระดับ ${lvl.level}`;
          const levelColor = DIFFICULTY_LEVELS[lvl.level]?.color || '#1d4ed8';

          return (
            <Box key={lvl.level} sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: val > 0 ? '#334155' : '#94a3b8' }}>
                  • {levelLabel}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, color: val > 0 ? '#334155' : '#94a3b8' }}>
                  {val}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={val}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: '#f1f5f9',
                  '& .MuiLinearProgress-bar': { bgcolor: levelColor },
                }}
              />
            </Box>
          );
        })}
      </Card>
    </Box>
  );
}
