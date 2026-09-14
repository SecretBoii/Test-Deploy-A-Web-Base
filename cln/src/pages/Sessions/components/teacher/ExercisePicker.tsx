import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Chip,
  CircularProgress,
  Checkbox,
  InputAdornment,
} from '@mui/material';
import { Search, BookOpen, Check, Clock } from 'lucide-react';
import { DIFFICULTY_LEVELS } from '../../../../constants/difficulty';

export interface ExerciseOption {
  exerciseId: number;
  title: string;
  topic: string;
  difficultyLevel: number;
  expectedTime: number;
}

export interface ExercisePickerProps {
  allExercises: ExerciseOption[];
  loading: boolean;
  selectedExerciseIdsSet: Set<number>;
  onToggleExercise: (exerciseId: number) => void;
  onClearAll?: () => void;
}

export const ExercisePicker = React.memo<ExercisePickerProps>(({
  allExercises,
  loading,
  selectedExerciseIdsSet,
  onToggleExercise,
  onClearAll,
}) => {
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerLevelFilter, setPickerLevelFilter] = useState<string>('all');

  // รายการโจทย์ที่ถูกเลือก เพื่อนำมาแสดงใต้ช่อง Search
  const selectedExercises = useMemo(() => {
    return allExercises.filter((ex) => selectedExerciseIdsSet.has(ex.exerciseId));
  }, [allExercises, selectedExerciseIdsSet]);

  // กรองรายการโจทย์ตามคำค้นหาและระดับความยาก
  const filteredExercises = useMemo(() => {
    return allExercises.filter((ex) => {
      const matchSearch =
        pickerSearch.trim() === '' ||
        ex.title.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        ex.topic.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        String(ex.exerciseId).includes(pickerSearch);

      const matchLevel =
        pickerLevelFilter === 'all' || ex.difficultyLevel === Number(pickerLevelFilter);

      return matchSearch && matchLevel;
    });
  }, [allExercises, pickerSearch, pickerLevelFilter]);

  return (
    <Box
      sx={{
        p: 2.5,
        bgcolor: '#f8fafc',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: { xs: 450, md: 560 },
        gap: 1.75,
      }}
    >
      {/* ส่วนหัวของหมวดเลือกแบบฝึกหัด */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              p: 0.6,
              borderRadius: '8px',
              bgcolor: '#eef2ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookOpen size={16} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
              แบบฝึกหัดใน Session
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12px' }}>
              เลือกโจทย์ที่ต้องการบรรจุลงในรอบบทเรียนนี้
            </Typography>
          </Box>
        </Box>

        {/* Badge สรุปจำนวนข้อที่เลือก */}
        <Chip
          size="small"
          icon={<Check size={14} />}
          label={`เลือกแล้ว ${selectedExerciseIdsSet.size} ข้อ`}
          sx={{
            bgcolor: selectedExerciseIdsSet.size > 0 ? '#eef2ff' : '#f1f5f9',
            color: selectedExerciseIdsSet.size > 0 ? '#4f46e5' : '#64748b',
            border: `1px solid ${selectedExerciseIdsSet.size > 0 ? '#c7d2fe' : '#e2e8f0'}`,
            fontWeight: 700,
            fontSize: '12px',
          }}
        />
      </Box>

      {/* แถบเครื่องมือค้นหาและตัวกรองภายในกล่องเลือกโจทย์ */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <TextField
          placeholder="ค้นหาโจทย์ตามชื่อ, หัวข้อ หรือรหัส ID..."
          value={pickerSearch}
          onChange={(e) => setPickerSearch(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, minWidth: 200 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ color: '#94a3b8' }}>
                  <Search size={16} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '10px',
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                height: '38px',
                fontSize: '13px',
                '& fieldset': { border: 'none' },
              },
            },
          }}
        />

        <TextField
          select
          value={pickerLevelFilter}
          onChange={(e) => setPickerLevelFilter(e.target.value)}
          size="small"
          sx={{ width: 170 }}
          slotProps={{
            input: {
              sx: {
                borderRadius: '10px',
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                height: '38px',
                fontSize: '13px',
                fontWeight: 600,
                '& fieldset': { border: 'none' },
              },
            },
          }}
        >
          <MenuItem value="all">ระดับ: ทั้งหมด</MenuItem>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <MenuItem key={lvl} value={String(lvl)}>
              Level {lvl}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* รายการข้อที่เลือกแล้ว (แสดงใต้ช่อง Search) */}
      {selectedExercises.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            p: 1.5,
            bgcolor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #c7d2fe',
            boxShadow: '0 1px 3px rgba(79, 70, 229, 0.05)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: '#4f46e5',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
              }}
            >
              <Check size={14} /> โจทย์ที่เลือกไว้ ({selectedExercises.length} ข้อ):
            </Typography>
            {onClearAll && (
              <Typography
                variant="caption"
                onClick={onClearAll}
                sx={{
                  color: '#64748b',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'color 0.15s ease',
                  '&:hover': { color: '#ef4444' },
                }}
              >
                ล้างทั้งหมด
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 0.75,
              flexWrap: 'wrap',
              maxHeight: 88,
              overflowY: 'auto',
            }}
          >
            {selectedExercises.map((ex) => (
              <Chip
                key={ex.exerciseId}
                label={`#${ex.exerciseId} ${ex.title}`}
                size="small"
                onDelete={() => onToggleExercise(ex.exerciseId)}
                sx={{
                  bgcolor: '#eef2ff',
                  color: '#312e81',
                  border: '1px solid #c7d2fe',
                  fontWeight: 600,
                  fontSize: '12px',
                  borderRadius: '6px',
                  maxWidth: 260,
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  },
                  '& .MuiChip-deleteIcon': {
                    color: '#6366f1',
                    '&:hover': { color: '#ef4444' },
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* พื้นที่แสดงรายการโจทย์แบบ Scrollable */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 280,
          maxHeight: { xs: 350, md: 480 },
          overflowY: 'auto',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          bgcolor: '#ffffff',
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4, gap: 1.5, color: '#64748b' }}>
            <CircularProgress size={20} sx={{ color: '#4f46e5' }} />
            <Typography variant="body2" sx={{ fontSize: '13px', fontWeight: 500 }}>
              กำลังโหลดรายการโจทย์...
            </Typography>
          </Box>
        ) : filteredExercises.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
            <Typography variant="body2" sx={{ fontSize: '13px' }}>
              ไม่พบรายการโจทย์ที่ตรงกับเงื่อนไข
            </Typography>
          </Box>
        ) : (
          filteredExercises.map((ex) => {
            const isChecked = selectedExerciseIdsSet.has(ex.exerciseId);
            const diff = DIFFICULTY_LEVELS[ex.difficultyLevel] || {
              label: `Lv.${ex.difficultyLevel}`,
              bg: '#eff6ff',
              color: '#3b82f6',
              border: '#bfdbfe',
            };

            return (
              <Box
                key={ex.exerciseId}
                onClick={() => onToggleExercise(ex.exerciseId)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.25,
                  px: 1.5,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isChecked ? '#c7d2fe' : '#f1f5f9',
                  bgcolor: isChecked ? '#eef2ff' : '#ffffff',
                  transition: 'all 0.12s ease',
                  '&:hover': {
                    bgcolor: isChecked ? '#e0e7ff' : '#f8fafc',
                    borderColor: isChecked ? '#a5b4fc' : '#e2e8f0',
                  },
                }}
              >
                {/* Checkbox + Title & Topic */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                  <Checkbox
                    checked={isChecked}
                    size="small"
                    sx={{
                      p: 0.25,
                      color: '#cbd5e1',
                      '&.Mui-checked': { color: '#4f46e5' },
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isChecked ? 700 : 600,
                        color: '#0f172a',
                        fontSize: '13.5px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      #{ex.exerciseId} {ex.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: '#64748b', fontSize: '12px', display: 'block' }}
                    >
                      หัวข้อ: {ex.topic}
                    </Typography>
                  </Box>
                </Box>

                {/* Badges: Level & Expected Time */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, ml: 1.5 }}>
                  <Chip
                    size="small"
                    label={`Lv.${ex.difficultyLevel}`}
                    sx={{
                      bgcolor: diff.bg,
                      color: diff.color,
                      border: `1px solid ${diff.border}`,
                      fontWeight: 700,
                      fontSize: '11px',
                      height: '22px',
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b', fontSize: '12px' }}>
                    <Clock size={13} />
                    <span>{ex.expectedTime || 5} น.</span>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
});

export default ExercisePicker;
