import { useState } from 'react'
import { Box, Typography, Chip, Skeleton, Collapse, IconButton, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { FileCode, Clock, CheckCircle2, BarChart2, ChevronDown } from 'lucide-react'

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

const HeaderRow = styled(Box)(() => ({
  display: 'flex', 
  alignItems: 'center', 
  gap: '12px', // 1.5
  flexWrap: 'wrap'
}));

const FileIconWrapper = styled(Box)(() => ({
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  width: 32, 
  height: 32, 
  borderRadius: '8px', 
  backgroundColor: 'rgba(37, 99, 235, 0.08)',
  color: '#2563eb',
  border: '1px solid rgba(37, 99, 235, 0.18)'
}));

const ExerciseTitle = styled(Typography)(() => ({
  fontWeight: 800,
  color: '#0f172a',
  fontSize: '1.15rem',
  fontFamily: 'inherit'
}));

const ExpandButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'expanded'
})<{ expanded?: boolean }>(({ expanded }) => ({
  color: '#2563eb', 
  marginLeft: 'auto', 
  padding: '4px', // 0.5
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
}));

const DescriptionText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'expanded'
})<{ expanded?: boolean }>(({ expanded }) => ({
  color: '#334155',
  fontSize: '13.5px',
  lineHeight: 1.6,
  fontFamily: 'inherit',
  marginTop: '4px', // 0.5
  ...(!expanded && {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  })
}));

const ObjectiveCard = styled(Box)(() => ({
  marginTop: '12px', // 1.5
  padding: '16px', // 2
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 253, 250, 0.5) 100%)',
  borderRadius: '10px',
  border: '1px solid rgba(16, 185, 129, 0.15)',
  boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px', // 0.75
}));

const ObjectiveTitle = styled(Typography)(() => ({
  color: '#0f172a',
  fontWeight: 800,
  fontSize: '13px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px', // 1
  fontFamily: 'inherit'
}));

const ObjectiveBody = styled(Typography)(() => ({
  color: '#475569', 
  fontSize: '13px', 
  lineHeight: 1.6,
  fontFamily: 'inherit'
}));

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
    let color = '#059669'
    let bg = 'rgba(16, 185, 129, 0.06)'
    let border = 'rgba(16, 185, 129, 0.18)'

    switch (level) {
      case 1:
        label = '1: Remember & Understand'
        color = '#059669' // Emerald Green
        bg = 'rgba(16, 185, 129, 0.06)'
        border = 'rgba(16, 185, 129, 0.18)'
        break
      case 2:
        label = '2: Apply'
        color = '#0284c7' // Sky Blue
        bg = 'rgba(2, 132, 199, 0.06)'
        border = 'rgba(2, 132, 199, 0.18)'
        break
      case 3:
        label = '3: Analyze'
        color = '#d97706' // Warm Amber
        bg = 'rgba(245, 158, 11, 0.06)'
        border = 'rgba(245, 158, 11, 0.18)'
        break
      case 4:
        label = '4: Evaluate'
        color = '#7c3aed' // Royal Purple
        bg = 'rgba(139, 92, 246, 0.06)'
        border = 'rgba(139, 92, 246, 0.18)'
        break
      case 5:
        label = '5: Create'
        color = '#e11d48' // Rose Red
        bg = 'rgba(244, 63, 94, 0.06)'
        border = 'rgba(244, 63, 94, 0.18)'
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
          fontSize: '11px',
          border: `1px solid ${border}`,
          borderRadius: '6px',
          px: 0.5,
          '& .MuiChip-icon': { marginLeft: '4px' },
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
      <HeaderRow>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FileIconWrapper>
            <FileCode size={18} />
          </FileIconWrapper>
          <ExerciseTitle variant="h6">
            {displayTitle}
          </ExerciseTitle>
        </Box>

        {displayTopic && (
          <Chip
            label={displayTopic}
            size="small"
            sx={{
              bgcolor: 'rgba(37, 99, 235, 0.06)',
              color: '#2563eb',
              fontWeight: 700,
              fontSize: '11px',
              border: '1px solid rgba(37, 99, 235, 0.18)',
              borderRadius: '6px',
            }}
          />
        )}

        {getDifficultyBadge(difficulty)}

        {expectedTime && (
          <Chip
            icon={<Clock size={12} color="#475569" />}
            label={`${expectedTime} นาที`}
            size="small"
            sx={{
              bgcolor: 'rgba(71, 85, 105, 0.05)',
              color: '#475569',
              fontWeight: 700,
              fontSize: '11px',
              border: '1px solid rgba(71, 85, 105, 0.15)',
              borderRadius: '6px',
              '& .MuiChip-icon': { marginLeft: '4px' },
            }}
          />
        )}

        <Tooltip title={expanded ? 'ย่อรายละเอียดโจทย์' : 'ดูรายละเอียดโจทย์เต็ม'}>
          <ExpandButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            expanded={expanded}
          >
            <ChevronDown size={20} />
          </ExpandButton>
        </Tooltip>
      </HeaderRow>

      {/* 2. Main Description */}
      {displayDescription && (
        <DescriptionText variant="body2" expanded={expanded}>
          <strong>คำอธิบายโจทย์:</strong> {displayDescription}
        </DescriptionText>
      )}

      {/* 3. Objective & Additional Info (Expanded View) */}
      <Collapse in={expanded}>
        {displayObjective && (
          <ObjectiveCard>
            <ObjectiveTitle variant="subtitle2">
              <CheckCircle2 size={16} color="#059669" /> วัตถุประสงค์ (Objective / Rubric):
            </ObjectiveTitle>
            <ObjectiveBody variant="body2">
              {displayObjective}
            </ObjectiveBody>
          </ObjectiveCard>
        )}
      </Collapse>
    </Box>
  )
}

