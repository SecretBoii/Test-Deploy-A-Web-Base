import React from 'react';
import { Box, Typography, Card, LinearProgress } from '@mui/material';
import { Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import type { SessionDetail } from '../../types';
import ExerciseRow from './ExerciseRow';

interface SessionCardProps {
  session: SessionDetail;
  levelColor?: string;
  onSelectExercise?: (exerciseId: number, sessionId: number) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  levelColor = '#2563eb',
  onSelectExercise,
}) => {
  const progressPercent = session.totalExercises > 0
    ? (session.completedExercises / session.totalExercises) * 100
    : 0;

  return (
    <Card
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
        bgcolor: '#ffffff',
        fontFamily: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ flex: 1, minWidth: '240px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '10px',
                bgcolor: `${levelColor}15`,
                color: levelColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.15rem', fontFamily: 'inherit' }}>
              {session.sessionName}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', fontFamily: 'inherit', pl: '42px' }}>
            {session.sessionObjective}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#f8fafc', px: 2, py: 1, borderRadius: '12px', border: '1px solid #f1f5f9' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#64748b' }}>
            <Clock size={15} />
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.8rem', fontFamily: 'inherit' }}>
              ~{session.duration} นาที
            </Typography>
          </Box>
          <Box sx={{ width: '1px', height: '14px', bgcolor: '#cbd5e1' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: session.completedExercises === session.totalExercises ? '#16a34a' : '#2563eb' }}>
            <CheckCircle2 size={15} />
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8rem', fontFamily: 'inherit' }}>
              {session.completedExercises} / {session.totalExercises} ข้อ
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.75rem', fontFamily: 'inherit' }}>
            ความคืบหน้าของบทเรียน
          </Typography>
          <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 700, fontSize: '0.75rem', fontFamily: 'inherit' }}>
            {Math.round(progressPercent)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: '#f1f5f9',
            '& .MuiLinearProgress-bar': { bgcolor: levelColor, borderRadius: 3 },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {session.exercises.map((exercise) => (
          <ExerciseRow
            key={exercise.exerciseId}
            exercise={exercise}
            onSelectExercise={(exId) => onSelectExercise?.(exId, session.sessionId)}
          />
        ))}
      </Box>
    </Card>
  );
};

export default SessionCard;
