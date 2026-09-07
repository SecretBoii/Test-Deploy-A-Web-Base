import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SecurityIcon from '@mui/icons-material/Security';
import { type AuditLogStats } from '../../../api/auditlogApi';

interface AuditLogStatsHeaderProps {
  stats?: AuditLogStats;
  total: number;
}

/**
 * คอมโพเนนต์แสดงผลการ์ดสรุปสถิติ KPI ภาพรวมของระบบ Audit Logs
 * ดึงค่าโดยตรงจากสถิติฝั่ง Backend (stats) เพื่อให้ตัวเลขแม่นยำตรงตามฐานข้อมูลจริง
 */
export const AuditLogStatsHeader: React.FC<AuditLogStatsHeaderProps> = ({ stats, total }) => {
  const cardItems = [
    {
      title: 'รายการทั้งหมดในระบบ',
      value: total.toLocaleString(),
      unit: 'รายการ',
      icon: <AssessmentIcon sx={{ color: '#2563eb' }} />,
      bgColor: '#eff6ff',
    },
    {
      title: 'เข้าสู่ระบบ / เพิ่มข้อมูล',
      value: (stats?.createOrAuthCount ?? 0).toLocaleString(),
      unit: 'ครั้ง',
      icon: <PersonAddIcon sx={{ color: '#059669' }} />,
      bgColor: '#ecfdf5',
    },
    {
      title: 'แก้ไข / อัปเดตข้อมูล',
      value: (stats?.updateCount ?? 0).toLocaleString(),
      unit: 'ครั้ง',
      icon: <EditNoteIcon sx={{ color: '#d97706' }} />,
      bgColor: '#fffbeb',
    },
    {
      title: 'การลบ / ความเสี่ยงระบบ',
      value: (stats?.deleteOrSecurityCount ?? 0).toLocaleString(),
      unit: 'ครั้ง',
      icon: <SecurityIcon sx={{ color: '#dc2626' }} />,
      bgColor: '#fef2f2',
    },
  ];

  // ปรับการจัด Layout โดยถอด mb ออกเพื่อให้ระยะห่างถูกควบคุมผ่าน gap ของ Parent Box (AdminAuditLogPage) อย่างเป็นระเบียบ
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: 2.5,
      }}
    >
      {cardItems.map((item, index) => (
        <Card
          key={index}
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            },
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              bgcolor: item.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {item.icon}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}>
              {item.title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {item.value}{' '}
              <Typography component="span" variant="caption" sx={{ color: '#94a3b8', ml: 0.5 }}>
                {item.unit}
              </Typography>
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
};
