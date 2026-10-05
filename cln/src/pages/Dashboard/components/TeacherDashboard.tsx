import { useState, useEffect, useMemo } from 'react'
import { Box, Alert, Button, Card, CircularProgress, Typography } from '@mui/material'
import { apiClient } from '../../../api/client'
import { DashboardTimeFilter } from './admin/DashboardTimeFilter'
import { TeacherStatCards } from './teacher/TeacherStatCards'
import { TeacherExerciseProgress } from './teacher/TeacherExerciseProgress'
import { TeacherErrorDistribution } from './teacher/TeacherErrorDistribution'
import { TeacherRecentSubmissions } from './teacher/TeacherRecentSubmissions'
import { getTodayStr } from '../../../utils/dateUtils'

// ==========================================
// ประกาศและ Export Types หลักสำหรับ Teacher Dashboard (ตาม Pattern ของ AdminDashboard)
// ==========================================

export interface TeacherStats {
  totalSessions: number
  totalExercises: number
  activeStudents: number
  totalRuns: number
  passRatePercentage: number
  stuckCount: number
}

export interface ExerciseProgressItem {
  id: number
  title: string
  topic: string
  passedCount: number
  totalStudents: number
  percentage: number
}

export interface PythonErrorStat {
  errorType: string
  count: number
  percentage: number
  color?: string
}

export interface RecentSubmissionItem {
  id: number
  userId: number
  studentName: string
  username: string
  exerciseTitle: string
  topic?: string
  sessionName?: string
  difficultyLevel?: number
  eventType: 'submit' | 'run' | string
  score: number
  runCount: number
  hintUsed: boolean
  status: 'PASSED' | 'FAILED'
  submittedAt: string
  answer?: string
  output?: string
  exceptionMessage?: string
  aiFeedback?: string
}

// Interface สำหรับข้อมูลดิบจาก Backend API
interface BackendStudentReport {
  userId: number
  username: string
  fullName?: string
  totalSubmissions?: number
  passedSubmissions?: number
  completedSessions?: number
  averageScore?: number
}

interface BackendExerciseReport {
  exerciseId: number
  title: string
  topic?: string
  difficultyLevel?: number
  attemptedStudents?: number
  passedStudents?: number
  passRateAttempted?: number
}

interface BackendErrorReport {
  totalSystemExceptions?: number
  errorTypeDistribution?: Array<{
    errorType: string
    occurrenceCount: number
    percentage: number
  }>
  studentExceptions?: Array<{
    userId: number
    totalExceptions: number
  }>
}

interface BackendRecentSubmission {
  activityId: number
  userId: number
  exerciseId: number
  status: string
  runCount: number
  hintUsed: boolean
  answer: string
  score: number
  submittedAt: string
  eventType?: string
  output?: string
  exceptionMessage?: string
  aiFeedback?: string
  user?: {
    username: string
    firstName?: string
    lastName?: string
  }
  exercise?: {
    title: string
    topic?: string
    difficultyLevel?: number
  }
  session?: {
    sessionId?: number
    sessionName?: string
  }
}

