import { Box, Typography, Card, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';

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
        fontFamily: "inherit",
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
                bgcolor: meta.bg || '#f1f5f9',
                color: meta.color || '#64748b',
                border: `1px solid ${meta.border || '#e2e8f0'}`,
                px: 0.8,
                py: 0.2,
                borderRadius: 1,
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              {meta.label}
            </Box>
            {progressPercent > 0 && (
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                • เสร็จสมบูรณ์ {Math.round(progressPercent)}%
              </Typography>
            )}
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mt: 0.5, fontFamily: 'inherit' }}>
            {meta.description}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.25, fontFamily: 'inherit' }}>
            {progressData.totalSessions} บทเรียน • {progressData.totalExercises} แบบฝึกหัด (ผ่านแล้ว {progressData.completedExercises} ข้อ)
          </Typography>
        </Box>

        {/* Action Button */}
        {progressPercent >= 100 ? (
          <Button
            variant="outlined"
            size="small"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              borderColor: '#16a34a',
              color: '#16a34a',
              bgcolor: '#f0fdf4',
              fontWeight: 600,
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              px: 2,
              py: 0.75,
              '&:hover': { bgcolor: '#dcfce7', borderColor: '#15803d' },
            }}
          >
            ทบทวนบทเรียน
          </Button>
        ) : progressPercent > 0 ? (
          <Button
            variant="outlined"
            size="small"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              borderColor: '#e2e8f0',
              color: '#2563eb',
              bgcolor: '#f8fafc',
              fontWeight: 600,
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              px: 2,
              py: 0.75,
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