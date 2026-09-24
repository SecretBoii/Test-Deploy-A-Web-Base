import { Card, Box, Typography, Chip } from '@mui/material';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';
import type { ExerciseStudentBreakdownResponse } from '../../../api/reports';

interface ExerciseHeaderCardProps {
  exercise: ExerciseStudentBreakdownResponse['exercise'];
}

export function ExerciseHeaderCard({ exercise }: ExerciseHeaderCardProps) {
  const diffMeta = DIFFICULTY_LEVELS[exercise.difficultyLevel] || {
    label: `Lv.${exercise.difficultyLevel}`,
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd'
  };

  return (
    <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: '#ffffff' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
            {exercise.title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            หัวข้อบทเรียน: <strong>{exercise.topic}</strong> • เวลาที่กำหนด: <strong>{exercise.expectedTime} นาที</strong>
          </Typography>
          {exercise.objective && (
            <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 1 }}>
              วัตถุประสงค์: {exercise.objective}
            </Typography>
          )}
        </Box>
        <Chip
          label={`Lv.${exercise.difficultyLevel} - ${diffMeta.label}`}
          sx={{
            bgcolor: diffMeta.bg,
            color: diffMeta.color,
            border: `1px solid ${diffMeta.border}`,
            fontWeight: 700,
            fontSize: '13px',
            borderRadius: '8px',
            py: 2,
            px: 1,
          }}
        />
      </Box>
    </Card>
  );
}
