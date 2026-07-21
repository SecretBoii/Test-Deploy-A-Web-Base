import React from 'react';
import { Box, Typography, Card, Chip, LinearProgress } from '@mui/material';
import { BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';

export interface LevelProgress {
  level: number;
  totalSessions: number;
  totalHours: number;
  totalExercises: number;
  completedExercises: number;
}

interface LevelCardProps {
  progressData: LevelProgress;
  onClick?: (level: number) => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({ progressData, onClick }) => {
  const meta = DIFFICULTY_LEVELS[progressData.level] || {
    label: `Lv.${progressData.level}`,
    description: 'ระดับการเรียนรู้',
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
  };

  const progressPercent =
    progressData.totalExercises > 0
      ? (progressData.completedExercises / progressData.totalExercises) * 100
      : 0;

  return (
    <Card
      onClick={() => onClick?.(progressData.level)}
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        cursor: 'pointer',
        fontFamily: "'Prompt', 'Plus Jakarta Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 14px 28px -6px ${meta.color}20, 0 10px 10px -6px rgba(0, 0, 0, 0.04)`,
          borderColor: meta.color,
          '& .arrow-icon': {
            transform: 'translateX(4px)',
            color: meta.color,
          },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '6px',
          height: '100%',
          bgcolor: meta.color,
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: 0.5 }}>
        {/* Header Row: Badge & Description & Meta stats */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
          {/* Left Block: Badge & Description */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              label={meta.label}
              sx={{
                fontWeight: 700,
                fontSize: '0.8rem',
                fontFamily: 'inherit',
                color: meta.color,
                bgcolor: meta.bg,
                border: `1.5px solid ${meta.border}`,
                borderRadius: '8px',
                height: 28,
                px: 0.5,
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', fontFamily: 'inherit' }}>
              {meta.description}
            </Typography>
          </Box>

          {/* Right Block: Sessions count & Arrow */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: '#f8fafc', px: 1.25, py: 0.4, borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <BookOpen size={14} color="#64748b" />
              <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'inherit', color: '#475569', fontSize: '0.8rem' }}>
                {progressData.totalSessions} Sessions
              </Typography>
            </Box>

            <ArrowRight size={18} className="arrow-icon" style={{ transition: 'transform 0.2s ease, color 0.2s ease', color: '#94a3b8' }} />
          </Box>
        </Box>

        {/* Progress Bar Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CheckCircle2 size={15} color={meta.color} />
              <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'inherit' }}>
                ความก้าวหน้า
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'inherit' }}>
              {progressData.completedExercises}/{progressData.totalExercises} ข้อ{' '}
              <Typography component="span" sx={{ color: meta.color, fontWeight: 700, fontSize: 'inherit', fontFamily: 'inherit' }}>
                ({Math.round(progressPercent)}%)
              </Typography>
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: '#f1f5f9',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: meta.color,
                boxShadow: `0 2px 6px ${meta.color}40`,
              },
            }}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default LevelCard;
