import { Card, Box, Avatar, Typography } from '@mui/material';
import type { StudentActivitiesResponse } from '../../../api/reports';

interface StudentErrorProfileCardProps {
  student: StudentActivitiesResponse['student'];
  totalExceptions: number;
}

// การ์ดข้อมูลโปรไฟล์ผู้เรียนในหน้ารายละเอียดข้อผิดพลาด ออกแบบสไตล์ Modern Dark-Navy SaaS
export function StudentErrorProfileCard({ student }: StudentErrorProfileCardProps) {
  return (
    <Card sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: '#ffffff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: '#f1f5f9',
              color: '#0f172a',
              fontWeight: 800,
              fontSize: '18px',
              border: '1px solid #e2e8f0',
            }}
          >
            {student?.fullName ? student.fullName.charAt(0) : 'U'}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              {student?.fullName || 'ไม่ระบุชื่อ'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mt: 0.3 }}>
              @{student?.username || 'user'} • {student?.university || '-'} • {student?.faculty || '-'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
