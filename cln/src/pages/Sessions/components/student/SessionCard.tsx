import React, { useState } from 'react';
import { Box, Typography, Card, LinearProgress, Button, Collapse } from '@mui/material';
import { Sparkles, Clock, CheckCircle2, ChevronDown, ChevronUp, Award } from 'lucide-react';
import type { SessionDetail } from '../../types';
import ExerciseRow from './ExerciseRow';

interface SessionCardProps {
  session: SessionDetail;
  levelColor?: string;
  onSelectExercise?: (exerciseId: number, sessionId: number) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  levelColor = '#2563eb',
  onSelectExercise,
}) => {
  const isCompleted =
    session.totalExercises > 0 &&
    session.completedExercises === session.totalExercises;

  // หากบทเรียนทำเสร็จแล้ว 100% ให้เริ่มต้นแบบพับไว้ เพื่อประหยัดพื้นที่หน้าจอ แต่หากยังเรียนไม่จบให้กางออก
  const [expanded, setExpanded] = useState<boolean>(!isCompleted);

  const progressPercent = session.totalExercises > 0
    ? (session.completedExercises / session.totalExercises) * 100
    : 0;

  return (
    <Card
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: '24px',
        border: '1.5px solid',
        borderColor: isCompleted ? '#bbf7d0' : '#e2e8f0',
        boxShadow: isCompleted
          ? '0 4px 20px rgba(16, 185, 129, 0.05)'
          : '0 4px 20px rgba(15, 23, 42, 0.03)',
        bgcolor: '#ffffff',
        fontFamily: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        transition: 'all 0.2s ease',
      }}
    >
      {/* 1. ส่วนหัวของการ์ดบทเรียน */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ flex: 1, minWidth: '240px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.5, flexWrap: 'wrap' }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '10px',
                bgcolor: isCompleted ? '#dcfce7' : `${levelColor}15`,
                color: isCompleted ? '#16a34a' : levelColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {isCompleted ? <Award size={19} /> : <Sparkles size={18} />}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.15rem', fontFamily: 'inherit' }}>
              {session.sessionName}
            </Typography>

            {/* ป้าย Badge แสดงสถานะผ่านบทเรียนเรียบร้อย */}
            {isCompleted && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  bgcolor: '#f0fdf4',
                  color: '#16a34a',
                  border: '1px solid #bbf7d0',
                  px: 1.25,
                  py: 0.35,
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                <CheckCircle2 size={13} />
                ผ่านบทเรียนนี้แล้ว
              </Box>
            )}
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              pl: { xs: 0, sm: '46px' },
              mt: { xs: 0.5, sm: 0 },
            }}
          >
            {session.sessionObjective}
          </Typography>
        </Box>

        {/* กล่องสรุปเวลาและจำนวนข้อ */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: isCompleted ? '#f0fdf4' : '#f8fafc',
            px: 2,
            py: 1,
            borderRadius: '12px',
            border: '1px solid',
            borderColor: isCompleted ? '#dcfce7' : '#f1f5f9',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#64748b' }}>
            <Clock size={15} />
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.8rem', fontFamily: 'inherit' }}>
              ~{session.duration} นาที
            </Typography>
          </Box>
          <Box sx={{ width: '1px', height: '14px', bgcolor: isCompleted ? '#bbf7d0' : '#cbd5e1' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: isCompleted ? '#16a34a' : '#2563eb' }}>
            <CheckCircle2 size={15} />
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8rem', fontFamily: 'inherit' }}>
              {session.completedExercises} / {session.totalExercises} ข้อ
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 2. แถบแสดงความคืบหน้าของบทเรียน */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.75rem', fontFamily: 'inherit' }}>
            ความคืบหน้าของบทเรียน
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: isCompleted ? '#16a34a' : '#0f172a',
              fontWeight: 700,
              fontSize: '0.75rem',
              fontFamily: 'inherit',
            }}
          >
            {Math.round(progressPercent)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: '#f1f5f9',
            '& .MuiLinearProgress-bar': {
              bgcolor: isCompleted ? '#16a34a' : levelColor,
              borderRadius: 3,
            },
          }}
        />
      </Box>

      {/* 3. แถบควบคุมการยุบ/ขยายรายการแบบฝึกหัด (Accordion Toggle Bar) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: 1,
          borderTop: '1px dashed #e2e8f0',
        }}
      >
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'inherit' }}>
          รายการแบบฝึกหัดในบทเรียน ({session.exercises?.length ?? 0} ข้อ)
        </Typography>

        <Button
          size="small"
          onClick={() => setExpanded(!expanded)}
          endIcon={expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          sx={{
            color: '#475569',
            textTransform: 'none',
            fontSize: '0.8rem',
            fontWeight: 700,
            px: 1.5,
            py: 0.4,
            borderRadius: '8px',
            bgcolor: '#f8fafc',
            border: '1px solid #e2e8f0',
            fontFamily: 'inherit',
            '&:hover': { bgcolor: '#f1f5f9', color: '#0f172a', borderColor: '#cbd5e1' },
          }}
        >
          {expanded ? 'ซ่อนแบบฝึกหัด' : 'แสดงแบบฝึกหัด'}
        </Button>
      </Box>

      {/* 4. รายการแบบฝึกหัด (รองรับ Collapse เพื่อประหยัดพื้นที่หน้าจอ) */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, pt: 1 }}>
          {(session.exercises || []).map((exercise) => (
            <ExerciseRow
              key={exercise.exerciseId}
              exercise={exercise}
              onSelectExercise={(exId) => onSelectExercise?.(exId, session.sessionId)}
            />
          ))}
        </Box>
      </Collapse>
    </Card>
  );
};

export default SessionCard;
