import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Typography, Box, Chip, LinearProgress, TablePagination, Button,
  MenuItem, FormControl, InputLabel, Select, TextField, InputAdornment
} from '@mui/material';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Eye, RotateCcw, Search } from 'lucide-react';
import type { ExerciseAnalyticsData } from '../../../../api/reports';
import { DIFFICULTY_LEVELS } from '../../../../constants/difficulty';

interface ExerciseAnalyticsReportProps {
  data: ExerciseAnalyticsData[];
  isLoading: boolean;
}

export function ExerciseAnalyticsReport({ data, isLoading }: ExerciseAnalyticsReportProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ตัวกรอง (Filters) แบบ Unified Toolbar ในแถวเดียว
  const [search, setSearch] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [topicFilter, setTopicFilter] = useState<string>('');
  const [passRateFilter, setPassRateFilter] = useState<string>('');
  const [attemptFilter, setAttemptFilter] = useState<string>('');

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ดึงรายการหัวข้อบทเรียนทั้งหมดที่มีในข้อมูลแบบไดนามิก
  const availableTopics = useMemo(() => {
    return Array.from(new Set(data.map((d) => d.topic).filter(Boolean)));
  }, [data]);

  // กรองข้อมูลโจทย์ตามตัวกรองที่เลือก และคำค้นหา
  const filteredData = useMemo(() => {
    const q = search.toLowerCase().trim();

    return data.filter((ex) => {
      // 0. กรองตามคำค้นหา (ชื่อโจทย์ หรือ หัวข้อบทเรียน)
      if (q) {
        const matchesTitle = ex.title?.toLowerCase().includes(q);
        const matchesTopic = ex.topic?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTopic) return false;
      }
      // 1. กรองตามระดับความยาก (1-5)
      if (difficultyFilter && ex.difficultyLevel !== Number(difficultyFilter)) {
        return false;
      }
      // 2. กรองตามหัวข้อบทเรียน
      if (topicFilter && ex.topic !== topicFilter) {
        return false;
      }
      // 3. กรองตามอัตราการผ่าน (แบบที่ 1: เกณฑ์ 50% ครึ่งหนึ่ง)
      const passRate = ex.passRateAttempted ?? ex.successRate;
      const attempted = ex.attemptedStudents ?? 0;

      if (passRateFilter === '100') {
        if (attempted === 0 || passRate < 100) return false;
      } else if (passRateFilter === 'majority') {
        if (attempted === 0 || passRate <= 50) return false;
      } else if (passRateFilter === 'need_review') {
        if (attempted === 0 || passRate >= 50) return false;
      } else if (passRateFilter === 'zero') {
        if (attempted === 0 || passRate > 0) return false;
      }

      // 4. กรองตามสถานะการเข้าทำ
      if (attemptFilter === 'attempted' && attempted === 0) return false;
      if (attemptFilter === 'not_attempted' && attempted > 0) return false;

      return true;
    });
  }, [data, search, difficultyFilter, topicFilter, passRateFilter, attemptFilter]);

  const isFiltered = Boolean(
    search.trim() || difficultyFilter || topicFilter || passRateFilter || attemptFilter
  );

  const handleResetFilters = () => {
    setSearch('');
    setDifficultyFilter('');
    setTopicFilter('');
    setPassRateFilter('');
    setAttemptFilter('');
    setPage(0);
  };

  // ป้องกัน Pagination ค้างหน้าที่เกินจากจำนวนข้อมูลจริงเมื่อผลการกรองลดลง
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const safePage = (page >= totalPages && totalPages > 0) ? 0 : page;

  const paginatedData = useMemo(() => {
    return filteredData.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);
  }, [filteredData, safePage, rowsPerPage]);
  
  // สไตล์และข้อความแสดงระดับความยาก 5 ระดับ (Bloom's Taxonomy)
  const getDifficultyChip = (level: number) => {
    const meta = DIFFICULTY_LEVELS[level] || {
      label: `Lv.${level}`,
      color: '#64748b',
      bg: '#f1f5f9',
      border: '#cbd5e1',
    };

    return (
      <Chip 
        label={`Lv.${level} - ${meta.label}`} 
        size="small" 
        sx={{ 
          bgcolor: meta.bg, 
          color: meta.color, 
          border: `1px solid ${meta.border}`, 
          fontWeight: 700, 
          borderRadius: '8px',
          fontSize: '11px',
          height: '24px',
          px: 0.5,
        }} 
      />
    );
  };

  // ฟังก์ชันจัดรูปแบบเวลาใช้จริงเทียบกับเวลาที่ตั้งไว้ (แปลงเป็น ชม./นาที อัตโนมัติเมื่อเกิน 60 นาที)
  const formatTimeSpent = (actualMinutes: number, expectedMinutes: number) => {
    if (actualMinutes < 60) {
      return `${actualMinutes.toFixed(1)} / ${expectedMinutes} นาที`;
    }
    const hours = Math.floor(actualMinutes / 60);
    const remainingMins = Math.round(actualMinutes % 60);
    const timeStr = remainingMins > 0 ? `${hours} ชม. ${remainingMins} น.` : `${hours} ชม.`;
    return `${timeStr} / ${expectedMinutes} นาที`;
  };

  // สไตล์ช่องตัวกรองแบบขอบมน 12px สไตล์เดียวกับ UsersPage พร้อมตัดคำไม่ให้กรอบขยาย
  const selectSx = {
    borderRadius: '12px',
    bgcolor: '#f8fafc',
    height: '46px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#334155',
    '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #e2e8f0' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb', borderWidth: '1.5px' },
    '& .MuiSelect-select': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      pr: '32px !important',
    },
  };

  const labelSx = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#64748b',
  };

  return (
    <Box>
      {/* Header ของตารางวิเคราะห์โจทย์ */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
          สถิติประสิทธิภาพโจทย์แบบฝึกหัด ({filteredData.length}{isFiltered ? ` / ${data.length}` : ''} ข้อ)
        </Typography>
      </Box>

      {/* แถบตัวกรองแถวเดียวสมบูรณ์ (Single Unified Toolbar) - ขอบมน 12px */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* 0. ช่องค้นหาชื่อโจทย์ หรือ หัวข้อบทเรียน */}
        <TextField
          size="small"
          placeholder="ค้นหาชื่อโจทย์ หรือ หัวข้อ..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ color: '#94a3b8', mr: 1 }}>
                  <Search size={18} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
                height: '46px',
                fontSize: '13px',
                '& fieldset': { border: 'none' },
                '&:hover': { bgcolor: '#f1f5f9' },
                transition: 'all 0.15s ease',
              },
            },
          }}
          sx={{ width: { xs: '100%', sm: 220 } }}
        />

        {/* 1. กรองระดับความยาก - กว้าง 180px */}
        <FormControl size="small" sx={{ width: { xs: '100%', sm: 180 }, flexShrink: 0 }}>
          <InputLabel sx={labelSx}>ระดับความยาก</InputLabel>
          <Select
            value={difficultyFilter}
            onChange={(e) => {
              setDifficultyFilter(e.target.value);
              setPage(0);
            }}
            label="ระดับความยาก"
            sx={selectSx}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            <MenuItem value="1">Lv.1 - Remembering & Understanding</MenuItem>
            <MenuItem value="2">Lv.2 - Applying</MenuItem>
            <MenuItem value="3">Lv.3 - Analyzing</MenuItem>
            <MenuItem value="4">Lv.4 - Evaluating</MenuItem>
            <MenuItem value="5">Lv.5 - Creating</MenuItem>
          </Select>
        </FormControl>

        {/* 2. กรองหัวข้อบทเรียน - กว้าง 180px */}
        <FormControl size="small" sx={{ width: { xs: '100%', sm: 180 }, flexShrink: 0 }}>
          <InputLabel sx={labelSx}>หัวข้อบทเรียน</InputLabel>
          <Select
            value={topicFilter}
            onChange={(e) => {
              setTopicFilter(e.target.value);
              setPage(0);
            }}
            label="หัวข้อบทเรียน"
            sx={selectSx}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            {availableTopics.map((topic) => (
              <MenuItem key={topic} value={topic}>{topic}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 3. กรองอัตราการผ่าน - กว้าง 160px */}
        <FormControl size="small" sx={{ width: { xs: '100%', sm: 160 }, flexShrink: 0 }}>
          <InputLabel sx={labelSx}>อัตราการผ่าน</InputLabel>
          <Select
            value={passRateFilter}
            onChange={(e) => {
              setPassRateFilter(e.target.value);
              setPage(0);
            }}
            label="อัตราการผ่าน"
            sx={selectSx}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            <MenuItem value="100">ผ่านทุกคน (100%)</MenuItem>
            <MenuItem value="majority">ผ่านส่วนใหญ่ (เกิน 50%)</MenuItem>
            <MenuItem value="need_review">ต้องทบทวน (ต่ำกว่า 50%)</MenuItem>
            <MenuItem value="zero">ไม่มีใครผ่านเลย (0%)</MenuItem>
          </Select>
        </FormControl>

        {/* 4. กรองสถานะผู้เข้าทำ - กว้าง 160px */}
        <FormControl size="small" sx={{ width: { xs: '100%', sm: 160 }, flexShrink: 0 }}>
          <InputLabel sx={labelSx}>สถานะการเข้าทำ</InputLabel>
          <Select
            value={attemptFilter}
            onChange={(e) => {
              setAttemptFilter(e.target.value);
              setPage(0);
            }}
            label="สถานะการเข้าทำ"
            sx={selectSx}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            <MenuItem value="attempted">มีคนเข้าทำแล้ว</MenuItem>
            <MenuItem value="not_attempted">ยังไม่มีคนทำ (0 คน)</MenuItem>
          </Select>
        </FormControl>

        {/* 5. ปุ่มล้างตัวกรองปุ่มเดียว (รีเซ็ตทั้งค้นหาและ Dropdown ทั้งหมด) */}
        <Button
          variant="outlined"
          onClick={handleResetFilters}
          disabled={!isFiltered}
          startIcon={<RotateCcw size={15} />}
          sx={{
            height: '46px',
            borderRadius: '12px',
            px: 2,
            borderColor: isFiltered ? '#cbd5e1' : '#e2e8f0',
            color: isFiltered ? '#475569' : '#94a3b8',
            bgcolor: isFiltered ? '#f8fafc' : 'transparent',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            '&:hover': {
              bgcolor: '#f1f5f9',
              borderColor: '#94a3b8',
              color: '#0f172a',
            },
            '&.Mui-disabled': {
              bgcolor: 'transparent',
              borderColor: '#e2e8f0',
              color: '#cbd5e1',
            },
            transition: 'all 0.15s ease',
          }}
        >
          ล้างตัวกรอง
        </Button>
      </Box>

      {/* TableContainer ตารางสถิติโจทย์ */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 1050 }}>
          <TableHead sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <TableRow sx={{ '& th': { bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', py: 1.8, fontSize: '13px', fontWeight: 700, color: '#475569' } }}>
              <TableCell>โจทย์ / บทเรียน</TableCell>
              <TableCell>ระดับความยาก</TableCell>
              <TableCell align="center">ผู้เข้าทำ</TableCell>
              <TableCell align="center" width="180px">อัตราการผ่าน</TableCell>
              <TableCell align="center">Run เฉลี่ย</TableCell>
              <TableCell align="center">Submit เฉลี่ย</TableCell>
              <TableCell align="center">เวลาใช้จริง / ตั้งไว้</TableCell>
              <TableCell align="center">รายละเอียด</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Box sx={{ width: '100%', maxWidth: 300, mx: 'auto' }}>
                    <LinearProgress sx={{ borderRadius: 3, height: 6 }} />
                    <Typography variant="caption" sx={{ color: '#64748b', mt: 1, display: 'block' }}>กำลังโหลดสถิติโจทย์...</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <HelpCircle size={36} color="#cbd5e1" style={{ marginBottom: 8 }} />
                  <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '14px' }}>
                    {isFiltered ? 'ไม่พบโจทย์ที่ตรงกับเงื่อนไขตัวกรองที่เลือก' : 'ไม่พบข้อมูลสถิติโจทย์'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((exercise) => {
                const attempted = exercise.attemptedStudents ?? 0;
                const total = exercise.totalStudents ?? 0;
                const passed = exercise.passedStudents ?? 0;
                const passRate = exercise.passRateAttempted ?? exercise.successRate;
                const avgRun = exercise.avgRuns ?? exercise.averageAttempts;
                const avgSub = exercise.avgSubmits ?? 0;

                return (
                  <TableRow key={exercise.exerciseId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{exercise.title}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>หัวข้อ: {exercise.topic}</Typography>
                    </TableCell>
                    
                    {/* ระดับความยาก 5 ระดับ */}
                    <TableCell>{getDifficultyChip(exercise.difficultyLevel)}</TableCell>
                    
                    {/* ผู้เข้าทำ */}
                    <TableCell align="center">
                      <Typography sx={{ fontWeight: 700, fontSize: '13px', color: attempted === 0 ? '#94a3b8' : '#0f172a' }}>
                        {attempted} {total > 0 ? `/ ${total}` : ''} คน
                      </Typography>
                    </TableCell>

                    {/* อัตราการผ่าน - จัดกึ่งกลาง และแสดงข้อความเรียบง่ายเมื่อยังไม่มีคนทำ */}
                    <TableCell align="center">
                      {attempted === 0 ? (
                        <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '13px' }}>
                          ยังไม่มีคนทำ
                        </Typography>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, maxWidth: 150, mx: 'auto' }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: passRate > 70 ? '#10b981' : passRate > 40 ? '#d97706' : '#ef4444', textAlign: 'center' }}>
                            {passRate.toFixed(0)}% ผ่าน
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={passRate} 
                            sx={{ 
                              height: 6, 
                              borderRadius: 3, 
                              bgcolor: '#f1f5f9', 
                              '& .MuiLinearProgress-bar': { 
                                bgcolor: passRate > 70 ? '#10b981' : passRate > 40 ? '#f59e0b' : '#ef4444' 
                              } 
                            }}
                          />
                          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '11px', textAlign: 'center', fontWeight: 600 }}>
                            (ผ่าน {passed}/{attempted} คน)
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    
                    {/* Run เฉลี่ย */}
                    <TableCell align="center">
                      {attempted === 0 ? (
                        <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '13px' }}>-</Typography>
                      ) : (
                        <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#334155' }}>
                          {avgRun.toFixed(1)} ครั้ง
                        </Typography>
                      )}
                    </TableCell>

                    {/* Submit เฉลี่ย */}
                    <TableCell align="center">
                      {attempted === 0 ? (
                        <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '13px' }}>-</Typography>
                      ) : (
                        <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#334155' }}>
                          {avgSub.toFixed(1)} ครั้ง
                        </Typography>
                      )}
                    </TableCell>
                    
                    {/* เวลาใช้จริง / ตั้งไว้ */}
                    <TableCell align="center">
                      {attempted === 0 || !exercise.avgTimeSpentMinutes || exercise.avgTimeSpentMinutes <= 0 ? (
                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>
                          - / {exercise.expectedTimeMinutes} นาที
                        </Typography>
                      ) : (
                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                          {formatTimeSpent(exercise.avgTimeSpentMinutes, exercise.expectedTimeMinutes)}
                        </Typography>
                      )}
                    </TableCell>

                    {/* ปุ่มดูรายบุคคล */}
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Eye size={15} />}
                        onClick={() => navigate(`/reports/exercises/${exercise.exerciseId}`)}
                        sx={{
                          borderRadius: '8px',
                          borderColor: '#cbd5e1',
                          color: '#2563eb',
                          fontWeight: 700,
                          fontSize: '12px',
                          textTransform: 'none',
                          py: 0.5,
                          px: 1.5,
                          whiteSpace: 'nowrap',
                          '&:hover': { bgcolor: '#eff6ff', borderColor: '#93c5fd' }
                        }}
                      >
                        รายละเอียด
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* ระบบเปลี่ยนหน้า Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={safePage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="แสดงแถวต่อหน้า:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count}`}
          sx={{
            borderTop: '1px solid #e2e8f0',
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontSize: '13px',
              color: '#64748b',
              fontWeight: 500,
            },
          }}
        />
      </TableContainer>
    </Box>
  );
}
