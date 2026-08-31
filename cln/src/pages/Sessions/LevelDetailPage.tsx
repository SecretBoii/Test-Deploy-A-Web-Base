import React, { useState, useEffect, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import SessionCard from './components/SessionCard';
import LevelSummaryCard from './components/LevelSummaryCard';
import { DIFFICULTY_LEVELS } from '../../constants/difficulty';
import type { SessionDetail } from './types';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { MainLayout } from '../../components/Layout/MainLayout';

export const LevelDetailPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { levelId } = useParams<{ levelId: string }>();
  const [sessionDetails, setSessionDetails] = useState<SessionDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // สกัดเอาตัวเลขจากระดับ เช่น 'level1' -> 1
  const levelMatch = levelId?.match(/^level(\d+)$/);
  const level = levelMatch ? parseInt(levelMatch[1], 10) : null;

  // ดึงข้อมูล Sessions ใน Level ที่ถูกเลือก
  useEffect(() => {
    if (level === null || isNaN(level) || !user) {
      return;
    }
    const fetchLevelSessions = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/exercises/level-sessions/${level}`, {
          params: { userId: user.userId },
        });
        setSessionDetails(res.data);
      } catch (err) {
        console.error('Failed to fetch level sessions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLevelSessions();
  }, [level, user?.userId]);

  if (level === null || isNaN(level)) {
    return <Navigate to="/sessions" replace />;
  }

  const currentMeta = DIFFICULTY_LEVELS[level];
  if (!currentMeta) {
    return <Navigate to="/sessions" replace />;
  }

  // Memoize level stats to avoid unnecessary recalculations on re-render
  const levelStats = useMemo(() => {
    const totalSessions = sessionDetails.length;
    const totalExercises = sessionDetails.reduce((sum, s) => sum + s.totalExercises, 0);
    const completedExercises = sessionDetails.reduce((sum, s) => sum + s.completedExercises, 0);
    const levelPercent = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
    const totalDuration = sessionDetails.reduce((sum, s) => sum + s.duration, 0);

    return {
      totalSessions,
      totalExercises,
      completedExercises,
      levelPercent,
      totalDuration,
    };
  }, [sessionDetails]);

  return (
    <MainLayout activeItem="Sessions">
      <Box sx={{ p: 2.5, maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 3.5, width: '100%', color: '#0f172a' }}>
        {/* 1. Header Bar ด้านบน */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Breadcrumbs & Back link */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              onClick={() => navigate('/sessions')}
              startIcon={<ArrowLeft size={16} />}
              sx={{
                color: '#64748b',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                p: 0,
                minWidth: 'auto',
                '&:hover': { color: '#0f172a', bgcolor: 'transparent' },
              }}
            >
              ย้อนกลับ
            </Button>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.85rem' }}>
              / ระดับ {level}
            </Typography>
          </Box>

          {/* Level Header Title & Description */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', fontFamily: 'inherit' }}>
              {currentMeta.label}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'inherit', maxWidth: '800px' }}>
              {currentMeta.description}
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={36} />
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2.2fr 1.1fr' }, gap: 3.5 }}>
            {/* Left Column: Sessions List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {sessionDetails.map((session) => (
                <SessionCard
                  key={session.sessionId}
                  session={session}
                  levelColor={currentMeta?.color}
                  onSelectExercise={(exerciseId) => {
                    navigate(`/editor/${exerciseId}?sessionId=${session.sessionId}`)
                  }}
                />
              ))}
            </Box>

            {/* Right Column: Level Summary Sidebar */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <LevelSummaryCard
                level={level}
                totalSessions={levelStats.totalSessions}
                totalExercises={levelStats.totalExercises}
                completedExercises={levelStats.completedExercises}
                levelPercent={levelStats.levelPercent}
                totalDuration={levelStats.totalDuration}
              />
            </Box>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
};

export default LevelDetailPage;
