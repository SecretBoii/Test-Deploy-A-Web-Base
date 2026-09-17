import { useState, useEffect, useMemo } from 'react'
import { Box, Alert, Button } from '@mui/material'
import { apiClient } from '../../../api/client'
import { AdminStatCards } from './admin/AdminStatCards'
import { AdminErrorDistribution } from './admin/AdminErrorDistribution'
import { AdminRecentAuditLogs } from './admin/AdminRecentAuditLogs'
import { DashboardTimeFilter } from './admin/DashboardTimeFilter'
import { AdminUsageAnalytics, type UsageTrendItem } from './admin/AdminUsageAnalytics'
export interface DashboardStats {
  totalUsers: number
  totalExercises: number
  totalSubmissions: number
  passRatePercentage: number
}

export interface PythonErrorStat {
  errorType: string
  count: number
  percentage: number
}

export interface SimpleAuditLog {
  id: number
  username: string
  action: string
  entity: string
  createdAt: string
}

export function AdminDashboard() {
  // คำนวณวันปัจจุบันรูปแบบ YYYY-MM-DD ตามเวลาท้องถิ่น
  const getTodayStr = () => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [errorStats, setErrorStats] = useState<PythonErrorStat[]>([])
  const [auditLogs, setAuditLogs] = useState<SimpleAuditLog[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [usageTrends, setUsageTrends] = useState<UsageTrendItem[]>([])
  // ข้อมูลคงที่ภาพรวมระบบที่ไม่ขึ้นกับตัวกรองช่วงเวลา (Total Users, Total Exercises)
  const [systemCounts, setSystemCounts] = useState<{ totalUsers: number; totalExercises: number }>({
    totalUsers: 0,
    totalExercises: 0,
  })

  // 1. ฟังก์ชันโหลดข้อมูลภาพรวมระบบและ Recent Audit Logs (โหลดรอบเดียวตอนเปิดหน้าเว็บ)
  const loadSystemOverview = async () => {
    try {
      const [logsRes, exercisesRes, usersRes] = await Promise.all([
        apiClient.get('/admin/audit-logs?limit=5').catch(() => null),
        apiClient.get('/exercises/manage/all').catch(() => null),
        apiClient.get('/users').catch(() => null),
      ])

      let totalUsersCount = 0
      if (Array.isArray(usersRes?.data)) {
        totalUsersCount = usersRes.data.length
      } else if (usersRes?.data?.total) {
        totalUsersCount = usersRes.data.total
      }

      const totalExercisesCount = exercisesRes?.data?.length ?? 0
      setSystemCounts({ totalUsers: totalUsersCount, totalExercises: totalExercisesCount })

      const rawLogs = logsRes?.data?.data || (Array.isArray(logsRes?.data) ? logsRes.data : [])
      setAuditLogs(rawLogs)
    } catch {
      // ละเว้น error ภาพรวมเพื่อไม่ให้บล็อกการแสดงผลหลัก
    }
  }

  // 2. ฟังก์ชันโหลดข้อมูลสถิติตามช่วงเวลา (ยิงเฉพาะ 3 APIs ที่ขึ้นกับช่วงวันที่เลือก)
  const loadDashboardData = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // ดึงเฉพาะข้อมูลสถิติที่ขึ้นกับวันที่เลือก (selectedDate)
      const params = { startDate: selectedDate, endDate: selectedDate }
      const [reportsRes, errorsRes, usageRes] = await Promise.all([
        apiClient.get('/reports/students', { params }).catch(() => null),
        apiClient.get('/reports/errors', { params }).catch(() => null),
        apiClient.get('/reports/usage-analytics', { params }).catch(() => null),
      ])

      // คำนวณจำนวนครั้งที่มีการรัน/ส่งตรวจจริง และ อัตราการผ่านสำเร็จ (%)
      let realSubmissionsCount = 0
      let realPassedCount = 0

      if (reportsRes?.data && Array.isArray(reportsRes.data)) {
        reportsRes.data.forEach((s: any) => {
          const studentSubmissions = typeof s.totalSubmissions === 'number' ? s.totalSubmissions : (s.completedSessions || 0)
          realSubmissionsCount += studentSubmissions
          
          if (typeof s.passedSubmissions === 'number') {
            realPassedCount += s.passedSubmissions
          } else if (s.averageScore >= 80) {
            realPassedCount += studentSubmissions
          }
        })
      }

      // หาก totalSubmissions ยังไม่ส่งมาจาก Backend หรือเป็น 0 แต่มีประวัติการเจอ Error ในระบบ ให้ใช้ผลรวม Error เป็นค่าสำรองขั้นต่ำ
      if (realSubmissionsCount === 0 && errorsRes?.data && Array.isArray(errorsRes.data)) {
        const errorTotal = errorsRes.data.reduce((sum: number, err: any) => sum + (err.occurrenceCount || err.count || 0), 0);
        if (errorTotal > 0) {
          realSubmissionsCount = errorTotal;
        }
      }

      // คำนวณอัตราการผ่านสำเร็จจริง (%) = (จำนวนครั้งที่ผ่าน / จำนวนครั้งที่ส่งตรวจทั้งหมด) * 100
      const realPassRate = realSubmissionsCount > 0 
        ? Math.min(100, Math.max(0, (realPassedCount / realSubmissionsCount) * 100))
        : 0

      setStats((prev) => ({
        totalUsers: systemCounts.totalUsers || prev?.totalUsers || (reportsRes?.data?.length ?? 0),
        totalExercises: systemCounts.totalExercises || prev?.totalExercises || 0,
        totalSubmissions: realSubmissionsCount,
        passRatePercentage: Number(realPassRate.toFixed(1)),
      }))

      // สถิติข้อผิดพลาดจริงจากฐานข้อมูล (Top Errors)
      if (errorsRes?.data && Array.isArray(errorsRes.data)) {
        setErrorStats(errorsRes.data.map((item: any) => ({
          errorType: item.errorType || 'UnknownError',
          count: item.occurrenceCount || item.count || 0,
          percentage: Number(item.percentage?.toFixed(1) || 0),
        })))
      } else {
        setErrorStats([])
      }

      // สถิติความหนาแน่นของผู้ใช้งานตามช่วงเวลา (Usage Trends)
      if (usageRes?.data && Array.isArray(usageRes.data)) {
        setUsageTrends(usageRes.data)
      } else {
        setUsageTrends([])
      }

    } catch (error) {
      setErrorMessage('เกิดข้อผิดพลาดในการโหลดข้อมูล Dashboard กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }

  // โหลดข้อมูลภาพรวมระบบรอบเดียวตอนเปิดหน้าเว็บ
  useEffect(() => {
    loadSystemOverview()
  }, [])

  // โหลดข้อมูลสถิติใหม่เฉพาะเมื่อผู้ใช้เปลี่ยนตัวกรองวันที่ (selectedDate)
  useEffect(() => {
    loadDashboardData()
  }, [selectedDate])

  // รวมข้อมูลสถิติภาพรวมระบบ (Users, Exercises) เข้ากับสถิติตามช่วงเวลา (Submissions, Pass Rate) อย่างแม่นยำ
  const combinedStats = useMemo<DashboardStats | null>(() => {
    if (!stats) return null
    return {
      ...stats,
      totalUsers: systemCounts.totalUsers || stats.totalUsers,
      totalExercises: systemCounts.totalExercises || stats.totalExercises,
    }
  }, [stats, systemCounts])

  const handleRetry = () => {
    loadSystemOverview()
    loadDashboardData()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, pb: 4 }}>
      {/* Header Bar พร้อมปุ่มกรองวันที่แบบเลือกวันเดียว (Single Date Filter) */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <DashboardTimeFilter
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </Box>

      {/* แสดง Error Alert หากดึงข้อมูลล้มเหลว */}
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

      {/* 1. การ์ดสถิติ KPI ภาพรวม */}
      <AdminStatCards stats={combinedStats} isLoading={isLoading} selectedDate={selectedDate} />

      {/* 2. กราฟวิเคราะห์สถิติการเข้าใช้งานตามช่วงเวลา */}
      <AdminUsageAnalytics selectedDate={selectedDate} isLoading={isLoading} data={usageTrends} />

      {/* 3. กราฟวิเคราะห์และตาราง Log ล่าสุด */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' }, gap: 3 }}>
        <AdminErrorDistribution errors={errorStats} isLoading={isLoading} />
        <AdminRecentAuditLogs logs={auditLogs} isLoading={isLoading} />
      </Box>
    </Box>
  )
}

export default AdminDashboard