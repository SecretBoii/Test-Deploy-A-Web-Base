import React from 'react';
import { Box, Typography, Card } from '@mui/material';

/**
 * คอมโพเนนต์หน้า Sessions สำหรับอาจารย์ผู้สอน (Teacher View)
 * แยกโครงสร้างออกจากมุมมองของนักเรียน (StudentSession) เพื่อให้แต่ละบทบาทมีหน้าจอของตนเอง
 * ตามสถาปัตยกรรมแบบเดียวกับหน้า Dashboard
 */
export const TeacherSession: React.FC = () => {
  return (
    <Box sx={{ maxWidth: '1280px', mx: 'auto', p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* ส่วนหัวแสดงชื่อหน้าสำหรับ Teacher */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Teacher Sessions
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
          พื้นที่จัดการและแสดงภาพรวมชุดบทเรียนสำหรับอาจารย์ผู้สอน
        </Typography>
      </Box>

      {/* โครงร่างเนื้อหาเริ่มต้น (Card Container) */}
      <Card
        sx={{
          p: 4,
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 320,
          textAlign: 'center',
          gap: 1.5,
          bgcolor: '#ffffff',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
          Teacher Session Workspace
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 480 }}>
          หน้านี้ถูกแยกไว้สำหรับบทบาทอาจารย์ผู้สอนโดยเฉพาะ และไม่ได้เชื่อมต่อกับระบบบทเรียนหรือการทำแบบฝึกหัดของนักเรียน
        </Typography>
      </Card>
    </Box>
  );
};

export default TeacherSession;
