import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { apiClient } from '../../../api/client'
import { StatsRow } from './StatsRow'
import { RecentSessions } from './RecentSessions'
import { LevelProgress } from './LevelProgress'
import { LatestResults } from './LatestResults'

interface StudentHomeProps {
  username: string
  onSelectExercise: (exerciseId: number, sessionId?: number) => void
}

export function StudentHome({ username = 'Alex', onSelectExercise }: StudentHomeProps) {
  const [recentSessions, setRecentSessions] = useState<any[]>([])
  const [loadingRecent, setLoadingRecent] = useState<boolean>(true)
  const [stats, setStats] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [levelsSummary, setLevelsSummary] = useState<any[]>([])

  useEffect(() => {
    const fetchRecentSession = async () => {
      try {
        setLoadingRecent(true)
        const res = await apiClient.get('/exercises/recent-session')
        setRecentSessions(res.data || [])
      } catch (err) {
        console.error('Failed to fetch recent session:', err)
      } finally {
        setLoadingRecent(false)
      }
    }

    const fetchDashboardStats = async () => {
      try {
        const res = await apiClient.get('/exercises/dashboard-stats')
        setStats(res.data)
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err)
      }
    }

    const fetchHistory = async () => {
      try {
        const res = await apiClient.get('/exercises/history?limit=5')
        setHistory(res.data || [])
      } catch (err) {
        console.error('Failed to fetch history:', err)
      }
    }

    const fetchLevelsSummary = async () => {
      try {
        const res = await apiClient.get('/exercises/levels-summary')
        setLevelsSummary(res.data || [])
      } catch (err) {
        console.error('Failed to fetch levels summary:', err)
      }
    }

    fetchRecentSession()
    fetchDashboardStats()
    fetchHistory()
    fetchLevelsSummary()
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, color: '#0f172a' }}>
      {/* 1. Header Greeting & Stats Cards Row */}
      <StatsRow username={username} stats={stats} />

      {/* 2. Middle Section: Recent Sessions & Level Progress */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        <RecentSessions
          loadingRecent={loadingRecent}
          recentSessions={recentSessions}
        />
        <LevelProgress levelsSummary={levelsSummary} />
      </Box>

      {/* 3. Bottom Section: Latest Results Table */}
      <LatestResults history={history} onSelectExercise={onSelectExercise} />
    </Box>
  )
}

export default StudentHome