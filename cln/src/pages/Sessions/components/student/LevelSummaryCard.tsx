import React from 'react';
import { Card, Typography, Box, LinearProgress } from '@mui/material';
import { BookOpen, FileText, CheckCircle2, Clock } from 'lucide-react';
import { DIFFICULTY_LEVELS } from '../../../../constants/difficulty';

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
      bgcolor: '#f8fafc',
      borderRadius: '16px',
      border: '1px solid #f1f5f9',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    }}
  >
    <Box sx={{ p: 1.25, bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </Box>
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 0.25, fontSize: '0.75rem', fontFamily: 'inherit' }} noWrap>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 800, color: valueColor, lineHeight: 1.2, fontSize: '1.05rem', fontFamily: 'inherit' }} noWrap>
        {value}
      </Typography>
    </Box>
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
  const meta = DIFFICULTY_LEVELS[level] || {
    label: `Lv.${level}`,
    description: 'ระดับการเรียนรู้',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
  };

  return (
    <Card
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
        bgcolor: '#ffffff',
        fontFamily: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '18px',
            bgcolor: meta.bg || '#eff6ff',
            color: meta.color || '#2563eb',
            border: `1.5px solid ${meta.border || '#bfdbfe'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.35rem',
            flexShrink: 0,
            boxShadow: `0 4px 12px ${meta.color}20`,
          }}
        >
          {`Lv${level}`}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box
              component="span"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: meta.color || '#2563eb',
                bgcolor: meta.bg || '#eff6ff',
                px: 1.25,
                py: 0.35,
                borderRadius: '6px',
                border: `1px solid ${meta.border || '#bfdbfe'}`,
              }}
            >
              {meta.label}
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'inherit' }}>
            {meta.description}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        <StatItem icon={<BookOpen size={20} color="#2563eb" />} title="บทเรียนทั้งหมด" value={`${totalSessions} บท`} />
        <StatItem icon={<FileText size={20} color="#0891b2" />} title="แบบฝึกหัดทั้งหมด" value={`${totalExercises} ข้อ`} />
        <StatItem icon={<CheckCircle2 size={20} color="#16a34a" />} title="ทำผ่านแล้ว" value={`${completedExercises} ข้อ`} valueColor="#16a34a" />
        <StatItem icon={<Clock size={20} color="#d97706" />} title="เวลารวมโดยประมาณ" value={`~${totalDuration} นาที`} />
      </Box>

      <Box sx={{ width: '100%', pt: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem', fontFamily: 'inherit' }}>
            ความคืบหน้ารวมระดับ {level}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 800, color: meta.color || '#2563eb', fontSize: '0.9rem', fontFamily: 'inherit' }}>
            {levelPercent}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={levelPercent}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: '#f1f5f9',
            '& .MuiLinearProgress-bar': { bgcolor: meta.color || '#2563eb', borderRadius: 4 },
          }}
        />
      </Box>
    </Card>
  );
};

export default LevelSummaryCard;
