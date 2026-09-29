import React, { useState } from 'react'
import {
  Card,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button,
  Skeleton,
} from '@mui/material'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import { TeacherCodeInspectionDialog } from './TeacherCodeInspectionDialog'
import type { RecentSubmissionItem } from '../TeacherDashboard'
import { formatThaiDateTime } from '../../../../utils/dateUtils'

interface TeacherRecentSubmissionsProps {
  submissions: RecentSubmissionItem[]
  isLoading: boolean
}

export const TeacherRecentSubmissions: React.FC<TeacherRecentSubmissionsProps> = ({
  submissions,
  isLoading,
}) => {
  // State สำหรับควบคุม Dialog เปิดดูตรวจโค้ด
  const [selectedSubmission, setSelectedSubmission] = useState<RecentSubmissionItem | null>(null)

  // ดึงเฉพาะ 10 รายการล่าสุดเพื่อแสดงผล
  const recentActivities = submissions.slice(0, 10)

  return (
    <>
      <Card
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
        }}
      >
        {/* หัวการ์ด: ไอคอนและชื่อส่วน */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <HistoryOutlinedIcon sx={{ color: '#4f46e5', fontSize: 22 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
            ประวัติกิจกรรมล่าสุด (Recent Activity)
          </Typography>
        </Box>

        {/* ตารางแสดงรายการกิจกรรม 9 คอลัมน์ ดีไซน์ Flat ไร้กรอบนอกตามแบบ SessionTable */}
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 1040 }}>
            <TableHead sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <TableRow sx={{ '& th': { fontWeight: 700, color: '#475569', fontSize: '12.5px', py: 1.8, whiteSpace: 'nowrap' } }}>
                <TableCell sx={{ minWidth: '170px' }}>ผู้เรียน</TableCell>
                <TableCell sx={{ minWidth: '220px' }}>ชื่อโจทย์ / แบบฝึกหัด</TableCell>
                <TableCell align="center" sx={{ minWidth: '95px' }}>ประเภท</TableCell>
                <TableCell align="center" sx={{ minWidth: '100px' }}>การใช้คำใบ้</TableCell>
                <TableCell align="center" sx={{ minWidth: '105px' }}>ผลการประเมิน</TableCell>
                <TableCell align="center" sx={{ minWidth: '70px' }}>คะแนน</TableCell>
                <TableCell align="center" sx={{ minWidth: '105px' }}>จำนวนครั้งที่รัน</TableCell>
                <TableCell sx={{ minWidth: '140px' }}>วันและเวลาที่ทำ</TableCell>
                <TableCell align="center" sx={{ minWidth: '95px' }}>รายละเอียด</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton width={140} height={28} /></TableCell>
                    <TableCell><Skeleton width={180} height={28} /></TableCell>
                    <TableCell align="center"><Skeleton width={70} height={28} sx={{ mx: 'auto' }} /></TableCell>
                    <TableCell align="center"><Skeleton width={70} height={28} sx={{ mx: 'auto' }} /></TableCell>
                    <TableCell align="center"><Skeleton width={80} height={28} sx={{ mx: 'auto' }} /></TableCell>
                    <TableCell align="center"><Skeleton width={50} height={28} sx={{ mx: 'auto' }} /></TableCell>
                    <TableCell align="center"><Skeleton width={60} height={28} sx={{ mx: 'auto' }} /></TableCell>
                    <TableCell><Skeleton width={120} height={28} /></TableCell>
                    <TableCell align="center"><Skeleton width={75} height={32} sx={{ mx: 'auto' }} /></TableCell>
                  </TableRow>
                ))
              ) : recentActivities.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    align="center"
                    sx={{ py: 6, color: '#94a3b8', fontSize: '14px', fontWeight: 500 }}
                  >
                    ไม่พบข้อมูลกิจกรรมล่าสุดในช่วงเวลาที่เลือก
                  </TableCell>
                </TableRow>
              ) : (
                recentActivities.map((row) => {
                  const isPassed = row.status === 'PASSED'
                  const initialLetter = row.studentName ? row.studentName.charAt(0).toUpperCase() : 'S'

                  return (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{
                        '&:hover': { bgcolor: '#f8fafc' },
                        transition: 'background-color 0.15s ease',
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      {/* คอลัมน์ที่ 1: ผู้เรียน (Avatar + ชื่อจริง + @username) */}
                      <TableCell sx={{ py: 1.5, whiteSpace: 'nowrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              bgcolor: '#f1f5f9',
                              color: '#0f172a',
                              fontSize: '13px',
                              fontWeight: 700,
                              border: '1px solid #e2e8f0',
                            }}
                          >
                            {initialLetter}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px', lineHeight: 1.3 }}>
                              {row.studentName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              @{row.username || 'student'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* คอลัมน์ที่ 2: ชื่อโจทย์ / แบบฝึกหัด (แสดงเฉพาะชื่อโจทย์) */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                          {row.exerciseTitle}
                        </Typography>
                      </TableCell>

                      {/* คอลัมน์ที่ 3: ประเภท (Submit / Run Code สไตล์ Capsule Badge) */}
                      <TableCell align="center" sx={{ py: 1.5, whiteSpace: 'nowrap' }}>
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

                      {/* คอลัมน์ที่ 4: การใช้คำใบ้ */}
                      <TableCell align="center" sx={{ py: 1.5, whiteSpace: 'nowrap' }}>
                        {row.hintUsed ? (
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1.2,
                              py: 0.3,
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 600,
                              bgcolor: '#fffbeb',
                              color: '#b45309',
                              border: '1px solid #fde68a',
                            }}
                          >
                            ใช้คำใบ้
                          </Box>
                        ) : (
                          <Typography sx={{ color: '#94a3b8', fontSize: '13px' }}>
                            -
                          </Typography>
                        )}
                      </TableCell>

                      {/* คอลัมน์ที่ 5: ผลการประเมิน (Passed / Failed คลีนๆ ไม่มีวงเล็บ) */}
                      <TableCell align="center" sx={{ py: 1.5, whiteSpace: 'nowrap' }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.6,
                            px: 1.2,
                            py: 0.3,
                            borderRadius: '6px',
                            bgcolor: isPassed ? '#f0fdf4' : '#fef2f2',
                            color: isPassed ? '#166534' : '#991b1b',
                            fontSize: '12px',
                            fontWeight: 600,
                            border: isPassed ? '1px solid #bbf7d0' : '1px solid #fecaca',
                          }}
                        >
                          {isPassed ? 'Passed' : 'Failed'}
                        </Box>
                      </TableCell>

                      {/* คอลัมน์ที่ 6: คะแนน */}
                      <TableCell align="center" sx={{ py: 1.5, whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontWeight: 500, color: '#0f172a', fontSize: '13px' }}>
                          {row.score ?? 0}
                        </Typography>
                      </TableCell>

                      {/* คอลัมน์ที่ 7: จำนวนครั้งที่รัน */}
                      <TableCell align="center" sx={{ py: 1.5, whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontWeight: 500, fontSize: '13px', color: '#0f172a' }}>
                          {row.runCount} ครั้ง
                        </Typography>
                      </TableCell>

                      {/* คอลัมน์ที่ 8: วันและเวลาที่ทำ (ฟอร์แมตภาษาไทยตามภาพ) */}
                      <TableCell sx={{ py: 1.5, whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                          {formatThaiDateTime(row.submittedAt)}
                        </Typography>
                      </TableCell>

                      {/* คอลัมน์ที่ 9: ปุ่มตรวจโค้ด สไตล์ Solid Dark-Navy */}
                      <TableCell align="center" sx={{ py: 1.5, whiteSpace: 'nowrap' }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => setSelectedSubmission(row)}
                          sx={{
                            borderRadius: '8px',
                            bgcolor: '#0f172a',
                            color: '#ffffff',
                            fontWeight: 600,
                            fontSize: '12px',
                            textTransform: 'none',
                            boxShadow: 'none',
                            py: 0.6,
                            px: 1.8,
                            whiteSpace: 'nowrap',
                            '&:hover': {
                              bgcolor: '#1e293b',
                              boxShadow: 'none',
                            },
                          }}
                        >
                          ตรวจโค้ด
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* หน้าต่างป๊อปอัป Dialog ตรวจโค้ดคำตอบของผู้เรียน */}
      <TeacherCodeInspectionDialog
        open={Boolean(selectedSubmission)}
        onClose={() => setSelectedSubmission(null)}
        submission={selectedSubmission}
      />
    </>
  )
}

export default TeacherRecentSubmissions
