import { Box, Typography, Button, Card, CircularProgress } from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { getStudentActivities, type StudentActivitiesResponse, type StudentActivityItem } from '../../api/reports';
import { StudentProfileCard } from './components/StudentProfileCard';
import { StudentKpiCards } from './components/StudentKpiCards';
import { StudentActivityFilters } from './components/StudentActivityFilters';
import { StudentActivityTable } from './components/StudentActivityTable';
import { CodeInspectionDialog } from './components/CodeInspectionDialog';

export default function StudentReportDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<StudentActivitiesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'submit' | 'run'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<StudentActivityItem | null>(null);

  // ดึงข้อมูลผู้เรียนและประวัติกิจกรรมทั้งหมดจาก API พร้อมระบบป้องกัน Race Condition & ตรวจสอบ ID
  useEffect(() => {
    const id = Number(userId);
    if (!userId || isNaN(id)) return;
    let ignore = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getStudentActivities(id);
        if (!ignore) {
          setData(res);
        }
      } catch (err) {
        if (!ignore) {
          console.error('เกิดข้อผิดพลาดในการดึงประวัติผู้เรียน:', err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    fetchData();

    return () => {
      ignore = true;
    };
  }, [userId]);

  const student = data?.student || null;
  const activities = useMemo(() => data?.activities || [], [data?.activities]);
  const totalExercises = data?.totalExercises || 25;

  // สถิติภาพรวมของผู้เรียน ดึงมาจาก Backend โดยตรง (Single Source of Truth)
  const stats = data?.stats || {
    passedCount: 0,
    percentage: 0,
    averageScore: 0,
    totalActivities: 0,
    submitCount: 0,
    runCount: 0,
  };

  // กรองข้อมูลกิจกรรมชั้นต้นตามสถานะ (Passed/Failed) และคำค้นหา เพียงรอบเดียว
  const baseFilteredActivities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return activities.filter((act) => {
      const isPassed = act.score >= 80;
      if (statusFilter === 'passed' && !isPassed) return false;
      if (statusFilter === 'failed' && isPassed) return false;

      if (query) {
        const exTitle = act.exercise?.title?.toLowerCase() || '';
        const sessionName = act.session?.sessionName?.toLowerCase() || '';
        const topic = act.exercise?.topic?.toLowerCase() || '';
        if (!exTitle.includes(query) && !sessionName.includes(query) && !topic.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [activities, statusFilter, searchQuery]);

  // คำนวณจำนวนกิจกรรมในแต่ละแท็บจากข้อมูลที่ผ่านการกรองชั้นต้นแบบ O(N) ไม่ต้องคำนวณซ้ำซ้อน
  const tabCounts = useMemo(() => {
    let submit = 0;
    let run = 0;
    for (const a of baseFilteredActivities) {
      if (a.eventType === 'submit') submit++;
      else if (a.eventType === 'run') run++;
    }
    return {
      all: baseFilteredActivities.length,
      submit,
      run,
    };
  }, [baseFilteredActivities]);

  // กรองรายการกิจกรรมตามแท็บที่เลือก (all, submit, run)
  const filteredActivities = useMemo(() => {
    if (activeTab === 'all') return baseFilteredActivities;
    return baseFilteredActivities.filter((act) => act.eventType === activeTab);
  }, [baseFilteredActivities, activeTab]);

  return (
    <MainLayout activeItem="Reports">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: '1440px', margin: '0 auto', pb: 6 }}>
        
        {/* ปุ่มย้อนกลับด้านบน สไตล์ Modern Dark-Navy SaaS */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate('/reports?tab=students')}
            sx={{
              color: '#475569',
              fontWeight: 700,
              fontSize: '13px',
              textTransform: 'none',
              px: 2,
              py: 0.9,
              borderRadius: '8px',
              bgcolor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#f8fafc', color: '#0f172a', boxShadow: 'none' },
            }}
          >
            ย้อนกลับไปหน้ารายงาน
          </Button>
        </Box>

        {loading ? (
          <Card sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <CircularProgress size={36} />
            <Typography variant="body2" sx={{ mt: 2, color: '#64748b', fontWeight: 600 }}>
              กำลังโหลดข้อมูลประวัติและผลการประเมินของผู้เรียน...
            </Typography>
          </Card>
        ) : (
          <>
            {/* ส่วนที่ 1: กล่องโปรไฟล์ผู้เรียน */}
            <StudentProfileCard student={student} userId={userId} />

            {/* ส่วนที่ 2: แถว 3 การ์ด KPI ตัวชี้วัดสำคัญ */}
            <StudentKpiCards stats={stats} totalExercises={totalExercises} />

            {/* ส่วนที่ 3: ตารางประวัติกิจกรรมพร้อมตัวกรอง */}
            <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: '#ffffff' }}>
              <StudentActivityFilters
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabCounts={tabCounts}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <StudentActivityTable
                activities={filteredActivities}
                onSelectActivity={setSelectedActivity}
              />
            </Card>
          </>
        )}

        {/* หน้าต่างป๊อปอัป Dialog ตรวจโค้ดภาษา Python แบบ Split Screen */}
        <CodeInspectionDialog
          open={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
          activity={selectedActivity}
        />
      </Box>
    </MainLayout>
  );
}
