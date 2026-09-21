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

  // ดึงข้อมูลผู้เรียนและประวัติกิจกรรมทั้งหมดจาก API
  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getStudentActivities(Number(userId));
        setData(res);
      } catch (err) {
        console.error('เกิดข้อผิดพลาดในการดึงประวัติผู้เรียน:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  // คำนวณจำนวนกิจกรรมในแต่ละแท็บแบบไดนามิก สัมพันธ์กับตัวกรองสถานะ (ผ่าน/ไม่ผ่าน) และคำค้นหา
  const tabCounts = useMemo(() => {
    const base = activities.filter((act) => {
      const isPassed = act.score >= 80;
      if (statusFilter === 'passed' && !isPassed) return false;
      if (statusFilter === 'failed' && isPassed) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const exTitle = act.exercise?.title?.toLowerCase() || '';
        const sessionName = act.session?.sessionName?.toLowerCase() || '';
        const topic = act.exercise?.topic?.toLowerCase() || '';
        if (!exTitle.includes(query) && !sessionName.includes(query) && !topic.includes(query)) {
          return false;
        }
      }
      return true;
    });

    return {
      all: base.length,
      submit: base.filter((a) => a.eventType === 'submit').length,
      run: base.filter((a) => a.eventType === 'run').length,
    };
  }, [activities, statusFilter, searchQuery]);

  // กรองรายการกิจกรรมตามตัวกรองที่เลือก (Tab, สถานะ Passed/Failed, คำค้นหา)
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // กรองตาม Event Type Tab
      if (activeTab === 'submit' && act.eventType !== 'submit') return false;
      if (activeTab === 'run' && act.eventType !== 'run') return false;

      // กรองตามสถานะ ผ่าน / ไม่ผ่าน
      const isPassed = act.score >= 80;
      if (statusFilter === 'passed' && !isPassed) return false;
      if (statusFilter === 'failed' && isPassed) return false;

      // ค้นหาตามชื่อโจทย์ หรือ บทเรียน
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const exTitle = act.exercise?.title?.toLowerCase() || '';
        const sessionName = act.session?.sessionName?.toLowerCase() || '';
        const topic = act.exercise?.topic?.toLowerCase() || '';
        if (!exTitle.includes(query) && !sessionName.includes(query) && !topic.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [activities, activeTab, statusFilter, searchQuery]);

  return (
    <MainLayout activeItem="Reports">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: '1440px', margin: '0 auto', pb: 6 }}>
        
        {/* ปุ่มย้อนกลับด้านบน */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="text"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate('/reports')}
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
