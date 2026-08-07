import { Box, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';

interface LatestResultsProps {
  history: any[];
  onSelectExercise: (exerciseId: number, sessionId?: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value:number) => void;
}

export function LatestResults({ history, onSelectExercise, page, totalPages, onPageChange }: LatestResultsProps) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

      <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#eff6ff' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', whiteSpace: 'nowrap', minWidth: '280px' }}>EXERCISE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', whiteSpace: 'nowrap', minWidth: '210px'  }}>SESSION</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', whiteSpace: 'nowrap', minWidth: '235px' }}>LEVEL</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>RUN COUNT</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', whiteSpace: 'nowrap', minWidth: '100px' }}>SCORE</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', whiteSpace: 'nowrap', minWidth: '115px' }}>EVENT</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>STATUS</TableCell>
                <TableCell align="center"sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>DATE & TIME</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', minWidth: '100px'  }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.length > 0 ? (
                history.map((row) => {
                  const targetLevel = row.targetLevel || row.session?.targetLevel || 1;
                  const diffColor = DIFFICULTY_LEVELS[targetLevel]?.color || '#0284c7';
                  const levelLabel = DIFFICULTY_LEVELS[targetLevel]?.label || `Level ${targetLevel}`;
                  const formattedDate = new Date(row.submittedAt).toLocaleString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const isAccepted = row.score >= 80;
                  
                  return (
                    <TableRow key={row.activityId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 700, color: '#334155', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        {row.exercise?.title}
                      </TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                        {row.session?.sessionName || '-'}
                      </TableCell>
                      <TableCell sx={{ color: diffColor, fontWeight: 600, fontSize: '0.85rem' }}>
                        {levelLabel}
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem' }}>
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
                      <TableCell align="center" sx={{ color: isAccepted ? '#10b981' : '#d97706', fontWeight: 700, fontSize: '0.85rem' }}>
                        {row.score}
                      </TableCell>
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
                      <TableCell align="center" sx={{ color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {formattedDate}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => onSelectExercise(row.exerciseId, row.sessionId)}
                          sx={{ color: '#2563eb', textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
                        >
                          ทำอีกครั้ง
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3, color: '#64748b' }}>
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
          size="medium"/>
        </Box>
        )}
      </Card>
    </Box>
  );
}
