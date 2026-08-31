import { Box, Typography, Tabs, Tab } from '@mui/material';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        if (activeTab === 0) {
          const res = await getStudentPerformanceReport(filters);
          setStudentData(res);
        } else if (activeTab === 1) {
          const res = await getExerciseAnalyticsReport(filters);
          setExerciseData(res);
        } else if (activeTab === 2) {
          const res = await getErrorAnalyticsReport(filters);
          setErrorData(res);
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
            ระบบรายงานเชิงลึก (Admin Reports)
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            วิเคราะห์ และติดตามคะแนนสอบ ตลอดจนข้อผิดพลาดของเด็กนักเรียนในการเขียนโค้ดภาษาไพทอน
          </Typography>
        </Box>

        <ReportFilters 
          onFilterChange={handleFilterChange} 
        />

        <Tabs 
          value={activeTab} 
          onChange={(_, val) => setActiveTab(val)} 
          sx={{ 
            borderBottom: 1, 
            borderColor: '#e2e8f0', 
            mb: 3,
            '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '14px' },
            '& .Mui-selected': { color: '#4f46e5' },
            '& .MuiTabs-indicator': { bgcolor: '#4f46e5' }
          }}
        >
          <Tab label="รายงานความคืบหน้าผู้เรียนรายบุคคล" />
          <Tab label="วิเคราะห์ประสิทธิภาพหลักสูตรและโจทย์" />
          <Tab label="สรุปข้อผิดพลาดและ Exceptions" />
        </Tabs>

        <Box sx={{ bgcolor: '#ffffff', p: 3, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
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
      </Box>
    </MainLayout>
  );
}
