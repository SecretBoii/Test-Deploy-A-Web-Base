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

  const handleFilterChange = (newFilters: ReportFilterParams) => {
    setFilters(newFilters);
  };

  return (
    <MainLayout activeItem="Reports">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, width: '100%', maxWidth: '1440px', margin: '0 auto', pb: 4 }}>
        
        {/* Main Content Area wrapped in Card - ขอบมน 16px ตามมาตรฐาน Student Home */}
        <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden', bgcolor: '#ffffff' }}>
          
          {/* Component ตัวกรองข้อมูล */}
          <ReportFilters activeTab={activeTab} onFilterChange={handleFilterChange} />

          {/* Clean Segmented Tabs - ขอบมน 12px */}
          <Box sx={{ mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={(_, val) => setActiveTab(val)} 
              sx={{ 
                bgcolor: '#f8fafc',
                p: '4px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                minHeight: 'auto',
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTab-root': { 
                  fontWeight: 700, 
                  textTransform: 'none', 
                  fontSize: '14px',
                  borderRadius: '8px',
                  minHeight: '40px',
                  color: '#64748b',
                  px: 2.5,
                  transition: 'all 0.15s ease',
                  '&.Mui-selected': { 
                    bgcolor: '#ffffff', 
                    color: '#2563eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  } 
                }
              }}
            >
              <Tab icon={<Users size={16} style={{ marginRight: 6 }} />} iconPosition="start" label="รายงานผู้เรียนรายบุคคล" />
              <Tab icon={<BookOpen size={16} style={{ marginRight: 6 }} />} iconPosition="start" label="วิเคราะห์ประสิทธิภาพโจทย์" />
              <Tab icon={<AlertTriangle size={16} style={{ marginRight: 6 }} />} iconPosition="start" label="สรุปข้อผิดพลาด & Exceptions" />
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
