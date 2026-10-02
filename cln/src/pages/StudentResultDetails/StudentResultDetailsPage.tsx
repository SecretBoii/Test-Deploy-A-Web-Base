import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, CircularProgress, Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { getStudentActivities, type StudentActivitiesResponse, type StudentActivitiesStats } from '../../api/reports';
import { StudentHeaderCard, type StudentExerciseItem } from './components/StudentHeaderCard';
import { StudentKpiCards } from './components/StudentKpiCards';
import { StudentExerciseTable } from './components/StudentExerciseTable';
import { StudentCodeInspectionModal } from './components/StudentCodeInspectionModal';

const fallbackStats: StudentActivitiesStats = {
  passedCount: 0,
  percentage: 0,
  averageScore: 0,
  totalActivities: 0,
  submitCount: 0,
  runCount: 0,
};

export default function StudentResultDetailsPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<StudentActivitiesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedExercise, setSelectedExercise] = useState<StudentExerciseItem | null>(null);

  // ดึงประวัติกิจกรรมและข้อมูลโปรไฟล์ของผู้เรียนจาก Backend
  useEffect(() => {
    const id = Number(userId);
    if (!userId || isNaN(id)) return;
    let ignore = false;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getStudentActivities(id);
        if (!ignore) {
          setData(res);
        }
      } catch (err) {
        if (!ignore) {
          console.error('ไม่สามารถดึงข้อมูลผลการเรียนรู้ของผู้เรียนคนนี้ได้:', err);
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
  }, [userId]);

  const student = data?.student;
  const stats: StudentActivitiesStats = data?.stats || fallbackStats;
  const activities = useMemo(() => data?.activities || [], [data?.activities]);
  const totalExercises = data?.totalExercises ?? 0;

  // รวบรวมกิจกรรมของผู้เรียนให้เป็นรายการแบบฝึกหัด (1 แถว = 1 Session-Exercise)
  // เพื่อให้ตารางแสดงผลเหมือนตารางรายชื่อนักศึกษาในหน้า ExerciseResultDetailsPage
  const exercises: StudentExerciseItem[] = useMemo(() => {
    const map = new Map<string, StudentExerciseItem>();

    for (const act of activities) {
      const key = `${act.sessionId}_${act.exerciseId}`;
      const isSubmit = act.eventType === 'submit' || act.eventType === 'SUBMIT';
      const isRun = act.eventType === 'run' || act.eventType === 'RUN';

      if (!map.has(key)) {
        map.set(key, {
          sessionId: act.sessionId,
          exerciseId: act.exerciseId,
          title: act.exercise?.title || `แบบฝึกหัด #${act.exerciseId}`,
          topic: act.exercise?.topic || 'ทั่วไป',
          difficultyLevel: act.exercise?.difficultyLevel || 1,
          expectedTime: act.exercise?.expectedTime,
          sessionName: act.session?.sessionName || `Session #${act.sessionId}`,
          bestScore: isSubmit ? act.score : null,
          status: isSubmit && act.score >= 80 ? 'PASSED' : 'FAILED',
          runCount: isRun ? 1 : 0,
          submitCount: isSubmit ? 1 : 0,
          lastSubmittedAt: isSubmit ? (act.submittedAt || act.startedAt) : null,
          latestActivity: act,
          bestActivity: act,
          activities: [act],
        });
      } else {
        const existing = map.get(key)!;
        existing.activities.push(act);
        if (isRun) {
          existing.runCount += 1;
        }
        if (isSubmit) {
          existing.submitCount += 1;
          if (!existing.lastSubmittedAt) {
            existing.lastSubmittedAt = act.submittedAt || act.startedAt;
          }
          if (existing.bestScore === null || act.score > existing.bestScore) {
            existing.bestScore = act.score;
            existing.bestActivity = act;
            if (act.score >= 80) {
              existing.status = 'PASSED';
            }
          }
        }
      }
    }

    // จัดเรียงรายการโจทย์: ข้อที่ส่งตรวจล่าสุดขึ้นก่อน หากยังไม่ส่งตรวจให้เรียงตาม Session และข้อ
    return Array.from(map.values()).sort((a, b) => {
      if (a.lastSubmittedAt && b.lastSubmittedAt) {
        return new Date(b.lastSubmittedAt).getTime() - new Date(a.lastSubmittedAt).getTime();
      }
      if (a.lastSubmittedAt) return -1;
      if (b.lastSubmittedAt) return 1;
      return a.sessionId !== b.sessionId ? a.sessionId - b.sessionId : a.exerciseId - b.exerciseId;
    });
  }, [activities]);

  return (
    <MainLayout activeItem="StudentResults">
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
              กำลังโหลดข้อมูลรายละเอียดผลการเรียนรู้ของผู้เรียน...
            </Typography>
          </Card>
        ) : !student ? (
          <Card
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
              boxShadow: 'none',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
              ไม่พบข้อมูลผู้เรียนคนนี้
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
              ผู้เรียนรหัส #{userId} อาจถูกลบ หรือคุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/student-results')}
              sx={{ borderRadius: '8px', textTransform: 'none', color: '#0f172a', borderColor: '#cbd5e1' }}
            >
              ย้อนกลับไปหน้ารวมผลการเรียนรู้
            </Button>
          </Card>
        ) : (
          <>
            {/* ส่วนที่ 1: การ์ดโปรไฟล์ส่วนหัว (Header Card) ถอดแบบรูปที่ 1 */}
            <StudentHeaderCard
              student={student}
              stats={stats}
              totalExercises={totalExercises}
              exercises={exercises}
            />

            {/* ส่วนที่ 2: แถวการ์ด KPI 5 ใบแนวนอน ถอดแบบรูปที่ 1 */}
            <StudentKpiCards
              stats={stats}
              totalExercises={totalExercises}
              attemptedCount={exercises.length}
            />

            {/* ส่วนที่ 3: ตารางแบบฝึกหัดพร้อมฟิลเตอร์ Capsule Pills ถอดแบบรูปที่ 2 */}
            <StudentExerciseTable
              exercises={exercises}
              onInspectCode={(ex) => setSelectedExercise(ex)}
            />

            {/* ส่วนที่ 4: หน้าต่าง Modal ตรวจโค้ด Python พร้อม AI Feedback ถอดแบบรูปที่ 2 & 3 */}
            <StudentCodeInspectionModal
              open={!!selectedExercise}
              onClose={() => setSelectedExercise(null)}
              exercise={selectedExercise}
              studentName={student.fullName}
              username={student.username}
            />
          </>
        )}
      </Box>
    </MainLayout>
  );
}
