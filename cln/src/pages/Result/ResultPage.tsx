import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Button, CircularProgress, Grid } from '@mui/material'
import { MainLayout } from '../../components/Layout/MainLayout'
import { apiClient } from '../../api/client'
import { ArrowLeft } from 'lucide-react'

// Import redesigned subcomponents
import { ScoreSummaryCard } from './components/ScoreSummaryCard'
import { AiFeedbackCard } from './components/AiFeedbackCard'
import { ConsoleOutputCard } from './components/ConsoleOutputCard'
import { CodeReviewEditor } from './components/CodeReviewEditor'
import { RunResultsCard } from './components/RunResultsCard'

interface ActivityStatus {
  success: boolean
  activityId: number
  eventType: string
  status: string
  score: number
  runCount: number
  hintUsed: boolean
  exceptionMessage: string | null
  aiFeedback: string | null
  exerciseId: number
  sessionId: number
  sourceCode: string
  exerciseTitle: string
  exerciseDescription: string
  targetLevel: number
  startedAt: string
  submittedAt: string
}

export function ResultPage() {
  const { activityId } = useParams<{ activityId: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<ActivityStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [nextExerciseId, setNextExerciseId] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    async function fetchResult() {
      try {
        setLoading(true)
        const res = await apiClient.get(`/exercises/status/${activityId}`)
        if (active) {
          setData(res.data)
        }
      } catch (err) {
        if (active) console.error('Error fetching result status:', err)
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchResult()

    return () => {
      active = false
    }
  }, [activityId])

  useEffect(() => {
    const currentData = data
    if (!currentData) return
    let active = true

    async function determineNextExercise() {
      if (!currentData) return
      try {
        const res = await apiClient.get(`/exercises/level-sessions/${currentData.targetLevel}`)
        if (!active) return

        const sessions = res.data
        const currentSession = sessions.find((s: any) => s.sessionId === currentData.sessionId)
        if (currentSession) {
          const exercises = currentSession.exercises
          const currentIndex = exercises.findIndex((ex: any) => ex.exerciseId === currentData.exerciseId)
          
          if (currentIndex !== -1 && currentIndex + 1 < exercises.length) {
            setNextExerciseId(exercises[currentIndex + 1].exerciseId)
          }
        }
      } catch (err) {
        if (active) console.error('Error determining next exercise:', err)
      }
    }
    determineNextExercise()

    return () => {
      active = false
    }
  }, [data])

  if (loading) {
    return (
      <MainLayout activeItem="Sessions">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    )
  }

  if (!data) {
    return (
      <MainLayout activeItem="Sessions">
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error">ไม่พบข้อมูลประวัติการส่งนี้</Typography>
          <Button onClick={() => navigate('/sessions')} sx={{ mt: 2 }} variant="outlined">
            กลับหน้ารวมบทเรียน
          </Button>
        </Box>
      </MainLayout>
    )
  }

  const isPassed = data.score >= 80

  return (
    <MainLayout activeItem="Sessions">
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', p: 3, bgcolor: '#f8fafc', minHeight: '90vh' }}>
        
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            ผลการประเมิน: {data.exerciseTitle}
          </Typography>
          <Button 
            startIcon={<ArrowLeft size={16} />} 
            onClick={() => navigate('/sessions')}
            variant="outlined"
            sx={{ borderRadius: '8px', textTransform: 'none', borderColor: '#cbd5e1', color: '#64748b' }}
          >
            กลับหน้ารวมบทเรียน
          </Button>
        </Box>

        {/* Content Layout */}
        <Grid container spacing={3}>
          {/* Left Column: Sidebar Details Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ScoreSummaryCard
              score={data.score}
              isPassed={isPassed}
              exerciseId={data.exerciseId}
              sessionId={data.sessionId}
              nextExerciseId={nextExerciseId}
              runCount={data.runCount}
              hintUsed={data.hintUsed}
              startedAt={data.startedAt}
              submittedAt={data.submittedAt}
            />
          </Grid>

          {/* Right Column: Run results, code, feedback and exception */}
          <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 1. ผลลัพธ์การรัน (Run Results) */}
            <RunResultsCard 
              actualOutput={data.exceptionMessage} 
            />

            {/* 2. โค้ดที่ส่ง (Monaco Editor) */}
            <CodeReviewEditor sourceCode={data.sourceCode} />

            {/* 3. คำแนะนำจาก AI */}
            <AiFeedbackCard feedback={data.aiFeedback} />

            {/* 4. Exception Message Toggle */}
            <ConsoleOutputCard exceptionMessage={data.exceptionMessage} />
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  )
}

export default ResultPage
