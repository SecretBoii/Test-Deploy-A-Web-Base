import { useState, useMemo } from 'react'
import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Tabs, Tab, Pagination } from '@mui/material'
import { ClipboardList, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
  getLevelBadge: (level: number) => React.ReactNode
  formatThaiDateTime: (dateString: string) => string
}

export function HistoryTable({
  history,
  getLevelBadge,
  formatThaiDateTime
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
    <Card sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
      {/* หัวตารางและปุ่มกรอง */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ClipboardList size={22} color="#f97316" />
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            ประวัติและผลการทำโจทย์ทั้งหมด
          </Typography>
        </Box>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => {
            setActiveTab(newValue)
            setPage(1)
          }}
          sx={{
            minHeight: '38px',
            bgcolor: '#f1f5f9',
            borderRadius: '12px',
            p: 0.5,
            '& .MuiTabs-indicator': {
              bgcolor: '#ffffff',
              borderRadius: '8px',
              height: 'calc(100% - 8px)',
              margin: '4px 0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            },
          }}
        >
          <Tab
            value="all"
            label="ทั้งหมด"
            sx={{
              textTransform: 'none',
              minHeight: '30px',
              py: 0.5,
              px: 2,
              fontWeight: 700,
              fontSize: '0.8rem',
              color: '#64748b',
              zIndex: 1,
              '&.Mui-selected': { color: '#0f172a' },
            }}
          />
          <Tab
            value="submit"
            label="ส่งคำตอบ"
            sx={{
              textTransform: 'none',
              minHeight: '30px',
              py: 0.5,
              px: 2,
              fontWeight: 700,
              fontSize: '0.8rem',
              color: '#64748b',
              zIndex: 1,
              '&.Mui-selected': { color: '#0f172a' },
            }}
          />
          <Tab
            value="run"
            label="รันโค้ด"
            sx={{
              textTransform: 'none',
              minHeight: '30px',
              py: 0.5,
              px: 2,
              fontWeight: 700,
              fontSize: '0.8rem',
              color: '#64748b',
              zIndex: 1,
              '&.Mui-selected': { color: '#0f172a' },
            }}
          />
        </Tabs>
      </Box>

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.825rem', py: 2, whiteSpace: 'nowrap', minWidth: '280px' }}>EXERCISE</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.825rem', py: 2, whiteSpace: 'nowrap', minWidth: '210px' }}>SESSION</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.825rem', py: 2, whiteSpace: 'nowrap' }}>LEVEL</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.825rem', py: 2, whiteSpace: 'nowrap' }}>RUN COUNT</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.825rem', py: 2, whiteSpace: 'nowrap' }}>SCORE</TableCell>
              <TableCell align='center' sx={{ fontWeight: 700, color: '#475569', fontSize: '0.825rem', py: 2, whiteSpace: 'nowrap', minWidth: '115px' }}>EVENT</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.825rem', py: 2, whiteSpace: 'nowrap' }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.825rem', py: 2, whiteSpace: 'nowrap',minWidth: '130px' }}>DATE & TIME</TableCell>
              <TableCell sx={{ py: 2 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedHistory.length > 0 ? (
              paginatedHistory.map((row) => {
                const targetLevel = row.exercise?.difficultyLevel || row.session?.targetLevel || 1
                const isAccepted = row.score >= 80

                return (
                  <TableRow
                    key={row.activityId}
                    hover
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(241, 245, 249, 0.4) !important'
                      }
                    }}
                  >
                    {/* ชื่อโจทย์ */}
                    <TableCell sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {row.exercise?.title || 'แบบฝึกหัดทั่วไป'}
                    </TableCell>

                    {/* SESSION */}
                    <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                      {row.session?.sessionName || '-'}
                    </TableCell>

                    {/* LEVEL Badge */}
                    <TableCell>
                      {getLevelBadge(targetLevel)}
                    </TableCell>

                    {/* RUN COUNT */}
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: row.eventType === 'submit' ? '1px solid #cbd5e1' : '1px solid #fdba74',
                          bgcolor: row.eventType === 'submit' ? '#f8fafc' : '#fff7ed',
                          color: row.eventType === 'submit' ? '#475569' : '#ea580c',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {row.runCount}
                      </Box>
                    </TableCell>

                    {/* SCORE */}
                    <TableCell align="center" sx={{ fontWeight: 800, color: isAccepted ? '#10b981' : '#d97706', fontSize: '0.9rem' }}>
                      {row.score}
                    </TableCell>

                    {/* EVEVT */}
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '50px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          bgcolor: row.eventType === 'submit' ? '#eff6ff' : '#f1f5f9',
                          color: row.eventType === 'submit' ? '#2563eb' : '#64748b',
                          border: row.eventType === 'submit' ? '1px solid #bfdbfe' : '1px solid #cbd5e1',
                        }}
                      >
                        {row.eventType === 'submit' ? 'Submit' : 'Run Code'}
                      </Box>
                    </TableCell>

                    {/* STATUS */}
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '50px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          bgcolor: isAccepted ? '#ecfdf5' : '#fff1f2',
                          color: isAccepted ? '#10b981' : '#f43f5e',
                          border: isAccepted ? '1px solid #a7f3d0' : '1px solid #fecdd3',
                        }}
                      >
                        {isAccepted ? 'Passed' : 'Failed'}
                      </Box>
                    </TableCell>

                    {/* DATE & TIMME */}
                    <TableCell align="center" sx={{ color: '#64748b', fontSize: '0.825rem' }}>
                      {formatThaiDateTime(row.submittedAt)}
                    </TableCell>

                    {/* DETAIL */}
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        endIcon={<ChevronRight size={14} />}
                        onClick={() => navigate(`/result/${row.activityId}`)}
                        sx={{
                          borderRadius: '8px',
                          borderColor: '#cbd5e1',
                          color: '#475569',
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          px: 2,
                          py: 0.5,
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: '#94a3b8',
                            bgcolor: '#f8fafc',
                            color: '#0f172a',
                          },
                        }}
                      >
                        ดูผล
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8, color: '#94a3b8' }}>
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

