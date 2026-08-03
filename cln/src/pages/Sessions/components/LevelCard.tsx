// import React from 'react';
// import { Box, Typography, Card, Chip, LinearProgress } from '@mui/material';
// import { BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
// import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';

// export interface LevelProgress {
//   level: number;
//   totalSessions: number;
//   totalHours: number;
//   totalExercises: number;
//   completedExercises: number;
// }

// interface LevelCardProps {
//   progressData: LevelProgress;
//   onClick?: (level: number) => void;
// }

// export const LevelCard: React.FC<LevelCardProps> = ({ progressData, onClick }) => {
//   const meta = DIFFICULTY_LEVELS[progressData.level] || {
//     label: `Lv.${progressData.level}`,
//     description: 'ระดับการเรียนรู้',
//     color: '#3b82f6',
//     bg: '#eff6ff',
//     border: '#bfdbfe',
//   };

//   const progressPercent =
//     progressData.totalExercises > 0
//       ? (progressData.completedExercises / progressData.totalExercises) * 100
//       : 0;

//   return (
//     <Card
//       onClick={() => onClick?.(progressData.level)}
//       sx={{
//         p: { xs: 2.5, sm: 3 },
//         borderRadius: '20px',
//         border: '1px solid #e2e8f0',
//         bgcolor: '#ffffff',
//         boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
//         cursor: 'pointer',
//         fontFamily: "'Kanit', sans-serif",
//         position: 'relative',
//         overflow: 'hidden',
//         transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
//         '&:hover': {
//           transform: 'translateY(-3px)',
//           boxShadow: `0 14px 28px -6px ${meta.color}20, 0 10px 10px -6px rgba(0, 0, 0, 0.04)`,
//           borderColor: meta.color,
//           '& .arrow-icon': {
//             transform: 'translateX(4px)',
//             color: meta.color,
//           },
//         },
//         '&::before': {
//           content: '""',
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '6px',
//           height: '100%',
//           bgcolor: meta.color,
//         },
//       }}
//     >
//       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: 0.5 }}>
//         {/* Header Row: Badge & Description & Meta stats */}
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
//           {/* Left Block: Badge & Description */}
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//             <Chip
//               label={meta.label}
//               sx={{
//                 fontWeight: 700,
//                 fontSize: '0.8rem',
//                 fontFamily: 'inherit',
//                 color: meta.color,
//                 bgcolor: meta.bg,
//                 border: `1.5px solid ${meta.border}`,
//                 borderRadius: '8px',
//                 height: 28,
//                 px: 0.5,
//               }}
//             />
//             <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', fontFamily: 'inherit' }}>
//               {meta.description}
//             </Typography>
//           </Box>

//           {/* Right Block: Sessions count & Arrow */}
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: '#f8fafc', px: 1.25, py: 0.4, borderRadius: '8px', border: '1px solid #e2e8f0' }}>
//               <BookOpen size={14} color="#64748b" />
//               <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'inherit', color: '#475569', fontSize: '0.8rem' }}>
//                 {progressData.totalSessions} Sessions
//               </Typography>
//             </Box>

//             <ArrowRight size={18} className="arrow-icon" style={{ transition: 'transform 0.2s ease, color 0.2s ease', color: '#94a3b8' }} />
//           </Box>
//         </Box>

//         {/* Progress Bar Section */}
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
//               <CheckCircle2 size={15} color={meta.color} />
//               <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'inherit' }}>
//                 ความก้าวหน้า
//               </Typography>
//             </Box>

//             <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'inherit' }}>
//               {progressData.completedExercises}/{progressData.totalExercises} ข้อ{' '}
//               <Typography component="span" sx={{ color: meta.color, fontWeight: 700, fontSize: 'inherit', fontFamily: 'inherit' }}>
//                 ({Math.round(progressPercent)}%)
//               </Typography>
//             </Typography>
//           </Box>

//           <LinearProgress
//             variant="determinate"
//             value={progressPercent}
//             sx={{
//               height: 10,
//               borderRadius: 5,
//               bgcolor: '#f1f5f9',
//               '& .MuiLinearProgress-bar': {
//                 borderRadius: 5,
//                 backgroundColor: meta.color,
//                 boxShadow: `0 2px 6px ${meta.color}40`,
//               },
//             }}
//           />
//         </Box>
//       </Box>
//     </Card>
//   );
// };

// export default LevelCard;



import { Box, Typography, Card, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';

export interface LevelProgress {
  level: number;
  totalSessions: number;
  totalHours: number;
  totalExercises: number;
  completedExercises: number;
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
        fontFamily: "'Kanit', sans-serif",
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
          {/* <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.25, fontFamily: 'inherit' }}>
            {progressData.totalSessions} บทเรียน • {progressData.totalExercises} แบบฝึกหัด (ผ่านแล้ว {progressData.completedExercises} ข้อ)
          </Typography> */}
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

