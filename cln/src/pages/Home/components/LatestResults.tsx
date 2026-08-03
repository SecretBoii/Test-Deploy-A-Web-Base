import { Box, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty';

interface LatestResultsProps {
  history: any[];
  onSelectExercise: (exerciseId: number, sessionId?: number) => void;
}

export function LatestResults({ history, onSelectExercise }: LatestResultsProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
          ผลล่าสุด
        </Typography>
        <Button size="small" sx={{ color: '#2563eb', textTransform: 'none', fontWeight: 600 }}>
          ดูทั้งหมด
        </Button>
      </Box>

      <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#eff6ff' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>แบบฝึกหัด</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>เซสชั่น</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>ระดับ</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>จำนวนการรัน</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>คะแนน</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>ผลตรวจ</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>วันที่และเวลา</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}></TableCell>
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
                  
                  return (
                    <TableRow key={row.activityId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 700, color: '#334155', fontSize: '0.85rem' }}>
                        {row.exercise?.title}
                      </TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                        {row.session?.sessionName || '-'}
                      </TableCell>
                      <TableCell sx={{ color: diffColor, fontWeight: 600, fontSize: '0.85rem' }}>
                        {levelLabel}
                      </TableCell>
                      <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem' }}>
                        {row.runCount}
                      </TableCell>
                      <TableCell sx={{ color: '#0284c7', fontWeight: 700, fontSize: '0.85rem' }}>
                        {row.score}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{
                            color: row.eventType === 'submit' ? (row.score > 0 ? '#16a34a' : '#ef4444') : '#64748b',
                            fontWeight: 600,
                          }}
                        >
                          {row.eventType === 'submit' ? (row.score > 0 ? 'Passed' : 'Failed') : 'Run Code'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.8rem' }}>
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
                  <TableCell colSpan={8} align="center" sx={{ py: 3, color: '#64748b' }}>
                    ยังไม่มีประวัติการทำแบบฝึกหัด
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
