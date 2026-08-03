import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography } from '@mui/material'
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
  submissions: ActivityHistory[]
  getLevelBadge: (level: number) => React.ReactNode
  formatThaiDateTime: (dateString: string) => string
}

export function HistoryTable({
  submissions,
  getLevelBadge,
  formatThaiDateTime
}: HistoryTableProps) {
  const navigate = useNavigate()

  return (
    <Card sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
      {/* หัวตาราง */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <ClipboardList size={22} color="#f97316" />
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
          ประวัติและผลการทำโจทย์ทั้งหมด
        </Typography>
      </Box>

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.825rem', py: 2 }}>โจทย์</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.825rem', py: 2 }}>SESSION</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.825rem', py: 2 }}>LEVEL</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.825rem', py: 2 }}>จำนวนที่รัน</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.825rem', py: 2 }}>คะแนน</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.825rem', py: 2 }}>ผลการประเมิณ</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.825rem', py: 2 }}>วันที่และเวลา</TableCell>
              <TableCell sx={{ py: 2 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.length > 0 ? (
              submissions.map((row) => {
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
                    <TableCell sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.85rem' }}>
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

                    {/* ครั้งที่ส่ง */}
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: '1px solid #fdba74',
                          bgcolor: '#fff7ed',
                          color: '#ea580c',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {row.runCount}
                      </Box>
                    </TableCell>

                    {/* คะแนน */}
                    <TableCell sx={{ fontWeight: 800, color: isAccepted ? '#10b981' : '#d97706', fontSize: '0.9rem' }}>
                      {row.score}
                    </TableCell>

                    {/* ผลเฉลย */}
                    <TableCell>
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
                        {isAccepted ? 'Accepted' : 'Rejected'}
                      </Box>
                    </TableCell>

                    {/* วันที่และเวลา */}
                    <TableCell sx={{ color: '#64748b', fontSize: '0.825rem' }}>
                      {formatThaiDateTime(row.submittedAt)}
                    </TableCell>

                    {/* ปุ่มดูผลละเอียด */}
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
                  ยังไม่มีประวัติการส่งคำตอบของแบบฝึกหัด
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}
