import { Card, Box, Typography, Chip, Collapse, IconButton } from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { StudentActivityItem } from '../../../api/reports';
import { getErrorBadgeStyle } from '../StudentErrorReportDetailPage';
import { ExerciseErrorActivityItem } from './ExerciseErrorActivityItem';

export interface GroupedExerciseItem {
  exerciseId: number;
  title: string;
  topic: string;
  difficultyLevel: number;
  activities: StudentActivityItem[];
  errorTypeCounts: Record<string, number>;
}

interface ExerciseErrorAccordionCardProps {
  exercise: GroupedExerciseItem;
  isExpanded: boolean;
  onToggle: (exerciseId: number) => void;
  onInspectActivity: (activity: StudentActivityItem) => void;
}

export function ExerciseErrorAccordionCard({
  exercise,
  isExpanded,
  onToggle,
  onInspectActivity,
}: ExerciseErrorAccordionCardProps) {
  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: isExpanded ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
        boxShadow: isExpanded ? '0 4px 12px rgba(37, 99, 235, 0.06)' : 'none',
        bgcolor: '#ffffff',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
      }}
    >
      {/* ส่วนหัวการ์ด: คลิกเพื่อขยาย/ยุบ */}
      <Box
        onClick={() => onToggle(exercise.exerciseId)}
        sx={{
          p: 2.5,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5,
          bgcolor: isExpanded ? '#f8fafc' : '#ffffff',
          borderBottom: isExpanded ? '1px solid #f1f5f9' : 'none',
          '&:hover': { bgcolor: '#f8fafc' },
          transition: 'background-color 0.15s ease',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            size="small"
            sx={{
              bgcolor: isExpanded ? '#eff6ff' : '#f1f5f9',
              color: isExpanded ? '#2563eb' : '#64748b',
              transition: 'transform 0.2s ease',
            }}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </IconButton>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '15px' }}>
              ข้อ {exercise.exerciseId}: {exercise.title}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              หัวข้อ: <span style={{ fontWeight: 600, color: '#334155' }}>{exercise.topic}</span>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {Object.entries(exercise.errorTypeCounts).map(([type, count]) => {
            const style = getErrorBadgeStyle(type);
            return (
              <Chip
                key={type}
                label={`${type} (${count})`}
                size="small"
                sx={{
                  bgcolor: style.bg,
                  color: style.color,
                  border: `1px solid ${style.border}`,
                  fontWeight: 700,
                  fontSize: '11px',
                  borderRadius: '6px',
                }}
              />
            );
          })}
          <Chip
            label={`รวม ${exercise.activities.length} ครั้ง`}
            size="small"
            sx={{ bgcolor: '#fee2e2', color: '#dc2626', fontWeight: 800, borderRadius: '6px' }}
          />
          <Typography variant="caption" sx={{ color: isExpanded ? '#2563eb' : '#94a3b8', fontWeight: 600, ml: 0.5 }}>
            {isExpanded ? 'คลิกเพื่อยุบเก็บ' : 'คลิกเพื่อดูโค้ด'}
          </Typography>
        </Box>
      </Box>

      {/* ส่วนเนื้อหาข้างใน: คลี่แสดงรายการรันเมื่อคลิกเปิด */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#ffffff' }}>
          {exercise.activities.map((act, index) => (
            <ExerciseErrorActivityItem
              key={act.activityId}
              activity={act}
              runNumber={exercise.activities.length - index}
              onInspect={onInspectActivity}
            />
          ))}
        </Box>
      </Collapse>
    </Card>
  );
}
