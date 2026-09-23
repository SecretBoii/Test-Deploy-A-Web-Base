import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CircularProgress } from '@mui/material';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { getStudentActivities, type StudentActivitiesResponse, type StudentActivityItem } from '../../api/reports';
import { CodeInspectionDialog } from '../StudentReportDetail/components/CodeInspectionDialog';
import { StudentErrorProfileCard } from './components/StudentErrorProfileCard';
import { StudentErrorKpiCards } from './components/StudentErrorKpiCards';
import { StudentErrorFilters } from './components/StudentErrorFilters';
import { ExerciseErrorAccordionCard, type GroupedExerciseItem } from './components/ExerciseErrorAccordionCard';

/**
 * ฟังก์ชันจำแนกชื่อประเภท Exception ภาษา Python จากข้อความหรือ Traceback
 * เหตุผลที่คงไว้ที่นี่: เป็น pure logic สั้น ๆ (~20 บรรทัด) ไม่จำเป็นต้องสร้างโฟลเดอร์ utils เพิ่มเติม
 */
export const parseErrorType = (msg?: string | null): string => {
  if (!msg) return 'RuntimeError';
  if (msg.includes('TimeLimitExceeded')) return 'TimeLimitExceeded';
  const match = msg.match(/\b([a-zA-Z]+Error):/);
  if (match) return match[1];
  if (msg.includes('SyntaxError')) return 'SyntaxError';
  if (msg.includes('IndentationError')) return 'IndentationError';
  if (msg.includes('NameError')) return 'NameError';
  if (msg.includes('TypeError')) return 'TypeError';
  if (msg.includes('ValueError')) return 'ValueError';
  if (msg.includes('ZeroDivisionError')) return 'ZeroDivisionError';
  if (msg.includes('IndexError')) return 'IndexError';
  if (msg.includes('KeyError')) return 'KeyError';
  if (msg.includes('AttributeError')) return 'AttributeError';
  if (msg.includes('RecursionError')) return 'RecursionError';
  return 'RuntimeError';
};

/**
 * ฟังก์ชันกำหนดชุดสี Badge ตามประเภทของ Exception เพื่อให้โทนสีสอดคล้องกันทั่วทั้งระบบ
 */
