import React from 'react';
import { Box, Typography, Card, LinearProgress } from '@mui/material';
import { Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import type { SessionDetail } from '../types';
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
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
        fontFamily: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Session Header Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Sparkles size={18} color={levelColor} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', fontFamily: 'inherit' }}>
              {session.sessionName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: '#f8fafc', px: 1.25, py: 0.4, borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <Clock size={14} color="#64748b" />
            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, fontSize: '0.78rem', fontFamily: 'inherit' }}>
              เวลาที่คาดหวัง ~{session.duration} นาที
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem', fontFamily: 'inherit', pl: 3.25 }}>
          {session.sessionObjective}
        </Typography>

        {/* Progress Bar Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5, pl: 3.5 }}>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              flexGrow: 1,
              maxWidth: 240,
              height: 9,
              borderRadius: 5,
              bgcolor: '#f1f5f9',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: levelColor,
                boxShadow: `0 2px 6px ${levelColor}40`,
              },
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CheckCircle2 size={15} color={progressPercent === 100 ? '#059669' : '#64748b'} />
            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'inherit' }}>
              {session.completedExercises}/{session.totalExercises} ข้อ
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Exercises List รายการโจทย์ย่อย */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1, borderTop: '1px dashed #e2e8f0' }}>
        {session.exercises.map((ex) => (
          <ExerciseRow
            key={ex.exerciseId}
            exercise={ex}
            onSelectExercise={(id) => onSelectExercise?.(id, session.sessionId)}
          />
        ))}
      </Box>
    </Card>
  );
};

export default SessionCard;
