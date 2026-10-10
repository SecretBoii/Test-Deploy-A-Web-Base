import { Box, Card, Typography, LinearProgress } from '@mui/material';

interface LevelProgress {
  level: number;
  completedExercises: number;
  totalExercises: number;
}

interface ProfileProgressProps {
  progress?: LevelProgress[];
}

const LEVEL_NAMES: Record<number, string> = {
  1: 'Lv.1 Remember',
  2: 'Lv.2 Understand',
  3: 'Lv.3 Apply',
  4: 'Lv.4 Analyze',
  5: 'Lv.5 Create',
};

const LEVEL_COLORS: Record<number, string> = {
  1: '#2563eb', // Blue
  2: '#0f766e', // Dark Green
  3: '#b45309', // Brown
  4: '#7c3aed', // Purple
  5: '#db2777', // Pink/Red
};

export function ProfileProgress({ progress }: ProfileProgressProps) {
  return (
    <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 3, boxShadow: 'none' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
          ความก้าวหน้า
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {progress?.map((lvl) => {
          const percent = lvl.totalExercises > 0 
            ? (lvl.completedExercises / lvl.totalExercises) * 100 
            : 0;
          
          return (
            <Box key={lvl.level}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 700, 
                    color: LEVEL_COLORS[lvl.level] || '#475569' 
                  }}
                >
                  {LEVEL_NAMES[lvl.level]}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                  {lvl.completedExercises} / {lvl.totalExercises}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{
                  height: 8,
                  borderRadius: '4px',
                  bgcolor: '#f1f5f9',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: LEVEL_COLORS[lvl.level] || '#475569',
                    borderRadius: '4px',
                  }
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Card>
  );
}
