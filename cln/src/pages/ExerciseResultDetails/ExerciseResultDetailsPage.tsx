import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, CircularProgress, Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { MainLayout } from '../../components/Layout/MainLayout';
import {
  getExerciseStudentBreakdown,
  type ExerciseStudentBreakdownResponse,
  type ExerciseStudentItem,
} from '../../api/reports';
import { TeacherExerciseHeaderCard } from './components/TeacherExerciseHeaderCard';
import { TeacherExerciseKpiCards } from './components/TeacherExerciseKpiCards';
import { TeacherStudentTable } from './components/TeacherStudentTable';
import { TeacherCodeInspectionModal } from './components/TeacherCodeInspectionModal';

export default function ExerciseResultDetailsPage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<ExerciseStudentBreakdownResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStudent, setSelectedStudent] = useState<ExerciseStudentItem | null>(null);

  // ดึงข้อมูลรายละเอียดของโจทย์และรายชื่อนักศึกษาในข้อนี้จาก Backend
  useEffect(() => {
    const id = Number(exerciseId);
    if (!exerciseId || isNaN(id)) return;
    let ignore = false;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getExerciseStudentBreakdown(id);
        if (!ignore) {
          setData(res);
        }
      } catch (err) {
        if (!ignore) {
          console.error('ไม่สามารถดึงข้อมูลผลงานนักศึกษาในโจทย์ข้อนี้ได้:', err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      ignore = true;
    };
  }, [exerciseId]);

  const exercise = data?.exercise;
  const stats = data?.stats;
  const students = data?.students || [];

  return (
    <MainLayout activeItem="ExerciseResults">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          pb: 6,
        }}
      >
        {loading ? (
          <Card
            sx={{
              p: 8,
              textAlign: 'center',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
              boxShadow: 'none',
            }}
          >
            <CircularProgress size={36} />
            <Typography variant="body2" sx={{ mt: 2, color: '#64748b', fontWeight: 600 }}>
              กำลังโหลดข้อมูลรายละเอียดและผลงานนักศึกษา...
            </Typography>
          </Card>
        ) : exercise && stats ? (
          <>
            {/* ส่วนที่ 1: การ์ดบริบทโจทย์ + ปุ่มย้อนกลับ + ปุ่ม Export CSV */}
            <TeacherExerciseHeaderCard exercise={exercise} students={students} />

            {/* ส่วนที่ 2: การ์ด KPI ตัวชี้วัดสำคัญ 5 กล่อง */}
            <TeacherExerciseKpiCards stats={stats} />

            {/* ส่วนที่ 3: ตารางรายชื่อนักศึกษาในข้อนี้ พร้อมตัวกรองและปุ่มตรวจโค้ด */}
            <Card
              sx={{
                p: 3,
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                bgcolor: '#ffffff',
                boxShadow: 'none',
              }}
            >
              <TeacherStudentTable
                students={students}
                onInspectCode={(st) => setSelectedStudent(st)}
              />
            </Card>

            {/* ส่วนที่ 4: หน้าต่าง Modal ตรวจโค้ดภาษา Python รายคน */}
            <TeacherCodeInspectionModal
              open={Boolean(selectedStudent)}
              onClose={() => setSelectedStudent(null)}
              student={selectedStudent}
              exerciseTitle={exercise.title}
            />
          </>
        ) : (
          <Card
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
              ไม่พบข้อมูลแบบฝึกหัดที่ระบุ
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
              รหัสแบบฝึกหัดนี้อาจไม่มีอยู่ในระบบ หรือถูกลบไปแล้ว
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/exercise-results')}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, bgcolor: '#0f172a' }}
            >
              กลับไปหน้ารวมผลแบบฝึกหัด
            </Button>
          </Card>
        )}
      </Box>
    </MainLayout>
  );
}
