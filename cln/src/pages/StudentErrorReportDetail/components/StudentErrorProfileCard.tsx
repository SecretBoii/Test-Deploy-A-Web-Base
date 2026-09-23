import { Card, Box, Avatar, Typography, Chip } from '@mui/material';
import { AlertTriangle } from 'lucide-react';
import type { StudentActivitiesResponse } from '../../../api/reports';

interface StudentErrorProfileCardProps {
  student: StudentActivitiesResponse['student'];
  totalExceptions: number;
}

export function StudentErrorProfileCard({ student, totalExceptions }: StudentErrorProfileCardProps) {
  return (
    <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: '#ffffff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Avatar sx={{ width: 52, height: 52, bgcolor: '#fee2e2', color: '#dc2626', fontWeight: 800, fontSize: '20px' }}>
          {student?.fullName ? student.fullName.charAt(0) : 'U'}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            {student?.fullName || 'ไม่ระบุชื่อ'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
            @{student?.username} • {student?.university || '-'} • {student?.faculty || '-'}
          </Typography>
        </Box>
        <Chip
          icon={<AlertTriangle size={15} color="#dc2626" />}
          label={`พบทั้งหมด ${totalExceptions} Exceptions`}
          sx={{ bgcolor: '#fff1f2', color: '#dc2626', fontWeight: 800, border: '1px solid #fecdd3', borderRadius: '8px' }}
        />
      </Box>
    </Card>
  );
}
