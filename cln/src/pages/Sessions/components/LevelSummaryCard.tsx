import React from 'react';
import { Card, Typography, Box, LinearProgress } from '@mui/material';
import { BookOpen, FileText, CheckCircle2, Clock } from 'lucide-react';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';

interface LevelSummaryCardProps {
  level: number;
  totalSessions: number;
  totalExercises: number;
  completedExercises: number;
  levelPercent: number;
  totalDuration: number;
}

interface StatItemProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  valueColor?: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, title, value, valueColor = '#0f172a' }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: '12px',
      border: '1px solid #f1f5f9',
      bgcolor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      gap: 0.5,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
      {icon}
      <Typography variant="caption" sx={{ fontWeight: 600 }}>{title}</Typography>
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 800, color: valueColor, mt: 0.5 }}>
      {value}
    </Typography>
  </Box>
);

export const LevelSummaryCard: React.FC<LevelSummaryCardProps> = ({
  level,
  totalSessions,
  totalExercises,
  completedExercises,
  levelPercent,
  totalDuration,
}) => {
  const currentMeta = DIFFICULTY_LEVELS[level];

  if (!currentMeta) return null;

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        bgcolor: '#ffffff',
        height: 'fit-content',
        position: { lg: 'sticky' },
        top: { lg: '24px' },
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', fontFamily: 'inherit' }}>
        สรุปความคืบหน้าของระดับนี้
      </Typography>

      {/* Level Badge Card */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2.25,
          p: 2,
          borderRadius: '16px',
          bgcolor: currentMeta.bg || '#eff6ff',
          border: `1.5px solid ${currentMeta.border || '#bfdbfe'}`,
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '12px',
            bgcolor: '#ffffff',
            color: currentMeta.color || '#2563eb',
            border: `1px solid ${currentMeta.border || '#e2e8f0'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.25rem',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          Lv{level}
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
            ระดับ {level}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
            ความยาก: {currentMeta.label}
          </Typography>
        </Box>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>
            ความสำเร็จรวมในระดับนี้
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: currentMeta.color }}>
            {levelPercent}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={levelPercent}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: '#f1f5f9',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              backgroundColor: currentMeta.color,
              boxShadow: `0 2px 6px ${currentMeta.color}40`,
            },
          }}
        />
      </Box>

      {/* Detailed Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
        }}
      >
        <StatItem icon={<BookOpen size={15} />} title="บทเรียน" value={totalSessions} />
        <StatItem icon={<FileText size={15} />} title="โจทย์ทั้งหมด" value={totalExercises} />
        <StatItem icon={<CheckCircle2 size={15} />} title="ผ่านแล้ว" value={completedExercises} valueColor="#059669" />
        <StatItem
          icon={<Clock size={15} />}
          title="เวลาโดยประมาณ"
          value={
            <>
              {totalDuration} <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>นาที</Typography>
            </>
          }
        />
      </Box>
    </Card>
  );
};

export default LevelSummaryCard;
