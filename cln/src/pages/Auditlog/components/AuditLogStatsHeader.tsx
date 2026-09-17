import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LoginIcon from '@mui/icons-material/Login';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SecurityIcon from '@mui/icons-material/Security';
import { type AuditLogStats } from '../../../api/auditlogApi';

interface AuditLogStatsHeaderProps {
  stats?: AuditLogStats;
  total: number;
}

export const AuditLogStatsHeader: React.FC<AuditLogStatsHeaderProps> = ({ stats, total }) => {
  const cardItems = [
    {
      title: 'รายการทั้งหมดในระบบ',
      value: (stats?.total ?? total).toLocaleString(),
      unit: 'รายการ',
      icon: <AssessmentIcon sx={{ color: '#2563eb' }} />,
      bgColor: '#eff6ff',
    },
    {
      title: 'เข้าสู่ระบบ',
      value: (stats?.authCount ?? 0).toLocaleString(),
      unit: 'ครั้ง',
      icon: <LoginIcon sx={{ color: '#059669' }} />,
      bgColor: '#ecfdf5',
    },
    {
      title: 'สร้าง / เพิ่มข้อมูล',
      value: (stats?.createCount ?? 0).toLocaleString(),
      unit: 'ครั้ง',
      icon: <AddCircleOutlinedIcon sx={{ color: '#0891b2' }} />,
      bgColor: '#ecfeff',
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

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(5, 1fr)',
        },
        gap: 2,
      }}
    >
      {cardItems.map((item, index) => (
        <Card
          key={index}
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.75,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            },
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              bgcolor: item.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {item.icon}
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              noWrap
              sx={{
                color: '#64748b',
                fontWeight: 500,
                fontSize: '0.8125rem',
                mb: 0.25,
              }}
              title={item.title}
            >
              {item.title}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              {item.value}{' '}
              <Typography component="span" variant="caption" sx={{ color: '#94a3b8', ml: 0.5, fontWeight: 500 }}>
                {item.unit}
              </Typography>
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

