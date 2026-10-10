import { Menu } from 'lucide-react'
import { Avatar, IconButton, Box, Typography } from '@mui/material'

interface NavbarProps {
  onMenuClick: () => void
  user: {
    username: string
    roleId: number
  }
  activeItem?: string
}

export function Navbar({ onMenuClick, user, activeItem }: NavbarProps) {
  return (
    <Box
      component="header"
      sx={{
        height: 64,
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        position: 'sticky',
        top: 0,
        zIndex: 80,
      }}
    >
      {/* Left menu toggle & Breadcrumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={onMenuClick}
          aria-label="Open menu"
          sx={{
            color: '#475569',
            mr: 1,
          }}
        >
          <Menu size={22} />
        </IconButton>

        {/* แสดงชื่อหน้าปัจจุบันบน Top Navbar (ตัดชื่อระบบ Python Exercise ออกเพื่อไม่ให้ซ้ำซ้อนกับ Sidebar Logo) */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
          <Typography
            sx={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#0f172a',
              letterSpacing: '-0.1px',
            }}
          >
            {activeItem || 'Dashboard'}
          </Typography>
        </Box>
      </Box>

      {/* Right action items */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 3 }}>
        {/* ข้อมูลบัญชีผู้ใช้ (Username & Role) จัดวางหน้า Avatar ตามมาตรฐานแดชบอร์ด */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#0f172a',
              lineHeight: 1.2,
            }}
          >
            {user.username}
          </Typography>
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 500,
              color: '#64748b',
              lineHeight: 1.2,
            }}
          >
            {user.roleId === 1 ? 'Student' : user.roleId === 2 ? 'Teacher' : 'Admin'}
          </Typography>
        </Box>

        <Avatar
          alt={user.username}
          sx={{
            cursor: 'pointer',
            bgcolor: '#eff6ff',
            color: '#2563eb',
            fontWeight: 700,
            fontSize: '1rem',
            border: '2px solid #e2e8f0',
            width: 36,
            height: 36,
            transition: 'transform 0.2s ease, border-color 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              borderColor: '#2563eb',
            },
          }}
        >
          {user.username?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
      </Box>
    </Box>
  )
}