export function TeacherDashboard() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr)

  // ข้อมูลภาพรวมระบบ (Sessions ทั้งหมด และ Exercises ทั้งหมด)
  const [systemOverview, setSystemOverview] = useState<{
    totalSessions: number
    totalExercises: number
  }>({
    totalSessions: 0,
    totalExercises: 0,
  })

  // สถิติตามช่วงเวลาที่เลือก (Active, Runs, Pass Rate, Stuck Count)
  const [dateMetrics, setDateMetrics] = useState<{
    activeStudents: number
    totalRuns: number
    passRatePercentage: number
    stuckCount: number
  }>({
    activeStudents: 0,
    totalRuns: 0,
    passRatePercentage: 0,
    stuckCount: 0,
  })

  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgressItem[]>([])
  const [errorStats, setErrorStats] = useState<PythonErrorStat[]>([])
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmissionItem[]>([])

  const [isOverviewLoading, setIsOverviewLoading] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 1. โหลดข้อมูลภาพรวมระบบ (โหลดรอบเดียวเมื่อเปิดหน้าเว็บ)
  const loadSystemOverview = async () => {
    setIsOverviewLoading(true)
    try {
      const [sessionsRes, exercisesRes] = await Promise.all([
        apiClient.get('/sessions/all').catch(() => null),
        apiClient.get('/exercises/manage/all').catch(() => null),
      ])

      const totalSessions = Array.isArray(sessionsRes?.data) ? sessionsRes.data.length : 0
      const totalExercises = Array.isArray(exercisesRes?.data) ? exercisesRes.data.length : 0

      setSystemOverview({
        totalSessions,
        totalExercises,
      })
    } catch {
      // ละเว้นข้อผิดพลาดของภาพรวมเพื่อไม่ให้บล็อกการแสดงผลหลัก
    } finally {
      setIsOverviewLoading(false)
    }
  }

  // 2. โหลดข้อมูลสถิติตามวันที่เลือก (Date-dependent APIs)
  const loadDashboardData = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const params = { startDate: selectedDate, endDate: selectedDate }
      const [studentsRes, exercisesRes, errorsRes, submissionsRes] = await Promise.all([
        apiClient.get<BackendStudentReport[]>('/reports/students', { params }).catch(() => null),
        apiClient.get<BackendExerciseReport[]>('/reports/exercises', { params }).catch(() => null),
        apiClient.get<BackendErrorReport>('/reports/errors', { params }).catch(() => null),
        apiClient.get<BackendRecentSubmission[]>('/reports/recent-submissions', {
          params: { ...params, limit: 10 },
        }).catch(() => null),
      ])

      // ตรวจสอบกรณีเซิร์ฟเวอร์ขัดข้องหรือไม่สามารถเชื่อมต่อ API ทั้งหมดได้
      if (!studentsRes && !exercisesRes && !errorsRes && !submissionsRes) {
        setErrorMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์หรือโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง')
        return
      }

      // 2.1 คำนวณ Active Students, Total Runs, Pass Rate
      let realActiveCount = 0
      let realSubmissionsCount = 0
      let realPassedCount = 0

      if (studentsRes?.data && Array.isArray(studentsRes.data)) {
        studentsRes.data.forEach((s) => {
          const subs = s.totalSubmissions || 0
          if (subs > 0) {
            realActiveCount += 1
          }
          realSubmissionsCount += subs
          realPassedCount += s.passedSubmissions || 0
        })
      }

      const passRate =
        realSubmissionsCount > 0
          ? Math.min(100, Math.max(0, (realPassedCount / realSubmissionsCount) * 100))
          : 0

      // 2.2 ประมวลผล Exercise Progress: แสดงเฉพาะแบบฝึกหัดที่มีการทำ/ส่งในวันนั้นจริงๆ
      if (exercisesRes?.data && Array.isArray(exercisesRes.data)) {
        const activeExercisesOnDate = exercisesRes.data
          .filter((ex) => (ex.attemptedStudents || 0) > 0)
          .sort((a, b) => (b.attemptedStudents || 0) - (a.attemptedStudents || 0))

        const progressList: ExerciseProgressItem[] = activeExercisesOnDate.map((ex) => ({
          id: ex.exerciseId,
          title: ex.title,
          topic: ex.topic || 'General',
          passedCount: ex.passedStudents || 0,
          totalStudents: ex.attemptedStudents || 0,
          percentage: Number((ex.passRateAttempted || 0).toFixed(1)),
        }))
        setExerciseProgress(progressList)
      } else {
        setExerciseProgress([])
      }

      // 2.3 ประมวลผล Top Python Errors & Stuck Students
      const errorData = errorsRes?.data
      if (errorData?.errorTypeDistribution && Array.isArray(errorData.errorTypeDistribution)) {
        setErrorStats(
          errorData.errorTypeDistribution.map((item) => ({
            errorType: item.errorType,
            count: item.occurrenceCount,
            percentage: Number(item.percentage.toFixed(1)),
          }))
        )
      } else {
        setErrorStats([])
      }

      // คำนวณจำนวนนักเรียนที่ติดปัญหา (Exception ซ้ำ >= 2 ครั้ง)
      let stuckCount = 0
      if (errorData?.studentExceptions && Array.isArray(errorData.studentExceptions)) {
        stuckCount = errorData.studentExceptions.filter((st) => st.totalExceptions >= 2).length
      }

      setDateMetrics({
        activeStudents: realActiveCount,
        totalRuns: realSubmissionsCount,
        passRatePercentage: Number(passRate.toFixed(1)),
        stuckCount,
      })

      // 2.4 ประมวลผล Recent Submissions Table
      if (submissionsRes?.data && Array.isArray(submissionsRes.data)) {
        const formattedSubs: RecentSubmissionItem[] = submissionsRes.data.map((sub: BackendRecentSubmission) => ({
          id: sub.activityId,
          userId: sub.userId,
          studentName: sub.user ? `${sub.user.firstName || ''} ${sub.user.lastName || ''}`.trim() || sub.user.username : `User #${sub.userId}`,
          username: sub.user?.username || `user_${sub.userId}`,
          exerciseTitle: sub.exercise?.title || `Exercise #${sub.exerciseId}`,
          topic: sub.exercise?.topic || 'Python Basics',
          sessionName: sub.session?.sessionName || 'บทเรียนทั่วไป',
          difficultyLevel: sub.exercise?.difficultyLevel || 1,
          eventType: sub.eventType || 'submit',
          score: sub.score ?? 0,
          runCount: sub.runCount ?? 1,
          hintUsed: sub.hintUsed ?? false,
          status: (sub.score ?? 0) >= 80 || sub.status === 'PASSED' ? 'PASSED' : 'FAILED',
          submittedAt: sub.submittedAt,
          answer: sub.answer,
          output: sub.output,
          exceptionMessage: sub.exceptionMessage,
          aiFeedback: sub.aiFeedback,
        }))
        setRecentSubmissions(formattedSubs)
      } else {
        setRecentSubmissions([])
      }
    } catch {
      setErrorMessage('เกิดข้อผิดพลาดในการโหลดข้อมูล Teacher Dashboard กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }

  // โหลดภาพรวมระบบรอบเดียวตอนเข้าหน้าเว็บ
  useEffect(() => {
    loadSystemOverview()
  }, [])

  // โหลดสถิติตามวันที่เลือกเมื่อ selectedDate เปลี่ยนแปลง
  useEffect(() => {
    loadDashboardData()
  }, [selectedDate])

  // รวมข้อมูลสถิติสำหรับการ์ด 6 ใบ
  const combinedStats = useMemo<TeacherStats>(() => {
    return {
      totalSessions: systemOverview.totalSessions,
      totalExercises: systemOverview.totalExercises,
      activeStudents: dateMetrics.activeStudents,
      totalRuns: dateMetrics.totalRuns,
      passRatePercentage: dateMetrics.passRatePercentage,
      stuckCount: dateMetrics.stuckCount,
    }
  }, [systemOverview, dateMetrics])

  const handleRetry = () => {
    loadSystemOverview()
    loadDashboardData()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 4 }}>
      {/* 1. Header Filter ชิดขวาแบบเดียวกับ Admin Dashboard */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <DashboardTimeFilter value={selectedDate} onChange={setSelectedDate} />
      </Box>

      {/* Alert แจ้งเตือนข้อผิดพลาดพร้อมปุ่มลองอีกครั้ง */}
      {errorMessage && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              ลองอีกครั้ง
            </Button>
          }
        >
          {errorMessage}
        </Alert>
      )}

      {/* จัดการสถานะกำลังโหลดแบบรวมศูนย์ (Unified Loading) ด้วย CircularProgress Card สไตล์เดียวกับ ExerciseResults และ StudentResults */}
      {isLoading || isOverviewLoading ? (
        <Card
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: 'none',
          }}
        >
          <CircularProgress size={36} />
          <Typography variant="body2" sx={{ mt: 2, color: '#64748b', fontWeight: 600 }}>
            กำลังโหลดข้อมูลแดชบอร์ดภาพรวมผู้สอน...
          </Typography>
        </Card>
      ) : (
        <>
          {/* 2. การ์ดสถิติ 6 ใบ สไตล์ Clean Minimal Typography */}
          <TeacherStatCards stats={combinedStats} />

          {/* 3. กราฟวิเคราะห์ 2 คอลัมน์ (ความคืบหน้ารายโจทย์ + Top Python Errors) */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' }, gap: 3 }}>
            <TeacherExerciseProgress
              exercises={exerciseProgress}
              selectedDate={selectedDate}
            />
            <TeacherErrorDistribution errors={errorStats} />
          </Box>

          {/* 4. ตารางประวัติการส่งงานล่าสุด (Recent Submissions Table) */}
          <TeacherRecentSubmissions submissions={recentSubmissions} />
        </>
      )}
    </Box>
  )
}

export default TeacherDashboard
