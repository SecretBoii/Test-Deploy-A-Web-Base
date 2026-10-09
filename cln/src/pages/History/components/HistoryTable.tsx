import { useState, useMemo } from 'react'
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Tabs,
  Tab,
  Pagination,
  Chip,
} from '@mui/material'
import { ClipboardList } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty'
import { formatThaiDateTime } from '../../../utils/dateUtils'

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

interface HistoryTableProps {
  history: ActivityHistory[]
  getLevelBadge?: (level: number) => React.ReactNode
  formatThaiDateTime?: (dateString: string) => string
}

export function HistoryTable({
  history,
}: HistoryTableProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'all' | 'submit' | 'run'>('all')
  const [page, setPage] = useState<number>(1)
  const rowsPerPage = 10

  const filteredHistory = useMemo(() => {
    if (activeTab === 'submit') {
      return history.filter((item) => item.eventType === 'submit')
    }
    if (activeTab === 'run') {
      return history.filter((item) => item.eventType === 'run')
    }
    return history
  }, [history, activeTab])

  const paginatedHistory = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    return filteredHistory.slice(start, start + rowsPerPage)
  }, [filteredHistory, page])

  const totalPages = Math.ceil(filteredHistory.length / rowsPerPage)

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
        overflow: 'hidden',
      }}
    >
      {/* ส่วนหัวการ์ดและปุ่มสลับแท็บกรองกิจกรรม */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ClipboardList size={22} color="#f97316" />
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            ประวัติและผลการทำโจทย์ทั้งหมด
          </Typography>
        </Box>
        {/* แถบแท็บ Capsule Pills กรองประเภทกิจกรรม สไตล์เดียวกับหน้ารายงาน (รูปที่ 2) */}
        <Box
          sx={{
            display: 'inline-flex',
            p: '4px',
            bgcolor: '#f1f5f9',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            maxWidth: '100%',
            overflowX: 'auto',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => {
              setActiveTab(newValue)
              setPage(1)
            }}
            sx={{
              minHeight: 'auto',
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTabs-flexContainer': {
                gap: '4px',
              },
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '13px',
                minHeight: '34px',
                color: '#64748b',
                px: 2,
                py: 0.6,
                borderRadius: '9px',
                transition: 'all 0.15s ease',
                '&:hover': {
                  color: '#0f172a',
                  bgcolor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-selected': {
                  bgcolor: '#ffffff',
                  color: '#0f172a',
                  fontWeight: 700,
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)',
                },
              },
            }}
          >
            <Tab value="all" label="ทั้งหมด" />
            <Tab value="submit" label="ส่งคำตอบ" />
            <Tab value="run" label="รันโค้ด" />
          </Tabs>
        </Box>
      </Box>

      {/* ตารางแสดงผลประวัติ ถอดแบบสไตล์ตรงตามหน้า Home (LatestResults) */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 1040 }}>
          {/* หัวตารางพื้นหลัง #f8fafc คุมโทนเหมือนหน้า Home */}
          <TableHead sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <TableRow
              sx={{
                '& th': {
                  fontWeight: 700,
                  color: '#475569',
                  fontSize: '13px',
                  py: 1.8,
                  whiteSpace: 'nowrap',
                },
              }}
            >
              <TableCell sx={{ minWidth: '220px' }}>ชื่อโจทย์ / แบบฝึกหัด</TableCell>
              <TableCell sx={{ minWidth: '180px' }}>บทเรียน (Session)</TableCell>
              <TableCell align="center" sx={{ minWidth: '130px' }}>ระดับความยาก</TableCell>
              <TableCell align="center" sx={{ minWidth: '110px' }}>จำนวนครั้งที่รัน</TableCell>
              <TableCell align="center" sx={{ minWidth: '80px' }}>คะแนน</TableCell>
              <TableCell align="center" sx={{ minWidth: '110px' }}>ประเภทกิจกรรม</TableCell>
              <TableCell align="center" sx={{ minWidth: '110px' }}>ผลการประเมิน</TableCell>
              <TableCell align="center" sx={{ minWidth: '150px' }}>วันและเวลาที่ทำ</TableCell>
              <TableCell align="center" sx={{ minWidth: '100px' }}>การจัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedHistory.length > 0 ? (
              paginatedHistory.map((row) => {
                const targetLevel = row.exercise?.difficultyLevel || row.session?.targetLevel || 1
                const diffMeta = DIFFICULTY_LEVELS[targetLevel] || {
                  label: `Level ${targetLevel}`,
                  color: '#0284c7',
                  bg: '#eff6ff',
                  border: '#bfdbfe',
                }
                const formattedDate = formatThaiDateTime(row.submittedAt)
                const isAccepted = row.score >= 80

                return (
                  <TableRow
                    key={row.activityId}
                    hover
                    onClick={() => navigate(`/result/${row.activityId}`)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#f8fafc' },
                      transition: 'background-color 0.15s ease',
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    {/* 1. ชื่อโจทย์ / แบบฝึกหัด */}
                    <TableCell sx={{ py: 1.6, whiteSpace: 'nowrap' }}>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px' }}>
                        {row.exercise?.title || 'แบบฝึกหัดทั่วไป'}
                      </Typography>
                    </TableCell>

                    {/* 2. บทเรียน (Session) */}
                    <TableCell sx={{ py: 1.6, whiteSpace: 'nowrap' }}>
                      <Typography sx={{ color: '#64748b', fontSize: '13px' }}>
                        {row.session?.sessionName || '-'}
                      </Typography>
                    </TableCell>

                    {/* 3. ระดับความยาก (แสดงเป็น Badge สีมน 6px ตามสไตล์หน้า Home) */}
                    <TableCell align="center" sx={{ py: 1.6 }}>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1.2,
                          py: 0.3,
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          bgcolor: diffMeta.bg || '#f1f5f9',
                          color: diffMeta.color || '#475569',
                          border: `1px solid ${diffMeta.border || '#e2e8f0'}`,
                        }}
                      >
                        {diffMeta.label}
                      </Box>
                    </TableCell>

                    {/* 4. จำนวนครั้งที่รัน */}
                    <TableCell align="center" sx={{ py: 1.6 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#64748b' }}>
                        {row.runCount} ครั้ง
                      </Typography>
                    </TableCell>

                    {/* 5. คะแนน */}
                    <TableCell align="center" sx={{ py: 1.6 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: '13.5px',
                          color: isAccepted ? '#059669' : '#d97706',
                        }}
                      >
                        {row.score}
                      </Typography>
                    </TableCell>

                    {/* 6. ประเภทกิจกรรม (Submit / Run Code แคปซูลสไตล์ Slate) */}
                    <TableCell align="center" sx={{ py: 1.6 }}>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1.2,
                          py: 0.3,
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          bgcolor: row.eventType === 'submit' ? '#f1f5f9' : '#f8fafc',
                          color: row.eventType === 'submit' ? '#0f172a' : '#64748b',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {row.eventType === 'submit' ? 'Submit' : 'Run Code'}
                      </Box>
                    </TableCell>

                    {/* 7. ผลการประเมิน (Chip ขอบมน 8px มาตรฐานระบบ) */}
                    <TableCell align="center" sx={{ py: 1.6 }}>
                      <Chip
                        label={isAccepted ? 'Passed' : 'Failed'}
                        size="small"
                        sx={{
                          bgcolor: isAccepted ? '#ecfdf5' : '#fef2f2',
                          color: isAccepted ? '#059669' : '#dc2626',
                          border: `1px solid ${isAccepted ? '#a7f3d0' : '#fecaca'}`,
                          fontWeight: 700,
                          fontSize: '12px',
                          borderRadius: '8px',
                          height: '24px',
                          px: 0.8,
                        }}
                      />
                    </TableCell>

                    {/* 8. วันและเวลาที่ทำ (ฟอร์แมตภาษาไทยแบบย่อ) */}
                    <TableCell align="center" sx={{ py: 1.6 }}>
                      <Typography sx={{ fontSize: '12.5px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {formattedDate}
                      </Typography>
                    </TableCell>

                    {/* 9. การจัดการ (ปุ่มทำอีกครั้ง สไตล์ปุ่ม Outline สีน้ำเงิน) */}
                    <TableCell align="center" sx={{ py: 1.6 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          const url = row.sessionId
                            ? `/editor/${row.exerciseId}?sessionId=${row.sessionId}`
                            : `/editor/${row.exerciseId}`
                          navigate(url)
                        }}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '12px',
                          borderColor: '#cbd5e1',
                          color: '#2563eb',
                          bgcolor: '#ffffff',
                          whiteSpace: 'nowrap',
                          py: 0.4,
                          px: 1.5,
                          '&:hover': {
                            bgcolor: '#eff6ff',
                            borderColor: '#93c5fd',
                          },
                        }}
                      >
                        ทำอีกครั้ง
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 6, color: '#94a3b8', fontSize: '14px', fontWeight: 500 }}>
                  {activeTab === 'all'
                    ? 'ยังไม่มีประวัติการทำแบบฝึกหัด'
                    : activeTab === 'submit'
                    ? 'ยังไม่มีประวัติการส่งคำตอบ'
                    : 'ยังไม่มีประวัติการรันโค้ด'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, borderTop: '1px solid #e2e8f0', mt: 2 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, value) => setPage(value)} 
            color="primary" 
            size="medium"
          />
        </Box>
      )}
    </Card>
  )
}


