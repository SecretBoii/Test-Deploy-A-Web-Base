import { Box, Tabs, Tab, Card } from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, BookOpen, AlertTriangle } from 'lucide-react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { StudentPerformanceReport } from './components/StudentPerformanceReport';
import { ExerciseAnalyticsReport } from './components/ExerciseAnalyticsReport';
import { ErrorAnalyticsReport } from './components/ErrorAnalyticsReport';
import { 
  getStudentPerformanceReport, 
  getExerciseAnalyticsReport, 
  getErrorAnalyticsReport,
  type StudentReportData,
  type ExerciseAnalyticsData,
  type ErrorReportResponse
} from '../../api/reports';

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  // คำนวณ activeTab จาก URL Query Parameter (?tab=exercises หรือ ?tab=errors)
  // เพื่อให้ระบบจำแท็บที่เปิดอยู่ได้ แม้กดย้อนกลับมาจากหน้ารายละเอียด
  const activeTab = useMemo(() => {
    if (tabParam === 'exercises') return 1;
    if (tabParam === 'errors') return 2;
    return 0;
  }, [tabParam]);

  const [loading, setLoading] = useState(false);

  const [studentData, setStudentData] = useState<StudentReportData[]>([]);
  const [exerciseData, setExerciseData] = useState<ExerciseAnalyticsData[]>([]);
  const [errorData, setErrorData] = useState<ErrorReportResponse | null>(null);

  // ดึงข้อมูลรายงานจาก Backend API ตาม Tab ที่เปิดอยู่ (ดึงรอบเดียวตอนสลับแท็บ)
  // ใช้ ignore flag เพื่อป้องกัน race condition ในกรณีที่ unmount หรือ remount ใน React StrictMode
  useEffect(() => {
    let ignore = false;

    const fetchReport = async () => {
      setLoading(true);
      try {
        if (activeTab === 0) {
          const res = await getStudentPerformanceReport();
          if (!ignore) setStudentData(res || []);
        } else if (activeTab === 1) {
          const res = await getExerciseAnalyticsReport();
          if (!ignore) setExerciseData(res || []);
        } else if (activeTab === 2) {
          const res = await getErrorAnalyticsReport();
          if (!ignore) setErrorData(res || null);
        }
      } catch (err) {
        if (!ignore) console.error('ไม่สามารถเรียกรายงานความคืบหน้าได้:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchReport();

    return () => {
      ignore = true;
    };
  }, [activeTab]);

  // เมื่อเปลี่ยน Tab ให้อัปเดต URL Query Params ทันที
  const handleTabChange = (_: React.SyntheticEvent, newTab: number) => {
    const tabName = newTab === 1 ? 'exercises' : newTab === 2 ? 'errors' : 'students';
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newTab === 0) {
        next.delete('tab');
      } else {
        next.set('tab', tabName);
      }
      return next;
    }, { replace: true });
  };

  return (
    <MainLayout activeItem="Reports">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, width: '100%', maxWidth: '1440px', margin: '0 auto', pb: 4 }}>
        
        {/* Main Content Area wrapped in Card - ขอบมน 16px ตามมาตรฐาน Student Home */}
        <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden', bgcolor: '#ffffff' }}>
          
          {/* แถบนำทางเลือกประเภทรายงาน - Modern Underline Tabs */}
          <Box sx={{ borderBottom: '1px solid #e2e8f0', mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              textColor="primary"
              indicatorColor="primary"
              sx={{ 
                minHeight: '48px',
                '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', bgcolor: '#2563eb' },
                '& .MuiTab-root': { 
                  fontWeight: 600, 
                  textTransform: 'none', 
                  fontSize: '14.5px',
                  minHeight: '48px',
                  color: '#64748b',
                  px: 2.5,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    color: '#1e293b'
                  },
                  '&.Mui-selected': { 
                    color: '#2563eb',
                    fontWeight: 700
                  } 
                }
              }}
            >
              <Tab icon={<Users size={18} style={{ marginRight: 8 }} />} iconPosition="start" label="รายงานผู้เรียนรายบุคคล" />
              <Tab icon={<BookOpen size={18} style={{ marginRight: 8 }} />} iconPosition="start" label="วิเคราะห์ประสิทธิภาพโจทย์" />
              <Tab icon={<AlertTriangle size={18} style={{ marginRight: 8 }} />} iconPosition="start" label="สรุปข้อผิดพลาด & Exceptions" />
            </Tabs>
          </Box>

          {/* Tab Panel Display */}
          <Box>
            {activeTab === 0 && (
              <StudentPerformanceReport data={studentData} isLoading={loading} />
            )}
            {activeTab === 1 && (
              <ExerciseAnalyticsReport data={exerciseData} isLoading={loading} />
            )}
            {activeTab === 2 && (
              <ErrorAnalyticsReport data={errorData} isLoading={loading} />
            )}
          </Box>
        </Card>
      </Box>
    </MainLayout>
  );
}
