import { Box, Card, Typography, LinearProgress, Skeleton } from '@mui/material';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';

export interface LevelSummaryItem {
  level: number;
  totalExercises: number;
  completedExercises: number;
}

interface LevelProgressProps {
  levelsSummary: LevelSummaryItem[];
  isLoading?: boolean;
}

export function LevelProgress({ levelsSummary, isLoading = false }: LevelProgressProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* ส่วนหัวแสดงชื่อหมวด เพื่อให้ระดับสายตาเสมอกับส่วนบทเรียนล่าสุด */}
      <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '30.75px' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
          ความคืบหน้าตามระดับ
        </Typography>
      </Box>

      {/* การ์ดสรุปความคืบหน้ารายระดับ สไตล์เดียวกับการ์ด TeacherExerciseProgress */}
      <Card 
        sx={{ 
          p: 2.5, 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0', 
          bgcolor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2.5,
          height: '100%',
        }}
      >
        <Box sx={{ mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
            ความก้าวหน้ารายระดับ (Level Progress)
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
            สัดส่วนแบบฝึกหัดที่ทำสำเร็จในแต่ละระดับความยาก
          </Typography>
        </Box>

        {isLoading ? (
          [1, 2, 3].map((key) => (
            <Box key={key} sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton width={80} height={18} animation="wave" />
                <Skeleton width={65} height={18} animation="wave" />
              </Box>
              <Skeleton width="100%" height={7} animation="wave" sx={{ borderRadius: 4 }} />
            </Box>
          ))
        ) : levelsSummary.length === 0 ? (
          <Typography variant="caption" sx={{ color: '#94a3b8', textAlign: 'center', py: 3 }}>
            ยังไม่มีข้อมูลระดับความยาก
          </Typography>
        ) : (
          levelsSummary.map((lvl) => {
            const val = lvl.totalExercises > 0 ? Math.round((lvl.completedExercises / lvl.totalExercises) * 100) : 0;
            const levelLabel = DIFFICULTY_LEVELS[lvl.level]?.label || `ระดับ ${lvl.level}`;
            const levelColor = DIFFICULTY_LEVELS[lvl.level]?.color || '#1d4ed8';

            return (
              <Box key={lvl.level} sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: val > 0 ? '#1e293b' : '#64748b' }}>
                    • {levelLabel}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: val > 0 ? levelColor : '#94a3b8' }}>
                    {val}% ({lvl.completedExercises}/{lvl.totalExercises})
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={val}
                  sx={{
                    height: 7,
                    borderRadius: 4,
                    bgcolor: '#f1f5f9',
                    '& .MuiLinearProgress-bar': { 
                      bgcolor: levelColor,
                      borderRadius: 4,
                      transition: 'transform 0.4s ease',
                    },
                  }}
                />
              </Box>
            );
          })
        )}
      </Card>
    </Box>
  );
}
