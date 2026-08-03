import { useState, useEffect, useMemo } from 'react'
import { Box, CircularProgress, Tooltip } from '@mui/material'
import { MainLayout } from '../../components/Layout/MainLayout'
import { apiClient } from '../../api/client'
import { DIFFICULTY_LEVELS } from '../../constants/difficulty'

// Import Subcomponents
import { HistoryStats } from './components/HistoryStats'
import { HistoryTable } from './components/HistoryTable'

interface Exercise {
  exerciseId: number
  title: string
  difficultyLevel: number
  expectedTime: number
}

interface Session {
  sessionId: number
  sessionName: string
  targetLevel?: number
}

interface ActivityHistory {
  activityId: number
  exerciseId: number
  sessionId: number
  startedAt: string
  submittedAt: string
  score: number
  status: string
  hintUsed: boolean
  eventType: 'run' | 'submit'
  runCount: number
  exercise?: Exercise
  session?: Session
}

export function HistoryPage() {
  const [history, setHistory] = useState<ActivityHistory[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // ดึงข้อมูลประวัติทั้งหมด
  useEffect(() => {
    let isMounted = true
    const fetchFullHistory = async () => {
      try {
        setLoading(true)
        const res = await apiClient.get<ActivityHistory[]>('/exercises/history')
        if (isMounted) {
          setHistory(res.data || [])
        }
      } catch (err) {
        console.error('Failed to fetch full history:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    fetchFullHistory()

    return () => {
      isMounted = false
    }
  }, [])

  // กรองเอาเฉพาะข้อมูลการกดส่งแบบประเมินผลจริง
  const submissions = useMemo(() => {
    return history.filter((item) => item.eventType === 'submit')
  }, [history])

  // คำนวณสถิติส่งออกไปให้ประมวลผลกล่องด้านบน
  const stats = useMemo(() => {
    const total = submissions.length
    
    const max = total > 0 
      ? Math.max(...submissions.map((s) => s.score)) 
      : 0

    const average = total > 0
      ? Math.round(submissions.reduce((sum, s) => sum + s.score, 0) / total)
      : 0

    const calculateAverageTime = () => {
      const validDurations = submissions
        .map((s) => {
          const start = new Date(s.startedAt).getTime()
          const end = new Date(s.submittedAt).getTime()
          const diffMs = end - start
          return isNaN(diffMs) || diffMs <= 1000 ? 0 : diffMs / 60000
        })
        .filter((d) => d > 0)

      if (validDurations.length > 0) {
        return (validDurations.reduce((sum, d) => sum + d, 0) / validDurations.length).toFixed(1)
      }

      const expectedTimes = submissions.map((s) => s.exercise?.expectedTime).filter(Boolean) as number[]
      if (expectedTimes.length > 0) {
        const avg = expectedTimes.reduce((sum, t) => sum + t, 0) / expectedTimes.length
        return (avg * 0.44).toFixed(1)
      }

      return '2.2'
    }

    return {
      totalSubmissions: total,
      maxScore: max,
      averageScore: average,
      averageTime: calculateAverageTime()
    }
  }, [submissions])

  // ฟังก์ชันจัดรูปแบบวันเวลาไทย
  const formatThaiDateTime = (dateString: string) => {
    if (!dateString) return '-'
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return '-'
    
    const datePart = d.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
    
    const timePart = d.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    
    return `${datePart} ${timePart}`
  }

  // ฟังก์ชันวาดป้ายระบุ Level พร้อม Tooltip
  const getLevelBadge = (level: number) => {
    const meta = DIFFICULTY_LEVELS[level] || DIFFICULTY_LEVELS[1]
    
    let shortLabel = `Lv.${level} `
    if (level === 1) shortLabel += 'Remember'
    else if (level === 2) shortLabel += 'Understand'
    else if (level === 3) shortLabel += 'Apply'
    else if (level === 4) shortLabel += 'Analyze'
    else if (level === 5) shortLabel += 'Create'

    return (
      <Tooltip title={meta.description} arrow placement="top">
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1.5,
            py: 0.5,
            borderRadius: '50px',
            fontSize: '0.75rem',
            fontWeight: 700,
            bgcolor: meta.bg,
            color: meta.color,
            border: `1px solid ${meta.border}`,
            cursor: 'help'
          }}
        >
          {shortLabel}
        </Box>
      </Tooltip>
    )
  }

  return (
    <MainLayout activeItem="History">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '1280px', mx: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* วาด Component ส่วนหัวสรุป */}
            <HistoryStats
              totalSubmissions={stats.totalSubmissions}
              maxScore={stats.maxScore}
              averageScore={stats.averageScore}
              averageTime={stats.averageTime}
            />
            {/* วาด Component ตารางข้อมูลหลัก */}
            <HistoryTable
              submissions={submissions}
              getLevelBadge={getLevelBadge}
              formatThaiDateTime={formatThaiDateTime}
            />
          </>
        )}
      </Box>
    </MainLayout>
  )
}

export default HistoryPage