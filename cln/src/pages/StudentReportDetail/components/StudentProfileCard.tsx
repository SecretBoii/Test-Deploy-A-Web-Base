import { Box, Typography, Card, Chip, Avatar } from '@mui/material';
import { Mail, GraduationCap, Building2 } from 'lucide-react';
import type { StudentActivitiesResponse } from '../../../api/reports';

interface StudentProfileCardProps {
  student: StudentActivitiesResponse['student'];
  userId?: string;
}

export function StudentProfileCard({ student, userId }: StudentProfileCardProps) {
  return (
    <Card sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: '#ffffff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: '#f1f5f9', color: '#0f172a', fontSize: '20px', fontWeight: 800, border: '1px solid #e2e8f0' }}>
            {student?.fullName ? student.fullName.charAt(0) : 'S'}
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                {student?.fullName || 'ไม่พบชื่อผู้เรียน'}
              </Typography>
              <Chip
                label={`@${student?.username || 'user'} • ID: ${userId}`}
                size="small"
                sx={{ bgcolor: '#f8fafc', color: '#0f172a', fontWeight: 600, fontSize: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mt: 0.8, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <Building2 size={16} color="#64748b" />
                <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600 }}>
                  {student?.university || 'ไม่ระบุมหาวิทยาลัย'}
                </Typography>
              </Box>
              {student?.faculty && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <GraduationCap size={16} color="#64748b" />
                  <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600 }}>
                    {student?.faculty}
                  </Typography>
                </Box>
              )}
              {student?.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Mail size={16} color="#64748b" />
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    {student.email}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
