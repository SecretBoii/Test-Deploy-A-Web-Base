import { Box, Typography, Card, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { DIFFICULTY_LEVELS } from '../../../../constants/difficulty';

export interface LevelProgress {
  level: number;
  totalSessions: number;
  totalHours: number;
  totalExercises: number;
  completedExercises: number;
  sessionName?: string;
  sessionObjective?: string;
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
        p: 2.5,
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: 'none',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
          borderColor: meta.color,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Level Badge */}
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '12px',
            bgcolor: meta.bg || '#eff6ff',
            color: meta.color || '#2563eb',
            border: `1px solid ${meta.border || '#e2e8f0'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.1rem',
            flexShrink: 0,
          }}
        >
          {`Lv${progressData.level}`}
        </Box>

        {/* Info Content */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Box
              component="span"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: meta.color || '#2563eb',
                bgcolor: meta.bg || '#eff6ff',
                px: 1,
                py: 0.25,
                borderRadius: '6px',
                border: `1px solid ${meta.border || '#bfdbfe'}`,
              }}
            >
              {meta.label}
            </Box>
          </Box>

          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: '#1e293b',
              mt: 0.5,
              fontSize: '0.9rem',
              fontFamily: 'inherit',
            }}
          >
            {meta.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.78rem', fontFamily: 'inherit' }}>
              {progressData.totalSessions} บทเรียน • {progressData.totalExercises} แบบฝึกหัด
              <Box component="span" sx={{ color: progressData.completedExercises > 0 ? '#16a34a' : '#64748b', ml: 0.5, fontWeight: 500 }}>
                (ผ่านแล้ว {progressData.completedExercises} ข้อ)
              </Box>
            </Typography>
          </Box>
        </Box>

        {/* Action Button */}
        {progressData.completedExercises === progressData.totalExercises && progressData.totalExercises > 0 ? (
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              borderColor: '#e2e8f0',
              color: '#16a34a',
              bgcolor: '#f0fdf4',
              fontWeight: 600,
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              px: 2,
              py: 0.75,
              pointerEvents: 'none',
            }}
          >
            ผ่านแล้ว
          </Button>
        ) : progressData.completedExercises > 0 ? (
          <Button
            variant="contained"
            size="small"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              bgcolor: '#f8fafc',
              color: '#1e293b',
              fontWeight: 600,
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              px: 2,
              py: 0.75,
              border: '1px solid #e2e8f0',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' },
            }}
          >
            เรียนต่อ
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              bgcolor: '#2563eb',
              color: '#ffffff',
              fontWeight: 600,
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              px: 2,
              py: 0.75,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1d4ed8' },
            }}
          >
            เรียน
          </Button>
        )}
      </Box>

      {/* Bottom Progress Bar */}
      {progressPercent > 0 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: `${progressPercent}%`,
            height: 3,
            bgcolor: meta.color || '#2563eb',
          }}
        />
      )}
    </Card>
  );
};

export default LevelCard;
