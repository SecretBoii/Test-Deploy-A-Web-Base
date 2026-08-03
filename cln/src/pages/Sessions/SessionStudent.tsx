import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import LevelCard from './components/LevelCard';
import SessionCard from './components/SessionCard';
import { DIFFICULTY_LEVELS } from '../../constants/difficulty';
import type { LevelSummary, SessionDetail } from './types';
import { apiClient } from '../../api/client';

interface SessionStudentProps {
  userId?: number;
  onSelectExercise?: (exerciseId: number, sessionId: number) => void;
  initialLevel?: number | null;
}

export const SessionStudent: React.FC<SessionStudentProps> = ({
  userId = 1,
  onSelectExercise,
  initialLevel = null,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [levelsSummary, setLevelsSummary] = useState<LevelSummary[]>([]);
  const [sessionDetails, setSessionDetails] = useState<SessionDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. ดึงข้อมูลสรุปแต่ละ Level
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

  // 2. ดึงข้อมูล Sessions ใน Level ที่ถูกเลือก
  const handleSelectLevel = async (level: number) => {
    setSelectedLevel(level);
    try {
      setLoading(true);
      const res = await apiClient.get(`/exercises/level-sessions/${level}`, {
        params: { userId },
      });
      setSessionDetails(res.data);
    } catch (err) {
      console.error('Failed to fetch level sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialLevel) {
      handleSelectLevel(initialLevel);
    } else {
      setSelectedLevel(null);
    }
  }, [initialLevel, userId]);

  const currentMeta = selectedLevel ? DIFFICULTY_LEVELS[selectedLevel] : null;

  return (
    <Box sx={{ p: 2.5, maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {!selectedLevel ? (
        <>
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
                  onClick={() => handleSelectLevel(item.level)}
                />
              ))}
            </Box>
          )}
        </>
      ) : (
        <>
          {/* Header Bar ด้านบน */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Button
              startIcon={<ArrowLeft size={18} />}
              onClick={() => setSelectedLevel(null)}
              sx={{
                color: '#475569',
                fontWeight: 600,
                textTransform: 'none',
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                px: 2,
                py: 0.75,
                '&:hover': { bgcolor: '#f8fafc' },
              }}
            >
              กลับ
            </Button>

            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: currentMeta?.color || '#0f172a' }}>
              {currentMeta?.label} — {(sessionDetails[0]?.sessionName || currentMeta?.description || '').replace(/^บทเรียนที่\s*\d+\s*:\s*/, '')}
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={36} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {sessionDetails.map((session) => (
                <SessionCard
                  key={session.sessionId}
                  session={session}
                  levelColor={currentMeta?.color}
                  onSelectExercise={onSelectExercise}
                />
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default SessionStudent;
