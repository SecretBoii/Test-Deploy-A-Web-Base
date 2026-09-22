import { Box, Tabs, Tab, Card } from '@mui/material';
import { useState, useEffect } from 'react';
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
  type ErrorAnalyticsData
} from '../../api/reports';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState<ReportFilterParams>({});
  const [loading, setLoading] = useState(false);

  const [studentData, setStudentData] = useState<StudentReportData[]>([]);
  const [exerciseData, setExerciseData] = useState<ExerciseAnalyticsData[]>([]);
  const [errorData, setErrorData] = useState<ErrorAnalyticsData[]>([]);

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
          const res = await getErrorAnalyticsReport(filters);
          setErrorData(res || []);
        }
      } catch (err) {
        console.error('ไม่สามารถเรียกรายงานความคืบหน้าได้:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [activeTab, filters]);

  // เมื่อเปลี่ยน Tab ให้เคลียร์ search ทันที เพื่อไม่ให้เกิด Double Fetch หรือเอาคำค้นหาเก่าไปใช้กับแท็บใหม่
  const handleTabChange = (_: React.SyntheticEvent, newTab: number) => {
    setActiveTab(newTab);
    setFilters((prev) => (prev.search ? { ...prev, search: '' } : prev));
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

          {/* Component ตัวกรองข้อมูลส่วนกลาง (แสดงเฉพาะแท็บ 0 ผู้เรียน และ แท็บ 2 ข้อผิดพลาด ส่วนแท็บ 1 มี Toolbar ครบในตัว) */}
          {activeTab !== 1 && (
            <ReportFilters activeTab={activeTab} onFilterChange={handleFilterChange} />
          )}

          {/* Tab Panel Display */}
          <Box>
            {activeTab === 0 && (
              <StudentPerformanceReport data={studentData} isLoading={loading} />
            )}
            {activeTab === 1 && (
              <ExerciseAnalyticsReport data={exerciseData} isLoading={loading} searchQuery={filters.search} />
            )}
            {activeTab === 2 && (
              <ErrorAnalyticsReport data={errorData} isLoading={loading} searchQuery={filters.search} />
            )}
          </Box>
        </Card>
      </Box>
    </MainLayout>
  );
}
