import { useState } from 'react'
import { Box, Typography, Chip, Skeleton, Collapse, IconButton, Tooltip } from '@mui/material'
import { FileCode, Clock, CheckCircle2, BarChart2, ChevronDown, ChevronUp } from 'lucide-react'

interface ExerciseProblemProps {
  exerciseData: ExerciseDetail | null
  loading: boolean
  title?: string
  description?: string
  topic?: string
}

interface ExerciseDetail {
  exerciseId: number
  title: string
  description: string
  topic: string
  objective: string
  difficultyLevel: number
  expectedTime: number
  status?: string
}

export function ExerciseProblem({ exerciseData, loading, title, description, topic }: ExerciseProblemProps) {
  const [expanded, setExpanded] = useState(false)

  const displayTitle = title || exerciseData?.title || 'โจทย์แบบฝึกหัด Python'
  const displayTopic = topic || exerciseData?.topic
  const displayDescription = description || exerciseData?.description
  const displayObjective = exerciseData?.objective
  const difficulty = exerciseData?.difficultyLevel
  const expectedTime = exerciseData?.expectedTime

  const getDifficultyBadge = (level?: number) => {
    if (!level) return null
    let label = `Level ${level}`
    let color = '#10b981'
    let bg = '#ecfdf5'
    let border = '#a7f3d0'

    switch (level) {
      case 1:
        label = '1: Remember & Understand'
        color = '#10b981' // Green
        bg = '#ecfdf5'
        border = '#a7f3d0'
        break
      case 2:
        label = '2: Apply'
        color = '#0284c7' // Blue
        bg = '#e0f2fe'
        border = '#bae6fd'
        break
      case 3:
        label = '3: Analyze'
        color = '#f59e0b' // Amber
        bg = '#fffbeb'
        border = '#fde68a'
        break
      case 4:
        label = '4: Evaluate'
        color = '#8b5cf6' // Purple
        bg = '#f5f3ff'
        border = '#ddd6fe'
        break
      case 5:
        label = '5: Create'
        color = '#f43f5e' // Rose
        bg = '#fff1f2'
        border = '#fecdd3'
        break
      default:
        label = `Level ${level}`
    }

    return (
      <Chip
        icon={<BarChart2 size={12} color={color} />}
        label={`Bloom: ${label}`}
        size="small"
        sx={{
          bgcolor: bg,
          color: color,
          fontWeight: 700,
          fontSize: '12px',
          border: `1px solid ${border}`,
          '& .MuiChip-icon': { marginLeft: '6px' },
        }}
      />
    )
  }

  if (loading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Skeleton variant="text" width="40%" height={32} />
        <Skeleton variant="text" width="80%" height={20} />
      </Box>
    )
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75, pr: 2 }}>
      {/* 1. Header Row: Title & Badges */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: '1.2rem',
          }}
        >
          <FileCode size={22} color="#2563eb" />
          {displayTitle}
        </Typography>

        {displayTopic && (
          <Chip
            label={displayTopic}
            size="small"
            sx={{
              bgcolor: '#eff6ff',
              color: '#2563eb',
              fontWeight: 600,
              fontSize: '12px',
              border: '1px solid #bfdbfe',
            }}
          />
        )}

        {getDifficultyBadge(difficulty)}

        {expectedTime && (
          <Chip
            icon={<Clock size={12} color="#64748b" />}
            label={`${expectedTime} นาที`}
            size="small"
            sx={{
              bgcolor: '#f8fafc',
              color: '#475569',
              fontWeight: 600,
              fontSize: '12px',
              border: '1px solid #e2e8f0',
              '& .MuiChip-icon': { marginLeft: '6px' },
            }}
          />
        )}

        <Tooltip title={expanded ? 'ย่อรายละเอียดโจทย์' : 'ดูรายละเอียดโจทย์เต็ม'}>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ color: '#2563eb', ml: 'auto', p: 0.5 }}
          >
            {expanded ? <ChevronUp size={20} color="#2563eb" /> : <ChevronDown size={20} color="#2563eb" />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* 2. Main Description */}
      {displayDescription && (
        <Typography
          variant="body2"
          sx={{
            color: '#334155',
            fontSize: '13.5px',
            lineHeight: 1.5,
            ...(!expanded && {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }),
          }}
        >
          <strong>คำอธิบายโจทย์:</strong> {displayDescription}
        </Typography>
      )}

      {/* 3. Objective & Additional Info (Expanded View) */}
      <Collapse in={expanded}>
        {displayObjective && (
          <Box
            sx={{
              mt: 1,
              p: 1.5,
              bgcolor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: '#1e293b',
                fontWeight: 700,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CheckCircle2 size={16} color="#059669" /> วัตถุประสงค์ (Objective / Rubric):
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', fontSize: '13px', lineHeight: 1.5 }}>
              {displayObjective}
            </Typography>
          </Box>
        )}
      </Collapse>
    </Box>
  )
}
