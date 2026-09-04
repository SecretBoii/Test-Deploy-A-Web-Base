import { useState, useEffect } from 'react'
import { Box, Alert, Button, Typography } from '@mui/material'
import { apiClient } from '../../../api/client'
import { AdminStatCards } from './admin/AdminStatCards'
import { AdminQuickActions } from './admin/AdminQuickActions'
import { AdminErrorDistribution } from './admin/AdminErrorDistribution'
import { AdminRecentAuditLogs } from './admin/AdminRecentAuditLogs'
import { DashboardTimeFilter, type TimeRangeType } from './admin/DashboardTimeFilter'

export interface DashboardStats {
  totalUsers: number
  totalExercises: number
  totalSubmissionsToday: number
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
  const [timeRange, setTimeRange] = useState<TimeRangeType>('daily')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [errorStats, setErrorStats] = useState<PythonErrorStat[]>([])
  const [auditLogs, setAuditLogs] = useState<SimpleAuditLog[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const loadDashboardData = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // ดึงข้อมูลจริงจาก Backend API
      const [reportsRes, errorsRes, logsRes, exercisesRes] = await Promise.all([
        apiClient.get('/reports/students', { params: { timeRange } }).catch(() => null),
        apiClient.get('/reports/errors', { params: { timeRange } }).catch(() => null),
        apiClient.get('/audit-log?limit=5').catch(() => null),
        apiClient.get('/exercises/manage/all').catch(() => null),
      ])

      // 1. ผู้ใช้งานทั้งหมด (Student Users)
      const totalStudentsCount = reportsRes?.data?.length ?? 0
      
      // 2. แบบฝึกหัดทั้งหมดในระบบ (Total Exercises)
      const totalExercisesCount = exercisesRes?.data?.length ?? 0

      // 3. จำนวนครั้งที่มีการรัน/ส่งตรวจจริง และ อัตราการผ่านสำเร็จ (%)
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

      // 4. คำนวณอัตราการผ่านสำเร็จจริง (%) = (จำนวนครั้งที่ผ่าน / จำนวนครั้งที่ส่งตรวจทั้งหมด) * 100
      const realPassRate = realSubmissionsCount > 0 
        ? Math.min(100, Math.max(0, (realPassedCount / realSubmissionsCount) * 100))
        : 0

      setStats({
        totalUsers: totalStudentsCount,
        totalExercises: totalExercisesCount,
        totalSubmissionsToday: realSubmissionsCount,
        passRatePercentage: Number(realPassRate.toFixed(1)),
      })

      // 5. สถิติข้อผิดพลาดจริงจากฐานข้อมูล (Top Errors)
      if (errorsRes?.data && Array.isArray(errorsRes.data)) {
        setErrorStats(errorsRes.data.map((item: any) => ({
          errorType: item.errorType || 'UnknownError',
          count: item.occurrenceCount || item.count || 0,
          percentage: Number(item.percentage?.toFixed(1) || 0),
        })))
      } else {
        setErrorStats([])
      }

      // 6. ประวัติกิจกรรมล่าสุดจากฐานข้อมูล (Audit Logs)
      setAuditLogs(logsRes?.data?.data || [])

    } catch (error) {
      setErrorMessage('เกิดข้อผิดพลาดในการโหลดข้อมูล Dashboard กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [timeRange])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, pb: 4 }}>
      {/* Header Bar พร้อมปุ่มกรองช่วงเวลา */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            ภาพรวมระบบสำหรับผู้ดูแลระบบ (Admin Dashboard)
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            ติดตามการใช้งาน สถิติข้อผิดพลาด และกิจกรรมล่าสุดแบบเรียลไทม์
          </Typography>
        </Box>
        <DashboardTimeFilter value={timeRange} onChange={setTimeRange} />
      </Box>

      {/* แสดง Error Alert หากดึงข้อมูลล้มเหลว */}
      {errorMessage && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadDashboardData}>
              ลองอีกครั้ง
            </Button>
          }
        >
          {errorMessage}
        </Alert>
      )}

      {/* 1. การ์ดสถิติ KPI ภาพรวม */}
      <AdminStatCards stats={stats} isLoading={isLoading} timeRange={timeRange} />

      {/* 2. แถบปุ่มทางลัดจัดการระบบ */}
      <AdminQuickActions onNavigate={(path) => window.location.href = path} />

      {/* 3. กราฟวิเคราะห์และตาราง Log ล่าสุด */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' }, gap: 3 }}>
        <AdminErrorDistribution errors={errorStats} isLoading={isLoading} />
        <AdminRecentAuditLogs logs={auditLogs} isLoading={isLoading} />
      </Box>
    </Box>
  )
}

export default AdminDashboard