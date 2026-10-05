import { useState, useEffect, useMemo } from 'react'
import { Box, Alert, Button } from '@mui/material'
import { apiClient } from '../../../api/client'
import { AdminStatCards } from './admin/AdminStatCards'
import { AdminErrorDistribution } from './admin/AdminErrorDistribution'
import { AdminRecentAuditLogs } from './admin/AdminRecentAuditLogs'
import { DashboardTimeFilter } from './admin/DashboardTimeFilter'
import { AdminUsageAnalytics, type UsageTrendItem } from './admin/AdminUsageAnalytics'
import { getTodayStr } from '../../../utils/dateUtils'
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
  roleName?: string
  action: string
  entity: string
  createdAt: string
}

// กำหนด Type ป้องกันการใช้ any ตาม Rule 4
interface StudentReportItem {
  userId: number
  username: string
  totalSubmissions?: number
  passedSubmissions?: number
  completedSessions?: number
  averageScore?: number
}

interface ErrorStatItem {
  errorType?: string
  occurrenceCount?: number
  count?: number
  percentage?: number
}

export function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr)
  // สถิติตามช่วงเวลา (Submissions, Pass Rate)
  const [dateStats, setDateStats] = useState<{ totalSubmissions: number; passRatePercentage: number } | null>(null)
  const [errorStats, setErrorStats] = useState<PythonErrorStat[]>([])
  const [auditLogs, setAuditLogs] = useState<SimpleAuditLog[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  // แยก Loading สำหรับข้อมูลภาพรวมระบบ (Total Users, Total Exercises, Audit Logs) เพื่อแก้ Race Condition
  const [isOverviewLoading, setIsOverviewLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [usageTrends, setUsageTrends] = useState<UsageTrendItem[]>([])
  // ข้อมูลคงที่ภาพรวมระบบที่ไม่ขึ้นกับตัวกรองช่วงเวลา (Total Users, Total Exercises)
  const [systemCounts, setSystemCounts] = useState<{ totalUsers: number; totalExercises: number }>({
    totalUsers: 0,
    totalExercises: 0,
  })

  // 1. ฟังก์ชันโหลดข้อมูลภาพรวมระบบและ Recent Audit Logs (โหลดรอบเดียวตอนเปิดหน้าเว็บ)
  const loadSystemOverview = async () => {
    setIsOverviewLoading(true)
    try {
      const [logsRes, exercisesRes, usersRes] = await Promise.all([
        apiClient.get('/admin/audit-logs?limit=5').catch(() => null),
        apiClient.get('/exercises/dashboard-stats').catch(() => null),
        apiClient.get('/users?page=1&limit=1').catch(() => null),
      ])

      let totalUsersCount = 0
      if (typeof usersRes?.data?.stats?.total === 'number') {
        totalUsersCount = usersRes.data.stats.total
      } else if (typeof usersRes?.data?.total === 'number') {
        totalUsersCount = usersRes.data.total
      } else if (Array.isArray(usersRes?.data)) {
        totalUsersCount = usersRes.data.length
      }

      let totalExercisesCount = 0
      if (typeof exercisesRes?.data?.totalExercises === 'number') {
        totalExercisesCount = exercisesRes.data.totalExercises
      } else if (Array.isArray(exercisesRes?.data)) {
        totalExercisesCount = exercisesRes.data.length
      }

      setSystemCounts({ totalUsers: totalUsersCount, totalExercises: totalExercisesCount })

      const rawLogs = logsRes?.data?.data || (Array.isArray(logsRes?.data) ? logsRes.data : [])
      setAuditLogs(rawLogs)
    } catch {
      // ละเว้น error ภาพรวมเพื่อไม่ให้บล็อกการแสดงผลหลัก
    } finally {
      setIsOverviewLoading(false)
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
        (reportsRes.data as StudentReportItem[]).forEach((s) => {
          const studentSubmissions = typeof s.totalSubmissions === 'number' ? s.totalSubmissions : (s.completedSessions || 0)
          realSubmissionsCount += studentSubmissions
          
          if (typeof s.passedSubmissions === 'number') {
            realPassedCount += s.passedSubmissions
          } else if ((s.averageScore ?? 0) >= 80) {
            realPassedCount += studentSubmissions
          }
        })
      }

      // สถิติข้อผิดพลาดจริงจากฐานข้อมูล (Top Errors)
      const errorList: ErrorStatItem[] = Array.isArray(errorsRes?.data)
        ? errorsRes.data
        : (errorsRes?.data?.errorTypeDistribution || [])

      // หาก totalSubmissions ยังไม่ส่งมาจาก Backend หรือเป็น 0 แต่มีประวัติการเจอ Error ในระบบ ให้ใช้ผลรวม Error เป็นค่าสำรองขั้นต่ำ
      const errorTotal = errorsRes?.data?.totalSystemExceptions 
        ?? errorList.reduce((sum: number, err) => sum + (err.occurrenceCount || err.count || 0), 0)
      if (realSubmissionsCount === 0 && errorTotal > 0) {
        realSubmissionsCount = errorTotal
      }

      // คำนวณอัตราการผ่านสำเร็จจริง (%) = (จำนวนครั้งที่ผ่าน / จำนวนครั้งที่ส่งตรวจทั้งหมด) * 100
      const realPassRate = realSubmissionsCount > 0 
        ? Math.min(100, Math.max(0, (realPassedCount / realSubmissionsCount) * 100))
        : 0

      // อัปเดตเฉพาะสถิติตามวันที่ (แก้ปัญหา Race Condition: ไม่ดึงยอดผู้เรียนมาทับ totalUsers เด็ดขาด)
      setDateStats({
        totalSubmissions: realSubmissionsCount,
        passRatePercentage: Number(realPassRate.toFixed(1)),
      })

      if (errorList.length > 0) {
        setErrorStats(errorList.map((item) => ({
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

  // รวมข้อมูลสถิติภาพรวมระบบ (Users, Exercises) เข้ากับสถิติตามช่วงเวลา (Submissions, Pass Rate)
  // แยกความเป็นอิสระชัดเจน ไม่เกิด Race Condition หรือค่าสถิติกระโดด
  const combinedStats = useMemo<DashboardStats | null>(() => {
    return {
      totalUsers: systemCounts.totalUsers,
      totalExercises: systemCounts.totalExercises,
      totalSubmissions: dateStats?.totalSubmissions ?? 0,
      passRatePercentage: dateStats?.passRatePercentage ?? 0,
    }
  }, [systemCounts, dateStats])

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

      {/* 1. การ์ดสถิติ KPI ภาพรวม (แยก Loading Overview และ Daily Stats เพื่อป้องกัน Race Condition) */}
      <AdminStatCards
        stats={combinedStats}
        isLoading={isLoading}
        isOverviewLoading={isOverviewLoading}
        selectedDate={selectedDate}
      />

      {/* 2. กราฟวิเคราะห์สถิติการเข้าใช้งานตามช่วงเวลา */}
      <AdminUsageAnalytics selectedDate={selectedDate} isLoading={isLoading} data={usageTrends} />

      {/* 3. กราฟวิเคราะห์และตาราง Log ล่าสุด */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' }, gap: 3 }}>
        <AdminErrorDistribution errors={errorStats} isLoading={isLoading} />
        <AdminRecentAuditLogs logs={auditLogs} isLoading={isOverviewLoading} />
      </Box>
    </Box>
  )
}

export default AdminDashboard