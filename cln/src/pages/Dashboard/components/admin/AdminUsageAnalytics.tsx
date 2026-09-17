import React, { useMemo } from 'react'
import { Card, Typography, Box, Skeleton, LinearProgress, Chip } from '@mui/material'

export interface UsageTrendItem {
  periodLabel: string
  userCount: number
}

interface AdminUsageAnalyticsProps {
  selectedDate?: string
  isLoading: boolean
  data?: UsageTrendItem[]
}

export const AdminUsageAnalytics: React.FC<AdminUsageAnalyticsProps> = ({
  selectedDate,
  isLoading,
  data,
}) => {
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return ''
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`
    }
    return dateStr
  }

  const getTodayStr = () => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const todayStr = getTodayStr()
  const isToday = !selectedDate || selectedDate === todayStr

  const rangeDescription = isToday
    ? 'ช่วงเวลาในวันนี้'
    : `วันที่ ${formatDisplayDate(selectedDate)}`

  // 1. อ่านข้อมูลสถิติตามช่วงเวลาที่เลือก (จาก DB เท่านั้น ไม่มี Mockup)
  const chartData: UsageTrendItem[] = useMemo(() => {
    if (data && data.length > 0) {
      return data
    }
    return []
  }, [data])

  // 2. คำนวณยอดรวมทั้งหมด (Total Count)
  const totalCount = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.userCount, 0)
  }, [chartData])

  // 3. คำนวณค่าผู้ใช้สูงสุด เพื่อคิดสัดส่วนความสูงแท่งกราฟ (% Height)
  const maxCount = useMemo(() => {
    return Math.max(...chartData.map((d) => d.userCount), 1)
  }, [chartData])

  // 4. ค้นหาช่วงเวลาที่มีผู้ใช้งานสูงสุด (Peak Usage)
  const peakSlot = useMemo(() => {
    if (chartData.length === 0) return undefined
    return chartData.reduce((prev, current) => (prev.userCount > current.userCount ? prev : current), chartData[0])
  }, [chartData])

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        minHeight: 285,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
          gap: { xs: 3, md: 4 },
          alignItems: 'start',
        }}
      >
        {/* ฝั่งซ้าย: กราฟแท่ง (Visual Bar Chart) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>
              สถิติการเข้าสู่ระบบตามช่วงเวลา (User Login Trends)
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              แสดงความหนาแน่นของการเข้าสู่ระบบ (Login) ตามช่วงเวลา ({rangeDescription})
            </Typography>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 160, gap: 2, pt: 2 }}>
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} variant="rectangular" width="100%" height={`${(i + 1) * 15 + 20}%`} sx={{ borderRadius: '8px 8px 0 0' }} />
              ))}
            </Box>
          ) : chartData.length === 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160 }}>
              <Typography variant="body2" color="text.secondary">
                ยังไม่มีข้อมูลการเข้าสู่ระบบในช่วงเวลานี้
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pt: 1 }}>
              {/* ส่วนแสดงตัวเลขและแท่งกราฟ - ยึดติดขอบฐานล่าง bottom: 0 100% */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justify: 'space-between',
                  height: 135,
                  gap: { xs: 1, sm: 1.5 },
                }}
              >
                {chartData.map((item, idx) => {
                  const heightPercent = Math.round((item.userCount / maxCount) * 100)
                  const isPeak = item.userCount > 0 && item.userCount === peakSlot?.userCount
                  const barHeightPx = item.userCount > 0 ? Math.max((heightPercent * 105) / 100, 8) : 0

                  return (
                    <Box
                      key={idx}
                      sx={{
                        flex: 1,
                        height: 135,
                        position: 'relative',
                      }}
                    >
                      {/* ตัวเลขลอยแนบอยู่บนหัวแท่งพอดี หรืออยู่บนเส้นฐานหากเป็น 0 */}
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'absolute',
                          bottom: `${barHeightPx + 4}px`,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontWeight: item.userCount > 0 ? 700 : 500,
                          color: item.userCount > 0 ? (isPeak ? '#1d4ed8' : '#334155') : '#94a3b8',
                          fontSize: '0.75rem',
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                          transition: 'bottom 0.25s ease-in-out',
                        }}
                      >
                        {item.userCount}
                      </Typography>

                      {/* แสดงแท่งกราฟเฉพาะเมื่อมีข้อมูล (userCount > 0) เท่านั้น */}
                      {item.userCount > 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '100%',
                            maxWidth: 32,
                            height: `${barHeightPx}px`,
                            bgcolor: isPeak ? '#2563eb' : '#93c5fd',
                            borderRadius: '6px 6px 0 0',
                            transition: 'height 0.25s ease-in-out, background-color 0.25s ease-in-out',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: isPeak ? '#1d4ed8' : '#3b82f6',
                              transform: 'translateX(-50%) translateY(-2px)',
                            },
                          }}
                        />
                      )}
                    </Box>
                  )
                })}
              </Box>

              {/* เส้นกั้นฐาน */}
              <Box sx={{ width: '100%', height: '1px', bgcolor: '#e2e8f0' }} />

              {/* ป้ายชื่อช่วงเวลาด้านล่าง */}
              <Box
                sx={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  gap: { xs: 1, sm: 1.5 },
                  pt: 0.5,
                }}
              >
                {chartData.map((item, idx) => {
                  const isPeak = item.userCount > 0 && item.userCount === peakSlot?.userCount
                  return (
                    <Typography
                      key={idx}
                      variant="caption"
                      sx={{
                        flex: 1,
                        color: isPeak ? '#1d4ed8' : '#64748b',
                        fontSize: '0.725rem',
                        fontWeight: isPeak ? 700 : 500,
                        textAlign: 'center',
                        lineHeight: 1.2,
                      }}
                    >
                      {item.periodLabel}
                    </Typography>
                  )
                })}
              </Box>
            </Box>
          )}
        </Box>

        {/*  ฝั่งขวา: รายละเอียดข้อความกิจกรรม (จาก DB 100%) */}
        <Box
          sx={{
            borderLeft: { md: '1px solid #e2e8f0' },
            pl: { md: 3.5 },
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
              รายละเอียดการเข้าสู่ระบบตามช่วงเวลา
            </Typography>
            <Chip
              label={`รวม ${totalCount} ครั้ง`}
              size="small"
              sx={{
                bgcolor: '#f1f5f9',
                color: '#334155',
                fontWeight: 700,
                fontSize: '0.75rem',
                height: 24,
              }}
            />
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={32} sx={{ borderRadius: '8px' }} />
              ))}
            </Box>
          ) : chartData.length === 0 ? (
            <Typography variant="caption" color="text.secondary">
              ยังไม่มีข้อมูลการเข้าสู่ระบบในช่วงเวลานี้
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                maxHeight: 200,
                overflowY: 'auto',
                pr: 0.5,
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: '4px' },
              }}
            >
              {chartData.map((item, idx) => {
                const percent = totalCount > 0 ? Math.round((item.userCount / totalCount) * 100) : 0
                const isPeak = item.userCount > 0 && item.userCount === peakSlot?.userCount

                return (
                  <Box
                    key={idx}
                    sx={{
                      px: 0.75,
                      py: 0.65,
                      borderRadius: '8px',
                      bgcolor: 'transparent',
                      transition: 'all 0.15s ease-in-out',
                      '&:hover': {
                        bgcolor: '#f8fafc',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.25 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: isPeak ? 700 : 600,
                          color: isPeak ? '#1d4ed8' : '#334155',
                          fontSize: '0.75rem',
                        }}
                      >
                        {item.periodLabel}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: item.userCount > 0 ? (isPeak ? '#1d4ed8' : '#2563eb') : '#94a3b8',
                          fontSize: '0.75rem',
                        }}
                      >
                        {item.userCount} ครั้ง ({percent}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percent}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: '#f1f5f9',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: isPeak ? '#2563eb' : '#60a5fa',
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  )
}

export default AdminUsageAnalytics