export const getErrorBadgeStyle = (errorType: string) => {
  if (errorType.includes('Syntax') || errorType.includes('Indentation')) {
    return { bg: '#fffbe6', color: '#b45309', border: '#fde68a' };
  }
  if (errorType.includes('Runtime') || errorType.includes('TimeLimit')) {
    return { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' };
  }
  if (errorType.includes('Name') || errorType.includes('Type') || errorType.includes('Value')) {
    return { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' };
  }
  return { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' };
};

export const formatThaiTime = (dateStr?: string): string => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';
  return `${d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })} ${d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`;
};

export default function StudentErrorReportDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<StudentActivitiesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedErrorType, setSelectedErrorType] = useState<string>('ALL');
  const [selectedActivity, setSelectedActivity] = useState<StudentActivityItem | null>(null);

  // สถานะเปิด-ปิดของแต่ละแบบฝึกหัด (Default: ปิดไว้ทุกข้อ เพื่อให้หน้าจอกระชับ)
  const [expandedExercises, setExpandedExercises] = useState<Record<number, boolean>>({});

  // ดึงประวัติกิจกรรมทั้งหมดของผู้เรียนคนนี้จาก API
  useEffect(() => {
    if (!userId) return;
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const res = await getStudentActivities(Number(userId));
        setData(res);
      } catch (err) {
        console.error('ไม่สามารถเรียกข้อมูลกิจกรรมของผู้เรียนได้:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [userId]);

  const student = data?.student || null;

  // กรองเฉพาะประวัติกิจกรรมที่เกิดข้อผิดพลาดจริง (exceptionMessage มีค่า)
  const errorActivities = useMemo(() => {
    return (data?.activities || []).filter(
      (act) => act.exceptionMessage && act.exceptionMessage.trim() !== ''
    );
  }, [data?.activities]);

  // คำนวณภาพรวมสถิติ Error ของคนนี้
  const stats = useMemo(() => {
    const total = errorActivities.length;
    const typeCountMap: Record<string, number> = {};
    const exerciseIdSet = new Set<number>();

    errorActivities.forEach((act) => {
      const type = parseErrorType(act.exceptionMessage);
      typeCountMap[type] = (typeCountMap[type] || 0) + 1;
      exerciseIdSet.add(act.exerciseId);
    });

    const topType = Object.entries(typeCountMap).sort((a, b) => b[1] - a[1])[0];

    return {
      totalExceptions: total,
      totalExercisesWithErrors: exerciseIdSet.size,
      topErrorType: topType ? `${topType[0]} (${topType[1]} ครั้ง)` : '-',
      typeCountMap,
    };
  }, [errorActivities]);

  // จัดกลุ่มข้อผิดพลาดตามแบบฝึกหัด (Exercise)
  const groupedExercises = useMemo<GroupedExerciseItem[]>(() => {
    const map = new Map<number, GroupedExerciseItem>();

    errorActivities.forEach((act) => {
      const exId = act.exerciseId;
      if (!map.has(exId)) {
        map.set(exId, {
          exerciseId: exId,
          title: act.exercise?.title || `แบบฝึกหัด #${exId}`,
          topic: act.exercise?.topic || 'ทั่วไป',
          difficultyLevel: act.exercise?.difficultyLevel || 1,
          activities: [],
          errorTypeCounts: {},
        });
      }

      const item = map.get(exId)!;
      item.activities.push(act);
      const errType = parseErrorType(act.exceptionMessage);
      item.errorTypeCounts[errType] = (item.errorTypeCounts[errType] || 0) + 1;
    });

    let list = Array.from(map.values()).sort(
      (a, b) => b.activities.length - a.activities.length
    );

    // กรองตามคำค้นหาชื่อโจทย์ หรือหัวข้อ
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (ex) =>
          ex.title.toLowerCase().includes(q) || ex.topic.toLowerCase().includes(q)
      );
    }

    // กรองตามประเภท Exception ที่เลือก
    if (selectedErrorType !== 'ALL') {
      list = list.filter((ex) => (ex.errorTypeCounts[selectedErrorType] || 0) > 0);
    }

    return list;
  }, [errorActivities, searchQuery, selectedErrorType]);

  // สลับสถานะเปิด-ปิดข้อที่คลิก
  const toggleExercise = (exerciseId: number) => {
    setExpandedExercises((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  // ปุ่มลัด: ขยายดูทุกข้อพร้อมกัน
  const handleExpandAll = () => {
    const all: Record<number, boolean> = {};
    groupedExercises.forEach((ex) => {
      all[ex.exerciseId] = true;
    });
    setExpandedExercises(all);
  };

  // ปุ่มลัด: ยุบเก็บทุกข้อ
  const handleCollapseAll = () => {
    setExpandedExercises({});
  };

  return (
    <MainLayout activeItem="Reports">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: '1440px', margin: '0 auto', pb: 6 }}>
        {/* 1. ปุ่มย้อนกลับไปหน้ารายงานสรุปภาพรวม */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="text"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate('/reports?tab=errors')}
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
            ย้อนกลับไปหน้ารายงานสรุป
          </Button>
        </Box>

        {loading ? (
          <Card sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <CircularProgress size={36} />
            <Typography variant="body2" sx={{ mt: 2, color: '#64748b', fontWeight: 600 }}>
              กำลังโหลดข้อมูลประวัติข้อผิดพลาดของผู้เรียน...
            </Typography>
          </Card>
        ) : (
          <>
            {/* 2. กล่องโปรไฟล์ผู้เรียน */}
            <StudentErrorProfileCard student={student} totalExceptions={stats.totalExceptions} />

            {/* 3. การ์ด KPI 3 ใบของนักศึกษาคนนี้ */}
            <StudentErrorKpiCards
              totalExceptions={stats.totalExceptions}
              totalExercisesWithErrors={stats.totalExercisesWithErrors}
              topErrorType={stats.topErrorType}
            />

            {/* 4. แถบตัวกรองประเภท Error และช่องค้นหา */}
            <StudentErrorFilters
              selectedErrorType={selectedErrorType}
              onSelectErrorType={setSelectedErrorType}
              typeCountMap={stats.typeCountMap}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* 5. ส่วนหัวรายการโจทย์ + ปุ่มทางลัด ขยาย/ยุบทั้งหมด */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                <BookOpen size={18} color="#2563eb" />
                แบบฝึกหัดที่พบข้อผิดพลาด ({groupedExercises.length} ข้อ)
              </Typography>
              {groupedExercises.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    onClick={handleExpandAll}
                    sx={{ fontSize: '12px', fontWeight: 700, textTransform: 'none', color: '#2563eb' }}
                  >
                    ขยายดูทุกข้อ
                  </Button>
                  <Typography sx={{ color: '#cbd5e1', alignSelf: 'center' }}>|</Typography>
                  <Button
                    size="small"
                    onClick={handleCollapseAll}
                    sx={{ fontSize: '12px', fontWeight: 600, textTransform: 'none', color: '#64748b' }}
                  >
                    ยุบเก็บทุกข้อ
                  </Button>
                </Box>
              )}
            </Box>

            {/* 6. รายการการ์ดแบบฝึกหัดแบบ Accordion */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {groupedExercises.length === 0 ? (
                <Card sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px dashed #cbd5e1', bgcolor: '#ffffff' }}>
                  <Typography sx={{ color: '#64748b', fontWeight: 600 }}>ไม่พบข้อผิดพลาดที่ตรงกับเงื่อนไขการค้นหา</Typography>
                </Card>
              ) : (
                groupedExercises.map((ex) => (
                  <ExerciseErrorAccordionCard
                    key={ex.exerciseId}
                    exercise={ex}
                    isExpanded={!!expandedExercises[ex.exerciseId]}
                    onToggle={toggleExercise}
                    onInspectActivity={setSelectedActivity}
                  />
                ))
              )}
            </Box>
          </>
        )}

        {/* Modal สำหรับตรวจโค้ดแบบ Split Screen เต็มจอ */}
        <CodeInspectionDialog
          open={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
          activity={selectedActivity}
        />
      </Box>
    </MainLayout>
  );
}
