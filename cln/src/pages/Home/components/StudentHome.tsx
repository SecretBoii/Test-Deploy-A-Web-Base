import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { apiClient } from '../../../api/client'
import { StatsRow, type StudentStats } from './StatsRow'
import { RecentSessions, type RecentSessionItem } from './RecentSessions'
import { LevelProgress, type LevelSummaryItem } from './LevelProgress'
import { LatestResults, type LatestActivityHistoryItem } from './LatestResults'

interface StudentHomeProps {
  username: string
  onSelectExercise: (exerciseId: number, sessionId?: number) => void
}

export function StudentHome({ username = 'Alex', onSelectExercise }: StudentHomeProps) {
  // สถานะและข้อมูลสำหรับบทเรียนล่าสุด
  const [recentSessions, setRecentSessions] = useState<RecentSessionItem[]>([])
  const [loadingRecent, setLoadingRecent] = useState<boolean>(true)

  // สถานะและข้อมูลสำหรับสถิติภาพรวมผู้เรียน
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [loadingStats, setLoadingStats] = useState<boolean>(true)

  // สถานะและข้อมูลสำหรับประวัติการทำโจทย์ล่าสุด
  const [history, setHistory] = useState<LatestActivityHistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  // สถานะและข้อมูลสำหรับความก้าวหน้าตามระดับความยาก
  const [levelsSummary, setLevelsSummary] = useState<LevelSummaryItem[]>([])
  const [loadingLevels, setLoadingLevels] = useState<boolean>(true)

  useEffect(() => {
    // ดึงบทเรียนล่าสุดของผู้เรียน
    const fetchRecentSession = async () => {
      try {
        setLoadingRecent(true)
        const res = await apiClient.get<RecentSessionItem[]>('/exercises/recent-session')
        setRecentSessions(res.data || [])
      } catch (err) {
        console.error('Failed to fetch recent session:', err)
      } finally {
        setLoadingRecent(false)
      }
    }

    // ดึงสถิติจำนวนข้อที่ทำสำเร็จและคะแนนเฉลี่ย
    const fetchDashboardStats = async () => {
      try {
        setLoadingStats(true)
        const res = await apiClient.get<StudentStats>('/exercises/dashboard-stats')
        setStats(res.data)
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err)
      } finally {
        setLoadingStats(false)
      }
    }

    // ดึงสรุปผลงานแยกตามระดับความยาก (Level 1-5)
    const fetchLevelsSummary = async () => {
      try {
        setLoadingLevels(true)
        const res = await apiClient.get<LevelSummaryItem[]>('/exercises/levels-summary')
        setLevelsSummary(res.data || [])
      } catch (err) {
        console.error('Failed to fetch levels summary:', err)
      } finally {
        setLoadingLevels(false)
      }
    }

    fetchRecentSession()
    fetchDashboardStats()
    fetchLevelsSummary()
  }, [])

  useEffect(() => {
    // ดึงประวัติการทำโจทย์แบบแบ่งหน้า (Pagination)
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true)
        const res = await apiClient.get<{ item: LatestActivityHistoryItem[]; totalPage: number }>(
          `/exercises/history?limit=5&page=${page}`
        )
        setHistory(res.data?.item || [])
        setTotalPages(res.data?.totalPage || 1)
      } catch (err) {
        console.error('Failed to fetch history:', err)
      } finally {
        setLoadingHistory(false)
      }
    }
    fetchHistory()
  }, [page])

  return (
    // ปรับโครงสร้าง Layout มาตรฐานเดียวกับหน้า Dashboard และ Session (ความกว้างสูงสุด 1440px กึ่งกลางจอ)
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, color: '#0f172a', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* 1. Header Greeting & Stats Cards Row พร้อม Skeleton ระหว่างโหลดข้อมูล */}
      <StatsRow username={username} stats={stats} isLoading={loadingStats} />

      {/* 2. Middle Section: Recent Sessions & Level Progress */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        <RecentSessions
          loadingRecent={loadingRecent}
          recentSessions={recentSessions}
        />
        <LevelProgress levelsSummary={levelsSummary} isLoading={loadingLevels} />
      </Box>

      {/* 3. Bottom Section: Latest Results Table พร้อม Skeleton แบบแถวตาราง */}
      <LatestResults 
        history={history} 
        isLoading={loadingHistory}
        onSelectExercise={onSelectExercise} 
        page={page}
        totalPages={totalPages}
        onPageChange={(_, value) => setPage(value)}
      />
    </Box>
  )
}

export default StudentHome