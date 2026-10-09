import { 
  Box, 
  Card, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  Pagination, 
  Chip,
  Skeleton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';
import { formatThaiDateTime } from '../../../utils/dateUtils';

// กำหนด Type ป้องกันการใช้ any ตาม Rule 4 และรองรับโครงสร้างข้อมูลเดิม
export interface LatestActivityHistoryItem {
  activityId: number;
  exerciseId: number;
  sessionId?: number;
  submittedAt: string;
  score: number;
  status?: string;
  eventType?: 'run' | 'submit' | string;
  runCount: number;
  targetLevel?: number;
  exercise?: {
    exerciseId?: number;
    title: string;
    difficultyLevel?: number;
  };
  session?: {
    sessionId?: number;
    sessionName: string;
    targetLevel?: number;
  };
}

interface LatestResultsProps {
  history: LatestActivityHistoryItem[];
  isLoading?: boolean;
  onSelectExercise: (exerciseId: number, sessionId?: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export function LatestResults({ 
  history, 
  isLoading = false,
  onSelectExercise, 
  page, 
  totalPages, 
  onPageChange 
}: LatestResultsProps) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* ส่วนหัวการ์ดและปุ่มไปหน้าดูทั้งหมด */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
          ผลล่าสุด
        </Typography>
        <Button
          size="small"
          onClick={() => navigate('/history')}
          sx={{ color: '#2563eb', textTransform: 'none', fontWeight: 600 }}
        >
          ดูทั้งหมด
        </Button>
      </Box>

      {/* กรอบการ์ดตารางสไตล์เดียวกับตารางใน Teacher/Admin Dashboard */}
      <Card 
        sx={{ 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0', 
          bgcolor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)', 
          overflow: 'hidden' 
        }}
      >
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 1040 }}>
            {/* หัวตารางพื้นหลัง #f8fafc คุมโทนเหมือน Teacher & Admin */}
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
              {isLoading ? (
                [1, 2, 3, 4, 5].map((idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ py: 1.6 }}><Skeleton width="75%" height={20} animation="wave" /></TableCell>
                    <TableCell sx={{ py: 1.6 }}><Skeleton width="60%" height={20} animation="wave" /></TableCell>
                    <TableCell align="center" sx={{ py: 1.6 }}><Skeleton width={55} height={22} animation="wave" sx={{ mx: 'auto', borderRadius: '6px' }} /></TableCell>
                    <TableCell align="center" sx={{ py: 1.6 }}><Skeleton width={28} height={20} animation="wave" sx={{ mx: 'auto' }} /></TableCell>
                    <TableCell align="center" sx={{ py: 1.6 }}><Skeleton width={36} height={20} animation="wave" sx={{ mx: 'auto' }} /></TableCell>
                    <TableCell align="center" sx={{ py: 1.6 }}><Skeleton width={45} height={20} animation="wave" sx={{ mx: 'auto' }} /></TableCell>
                    <TableCell align="center" sx={{ py: 1.6 }}><Skeleton width={68} height={22} animation="wave" sx={{ mx: 'auto', borderRadius: '12px' }} /></TableCell>
                    <TableCell align="center" sx={{ py: 1.6 }}><Skeleton width={90} height={20} animation="wave" sx={{ mx: 'auto' }} /></TableCell>
                    <TableCell align="center" sx={{ py: 1.6 }}><Skeleton width={62} height={26} animation="wave" sx={{ mx: 'auto', borderRadius: '8px' }} /></TableCell>
                  </TableRow>
                ))
              ) : history.length > 0 ? (
                history.map((row) => {
                  const targetLevel = row.targetLevel || row.session?.targetLevel || row.exercise?.difficultyLevel || 1;
                  const diffMeta = DIFFICULTY_LEVELS[targetLevel] || {
                    label: `Level ${targetLevel}`,
                    color: '#0284c7',
                    bg: '#eff6ff',
                    border: '#bfdbfe',
                  };
                  const formattedDate = formatThaiDateTime(row.submittedAt);
                  const isAccepted = row.score >= 80;
                  
                  return (
                    <TableRow 
                      key={row.activityId} 
                      hover
                      sx={{ 
                        '&:hover': { bgcolor: '#f8fafc' },
                        transition: 'background-color 0.15s ease',
                        '&:last-child td, &:last-child th': { border: 0 } 
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

                      {/* 3. ระดับความยาก (แสดงเป็น Badge ตามสไตล์ระบบ) */}
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
                            color: isAccepted ? '#059669' : '#d97706' 
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

                      {/* 7. ผลการประเมิน (Chip ขอบมน 8px มาตรฐานเดียวกับ Teacher/Admin) */}
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

                      {/* 8. วันและเวลาที่ทำ */}
                      <TableCell align="center" sx={{ py: 1.6 }}>
                        <Typography sx={{ fontSize: '12.5px', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {formattedDate}
                        </Typography>
                      </TableCell>

                      {/* 9. การจัดการ (ปุ่มทำอีกครั้ง) */}
                      <TableCell align="center" sx={{ py: 1.6 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => onSelectExercise(row.exerciseId, row.sessionId)}
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
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6, color: '#94a3b8', fontSize: '14px', fontWeight: 500 }}>
                    ยังไม่มีประวัติการทำแบบฝึกหัด
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, borderTop: '1px solid #e2e8f0' }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={onPageChange} 
              color="primary" 
              size="medium"
            />
          </Box>
        )}
      </Card>
    </Box>
  );
}
