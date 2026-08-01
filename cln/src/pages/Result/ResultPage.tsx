import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Button, CircularProgress, Grid } from '@mui/material'
import { MainLayout } from '../../components/Layout/MainLayout'
import { apiClient } from '../../api/client'
import { ArrowLeft } from 'lucide-react'

// Import subcomponents
import { ScoreSummaryCard } from './components/ScoreSummaryCard'
import { AiFeedbackCard } from './components/AiFeedbackCard'
import { ConsoleOutputCard } from './components/ConsoleOutputCard'
import { CodeReviewEditor } from './components/CodeReviewEditor'

interface ActivityStatus {
  success: boolean
  score: number
  status: string
  exceptionMessage: string | null
  aiFeedback: string | null
  exerciseId: number
  sessionId: number
  sourceCode: string
  exerciseTitle: string
  exerciseDescription: string
  targetLevel: number
}

export function ResultPage() {
  const { activityId } = useParams<{ activityId: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<ActivityStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [nextExerciseId, setNextExerciseId] = useState<number | null>(null)

  // 1. ดึงสถานะของ Activity การตรวจโค้ด
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

  // 2. ดึงข้อมูลรายชื่อข้อใน Session เพื่อคำนวณข้อถัดไป (Next Exercise)
  useEffect(() => {
    if (!data) return
    let active = true
    
    const { targetLevel, sessionId, exerciseId } = data

    async function determineNextExercise() {
      try {
        const res = await apiClient.get(`/exercises/level-sessions/${targetLevel}`)
        if (!active) return

        const sessions = res.data
        const currentSession = sessions.find((s: any) => s.sessionId === sessionId)
        if (currentSession) {
          const exercises = currentSession.exercises
          const currentIndex = exercises.findIndex((ex: any) => ex.exerciseId === exerciseId)
          
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
      <Box sx={{ maxWidth: '1000px', margin: '0 auto', p: 1 }}>
        
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            ผลการประเมิน: {data.exerciseTitle}
          </Typography>
          <Button 
            startIcon={<ArrowLeft size={16} />} 
            onClick={() => navigate('/sessions')}
            variant="outlined"
          >
            กลับหน้ารวมบทเรียน
          </Button>
        </Box>

        {/* Content Layout */}
        <Grid container spacing={3}>
          {/* Left Column: Score, AI Feedback, Exception message */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <ScoreSummaryCard
              score={data.score}
              isPassed={isPassed}
              exerciseId={data.exerciseId}
              sessionId={data.sessionId}
              nextExerciseId={nextExerciseId}
            />
            <AiFeedbackCard feedback={data.aiFeedback} />
            <ConsoleOutputCard exceptionMessage={data.exceptionMessage} />
          </Grid>

          {/* Right Column: Submitted Code read-only Monaco Editor */}
          <Grid size={{ xs: 12, md: 7 }}>
            <CodeReviewEditor sourceCode={data.sourceCode} />
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  )
}

export default ResultPage
