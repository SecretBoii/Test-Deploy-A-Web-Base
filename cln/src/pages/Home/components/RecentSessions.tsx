import { Box, Card, Typography, Button, CircularProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';

interface RecentSessionsProps {
  loadingRecent: boolean;
  recentSessions: any[];
}

export function RecentSessions({ loadingRecent, recentSessions }: RecentSessionsProps) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
          บทเรียนล่าสุด
        </Typography>
        <Button
          size="small"
          onClick={() => navigate('/sessions')}
          sx={{ color: '#2563eb', textTransform: 'none', fontWeight: 600 }}
        >
          ดูทั้งหมด
        </Button>
      </Box>

      {loadingRecent ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={30} />
        </Box>
      ) : recentSessions.length > 0 ? (
        recentSessions.map((session) => {
          const nextExercise = session.exercises?.find((e: any) => !e.isPassed) || session.exercises?.[0];
          const percent = Math.round((session.completedExercises / session.totalExercises) * 100);
          
          return (
            <Card
              key={session.sessionId}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Level Badge */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '12px',
                    bgcolor: DIFFICULTY_LEVELS[session.targetLevel]?.bg || '#eff6ff',
                    color: DIFFICULTY_LEVELS[session.targetLevel]?.color || '#2563eb',
                    border: `1px solid ${DIFFICULTY_LEVELS[session.targetLevel]?.border || '#e2e8f0'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    flexShrink: 0,
                  }}
                >
                  {`Lv${session.targetLevel}`}
                </Box>

                {/* Info Content */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    <Box
                      component="span"
                      sx={{
                        bgcolor: DIFFICULTY_LEVELS[session.targetLevel]?.bg || '#f1f5f9',
                        color: DIFFICULTY_LEVELS[session.targetLevel]?.color || '#64748b',
                        border: `1px solid ${DIFFICULTY_LEVELS[session.targetLevel]?.border || '#e2e8f0'}`,
                        px: 0.8,
                        py: 0.2,
                        borderRadius: 1,
                        mr: 1,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}
                    >
                      {DIFFICULTY_LEVELS[session.targetLevel]?.label}
                    </Box>
                    • เสร็จสมบูรณ์ {percent}%
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mt: 0.5 }}>
                    {session.sessionName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                    {session.sessionObjective}
                  </Typography>
                </Box>

                {/* Continue Button */}
                {nextExercise && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/sessions?level=${session.targetLevel}`)}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      borderColor: '#e2e8f0',
                      color: '#2563eb',
                      bgcolor: '#f8fafc',
                      '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' },
                    }}
                  >
                    เรียนต่อ
                  </Button>
                )}
              </Box>

              {/* Bottom Progress Bar */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: `${percent}%`,
                  height: 3,
                  bgcolor: DIFFICULTY_LEVELS[session.targetLevel]?.color || '#2563eb',
                }}
              />
            </Card>
          );
        })
      ) : (
        <Card sx={{ p: 3, textAlign: 'center', color: '#64748b', border: '1px dashed #e2e8f0', borderRadius: '16px', boxShadow: 'none' }}>
          <Typography variant="body2">ไม่มีบทเรียนล่าสุด เริ่มทำโจทย์ได้เลยที่หน้าบทเรียน!</Typography>
        </Card>
      )}
    </Box>
  );
}
