import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CheckCircle2, Clock, PlayCircle, RotateCcw } from 'lucide-react';
import type { ExerciseItem } from '../types';

interface ExerciseRowProps {
  exercise: ExerciseItem;
  onSelectExercise?: (exerciseId: number) => void;
}

export const ExerciseRow: React.FC<ExerciseRowProps> = ({ exercise, onSelectExercise }) => {
  return (
    <Box
      onClick={() => onSelectExercise?.(exercise.exerciseId)}
      sx={{
        p: { xs: 2, sm: 2.25 },
        borderRadius: '16px',
        border: '1.5px solid',
        borderColor: exercise.isPassed ? '#a7f3d0' : '#f1f5f9',
        bgcolor: exercise.isPassed ? '#f0fdf4' : '#ffffff',
        fontFamily: 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        boxShadow: exercise.isPassed
          ? '0 2px 8px rgba(16, 185, 129, 0.06)'
          : '0 2px 6px rgba(15, 23, 42, 0.03)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateX(4px)',
          borderColor: exercise.isPassed ? '#10b981' : '#cbd5e1',
          boxShadow: exercise.isPassed
            ? '0 4px 14px rgba(16, 185, 129, 0.15)'
            : '0 4px 12px rgba(15, 23, 42, 0.08)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.25 }}>
        {/* State Badge Icon */}
        {exercise.isPassed ? (
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              bgcolor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={22} color="#059669" />
          </Box>
        ) : (
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              bgcolor: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                color: '#2563eb',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
              }}
            >
              #{exercise.orderNumber}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.35 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', fontFamily: 'inherit' }}>
              {exercise.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#f8fafc', px: 1, py: 0.25, borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <Clock size={13} color="#64748b" />
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontFamily: 'inherit', fontSize: '0.75rem' }}>
                {exercise.expectedTime} นาที
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', fontFamily: 'inherit' }}>
            {exercise.description}
          </Typography>
        </Box>
      </Box>

      {/* Action Button */}
      <Button
        size="small"
        variant={exercise.isPassed ? 'outlined' : 'contained'}
        startIcon={exercise.isPassed ? <RotateCcw size={15} /> : <PlayCircle size={15} />}
        sx={{
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '0.85rem',
          fontFamily: 'inherit',
          px: 2.25,
          py: 0.85,
          color: exercise.isPassed ? '#059669' : '#ffffff',
          borderColor: exercise.isPassed ? '#a7f3d0' : 'transparent',
          bgcolor: exercise.isPassed ? 'transparent' : '#2563eb',
          boxShadow: exercise.isPassed ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.25)',
          '&:hover': {
            bgcolor: exercise.isPassed ? 'rgba(16, 185, 129, 0.08)' : '#1d4ed8',
            borderColor: exercise.isPassed ? '#059669' : 'transparent',
          },
        }}
      >
        {exercise.isPassed ? 'ทำอีกครั้ง' : 'ทำโจทย์'}
      </Button>
    </Box>
  );
};

export default ExerciseRow;
