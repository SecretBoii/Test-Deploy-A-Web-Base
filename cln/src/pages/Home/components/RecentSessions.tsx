import { Box, Card, Typography, Button, Skeleton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';

export interface RecentSessionItem {
  sessionId: number;
  sessionName: string;
  sessionObjective?: string;
  targetLevel: number;
  completedExercises: number;
  totalExercises: number;
  exercises?: Array<{
    exerciseId: number;
    title: string;
    isPassed: boolean;
  }>;
}

interface RecentSessionsProps {
  loadingRecent: boolean;
  recentSessions: RecentSessionItem[];
}

export function RecentSessions({ loadingRecent, recentSessions }: RecentSessionsProps) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* ส่วนหัวแสดงชื่อหมวดและปุ่มดูทั้งหมด */}
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
        <Card
          sx={{
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="rounded" width={52} height={52} sx={{ borderRadius: '12px' }} animation="wave" />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="45%" height={24} animation="wave" />
              <Skeleton width="70%" height={16} animation="wave" sx={{ mt: 0.5 }} />
            </Box>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Skeleton width={80} height={16} animation="wave" />
              <Skeleton width={40} height={16} animation="wave" />
            </Box>
            <Skeleton width="100%" height={6} animation="wave" sx={{ borderRadius: 3 }} />
          </Box>
        </Card>
      ) : recentSessions.length > 0 ? (
        recentSessions.map((session) => {
          const nextExercise = session.exercises?.find((e) => !e.isPassed) || session.exercises?.[0];
          const percent = session.totalExercises > 0 
            ? Math.round((session.completedExercises / session.totalExercises) * 100) 
            : 0;
          
          return (
            <Card
              key={session.sessionId}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                bgcolor: '#ffffff',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* กล่องแสดง Badge ประจำระดับความยาก */}
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '12px',
                    bgcolor: DIFFICULTY_LEVELS[session.targetLevel]?.bg || '#eff6ff',
                    color: DIFFICULTY_LEVELS[session.targetLevel]?.color || '#2563eb',
                    border: `1px solid ${DIFFICULTY_LEVELS[session.targetLevel]?.border || '#e2e8f0'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    flexShrink: 0,
                  }}
                >
                  {`Lv${session.targetLevel}`}
                </Box>

                {/* รายละเอียดเนื้อหาบทเรียน */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
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
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mt: 0.5 }} noWrap>
                    {session.sessionName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }} noWrap>
                    {session.sessionObjective || 'ฝึกทักษะการเขียนโปรแกรม Python'}
                  </Typography>
                </Box>

                {/* ปุ่มลัดเข้าทำโจทย์ข้อถัดไปใน Editor ทันที พร้อมส่ง sessionId ไปกับ Query Param */}
                {nextExercise && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      navigate(
                        `/editor/${nextExercise.exerciseId}?sessionId=${session.sessionId}`,
                      )
                    }
                    endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      borderColor: '#cbd5e1',
                      color: '#2563eb',
                      bgcolor: '#ffffff',
                      fontWeight: 600,
                      fontSize: '12.5px',
                      px: 1.5,
                      py: 0.6,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      '&:hover': { bgcolor: '#eff6ff', borderColor: '#93c5fd' },
                    }}
                  >
                    {session.totalExercises > 0 &&
                    session.completedExercises === session.totalExercises
                      ? 'ทบทวน'
                      : 'เรียนต่อ'}
                  </Button>
                )}
              </Box>

              {/* แถบ Progress Bar ขอบล่างของการ์ด */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: `${percent}%`,
                  height: 3,
                  bgcolor: DIFFICULTY_LEVELS[session.targetLevel]?.color || '#2563eb',
                  transition: 'width 0.4s ease',
                }}
              />
            </Card>
          );
        })
      ) : (
        <Card sx={{ p: 4, textAlign: 'center', color: '#64748b', border: '1px dashed #cbd5e1', borderRadius: '16px', bgcolor: '#ffffff', boxShadow: 'none' }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            ไม่มีบทเรียนล่าสุด เริ่มทำโจทย์ได้เลยที่หน้าบทเรียน!
          </Typography>
        </Card>
      )}
    </Box>
  );
}
