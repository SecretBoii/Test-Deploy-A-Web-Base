import { Box, Tabs, Tab, Card } from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, BookOpen, AlertTriangle } from 'lucide-react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { ReportFilters } from './components/ReportFilters';
import { StudentPerformanceReport } from './components/StudentPerformanceReport';
import { ExerciseAnalyticsReport } from './components/ExerciseAnalyticsReport';
import { ErrorAnalyticsReport } from './components/ErrorAnalyticsReport';
import { 
  getStudentPerformanceReport, 
  getExerciseAnalyticsReport, 
  getErrorAnalyticsReport,
  type ReportFilterParams,
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

  const [filters, setFilters] = useState<ReportFilterParams>({});
  const [loading, setLoading] = useState(false);

  const [studentData, setStudentData] = useState<StudentReportData[]>([]);
  const [exerciseData, setExerciseData] = useState<ExerciseAnalyticsData[]>([]);
  const [errorData, setErrorData] = useState<ErrorReportResponse | null>(null);

  // ดึงข้อมูลรายงานจาก Backend API ตาม Tab ที่เปิดอยู่และ Filter ที่ระบุ
  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        if (activeTab === 0) {
          const res = await getStudentPerformanceReport(filters);
          setStudentData(res || []);
        } else if (activeTab === 1) {
          const res = await getExerciseAnalyticsReport(filters);
          setExerciseData(res || []);
        } else if (activeTab === 2) {
          // ดึงรายงานภาพรวมข้อผิดพลาดทั้งระบบ โดยไม่ส่ง filters ตกค้างจากแท็บอื่น เพื่อความโปร่งใส
          const res = await getErrorAnalyticsReport();
          setErrorData(res || null);
        }
      } catch (err) {
        console.error('ไม่สามารถเรียกรายงานความคืบหน้าได้:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [activeTab, filters]);

  // เมื่อเปลี่ยน Tab ให้อัปเดต URL Query Params ทันที และเคลียร์ search เก่า
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
    setFilters({});
  };

  const handleFilterChange = (newFilters: ReportFilterParams) => {
    setFilters(newFilters);
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

          {/* Component ตัวกรองข้อมูลส่วนกลาง (แสดงเฉพาะแท็บ 0 รายงานผู้เรียนรายบุคคล) */}
          {activeTab === 0 && (
            <ReportFilters activeTab={activeTab} onFilterChange={handleFilterChange} />
          )}

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
