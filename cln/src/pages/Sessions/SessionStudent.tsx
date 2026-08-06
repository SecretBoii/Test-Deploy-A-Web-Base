import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import LevelCard from './components/LevelCard';
import type { LevelSummary } from './types';
import { apiClient } from '../../api/client';

interface SessionStudentProps {
  userId?: number;
  onSelectLevel: (levelId: number) => void;
}

export const SessionStudent: React.FC<SessionStudentProps> = ({
  userId = 1,
  onSelectLevel,
}) => {
  const [levelsSummary, setLevelsSummary] = useState<LevelSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLevelsSummary();
  }, [userId]);

  const fetchLevelsSummary = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/exercises/levels-summary', {
        params: { userId },
      });
      setLevelsSummary(res.data);
    } catch (err) {
      console.error('Failed to fetch levels summary:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2.5, maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
        เลือกระดับความยากของบทเรียน (Learning Levels)
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={36} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          {levelsSummary.map((item) => (
            <LevelCard
              key={item.level}
              progressData={item}
              onClick={() => onSelectLevel(item.level)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SessionStudent;
