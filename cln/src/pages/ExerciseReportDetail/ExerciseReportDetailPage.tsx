import { Box, Typography, Button, Card, CircularProgress } from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MainLayout } from '../../components/Layout/MainLayout';
import {
  getExerciseStudentBreakdown,
  type ExerciseStudentBreakdownResponse,
  type StudentActivityItem,
  type ExerciseStudentItem,
} from '../../api/reports';
import { ExerciseHeaderCard } from './components/ExerciseHeaderCard';
import { ExerciseKpiCards } from './components/ExerciseKpiCards';
import { ExerciseStudentFilters } from './components/ExerciseStudentFilters';
import { ExerciseStudentTable } from './components/ExerciseStudentTable';
import { CodeInspectionDialog } from '../StudentReportDetail/components/CodeInspectionDialog';

/**
 * หน้าวิเคราะห์ผลงานและสถิติรายบุคคลของแบบฝึกหัด (Exercise Report Detail Page)
 * ทำหน้าที่เป็น Page Orchestrator ในการดึงข้อมูลจาก API, ควบคุม URL Parameters, 
 * จัดการ Filter/Search State และกระจายการแสดงผลไปยังคอมโพเนนต์ย่อยในโฟลเดอร์ components/
 */
export default function ExerciseReportDetailPage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<ExerciseStudentBreakdownResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<StudentActivityItem | null>(null);

  // ระบบแบ่งหน้า (Pagination) สำหรับรายชื่อนักศึกษา
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ดึงข้อมูลสถิติของโจทย์และผลงานนักศึกษารายคนจาก Backend
  useEffect(() => {
    if (!exerciseId) return;
    const fetchBreakdown = async () => {
      setLoading(true);
      try {
        const res = await getExerciseStudentBreakdown(Number(exerciseId));
        setData(res);
      } catch (err) {
        console.error('ไม่สามารถดึงข้อมูลนักศึกษารายข้อได้:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBreakdown();
  }, [exerciseId]);

  const exercise = data?.exercise;
  const stats = data?.stats;

  // กรองรายชื่อนักศึกษาตามข้อความค้นหาและสถานะการประเมิน
  const filteredStudents = useMemo(() => {
    if (!data?.students) return [];
    return data.students.filter((st) => {
      if (statusFilter && st.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return st.fullName.toLowerCase().includes(q) || st.username.toLowerCase().includes(q);
      }
      return true;
    });
  }, [data?.students, search, statusFilter]);

  const isFiltered = Boolean(search.trim() || statusFilter);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(0);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPage(0);
  };

  // เปิดหน้าต่าง Modal ตรวจดูโค้ดภาษา Python ล่าสุดของนักศึกษาที่เลือก
  const handleInspectCode = (st: ExerciseStudentItem) => {
    if (st.latestActivity && exercise) {
      setSelectedActivity({
        ...st.latestActivity,
        exercise: {
          exerciseId: exercise.exerciseId,
          title: exercise.title,
          topic: exercise.topic,
          difficultyLevel: exercise.difficultyLevel,
          expectedTime: exercise.expectedTime,
        },
      });
    }
  };

  return (
    <MainLayout activeItem="Reports">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: '1440px', margin: '0 auto', pb: 6 }}>
        
        {/* ปุ่มย้อนกลับไปหน้ารายงานหลัก */}
        <Box>
          <Button
            variant="text"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate('/reports?tab=exercises')}
            sx={{
              color: '#475569',
              fontWeight: 700,
              fontSize: '14px',
              textTransform: 'none',
              px: 1.5,
              py: 0.8,
              borderRadius: '10px',
              bgcolor: '#ffffff',
              border: '1px solid #e2e8f0',
              '&:hover': { bgcolor: '#f8fafc', color: '#0f172a' },
            }}
          >
            ย้อนกลับไปหน้ารายงาน
          </Button>
        </Box>

        {loading ? (
          <Card sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <CircularProgress size={36} />
            <Typography variant="body2" sx={{ mt: 2, color: '#64748b', fontWeight: 600 }}>
              กำลังโหลดข้อมูลสถิติของโจทย์ข้อนี้...
            </Typography>
          </Card>
        ) : exercise && stats ? (
          <>
            {/* ส่วนที่ 1: การ์ดบริบทรายละเอียดโจทย์ */}
            <ExerciseHeaderCard exercise={exercise} />

            {/* ส่วนที่ 2: การ์ด KPI ตัวชี้วัดสำคัญ 5 กล่อง */}
            <ExerciseKpiCards stats={stats} />

            {/* ส่วนที่ 3: ตารางรายชื่อนักศึกษา พร้อมตัวกรองและระบบแบ่งหน้า */}
            <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <ExerciseStudentFilters
                filteredCount={filteredStudents.length}
                search={search}
                onSearchChange={handleSearchChange}
                statusFilter={statusFilter}
                onStatusFilterChange={handleStatusFilterChange}
                onReset={handleResetFilters}
                isFiltered={isFiltered}
              />

              <ExerciseStudentTable
                students={filteredStudents}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                onInspectCode={handleInspectCode}
              />
            </Card>
          </>
        ) : null}

        {/* ส่วนที่ 4: หน้าต่าง Dialog ตรวจโค้ดภาษา Python (ใช้คอมโพเนนต์เดียวกับ StudentReportDetail) */}
        <CodeInspectionDialog
          open={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
          activity={selectedActivity}
        />
      </Box>
    </MainLayout>
  );
}
