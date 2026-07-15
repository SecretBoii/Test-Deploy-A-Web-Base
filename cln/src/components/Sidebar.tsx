import {
  LayoutDashboard,
  Code2,
  Play,
  Award,
  Settings,
  LogOut,
} from 'lucide-react'
import { Box, Button } from '@mui/material'

interface SidebarProps {
  activeItem: string
  onItemClick: (name: string) => void
  user: {
    username: string
    roleId: number
  }
  onLogout: () => void
}

export function Sidebar({ activeItem, onItemClick, user, onLogout }: SidebarProps) {
  const menuItems = [
    { name: 'หน้าหลัก', icon: <LayoutDashboard size={20} /> },
    { name: 'Exercises', icon: <Code2 size={20} /> },
    { name: 'Sessions', icon: <Play size={20} /> },
    { name: 'Leaderboard', icon: <Award size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sidebar Header */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          px: 3,
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Logo Circle */}
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: '3px solid #4f46e5',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '5px',
                left: '5px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: '2px solid #4f46e5',
              },
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
              component="span"
              sx={{
                fontSize: '15px',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.2px',
                lineHeight: 1.2,
              }}
            >
              Python Exercise
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#94a3b8',
                letterSpacing: '0.1px',
              }}
            >
              {user.username} ({user.roleId === 1 ? 'Student' : user.roleId === 2 ? 'Teacher' : 'Admin'})
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box component="nav" sx={{ flexGrow: 1, py: 3, px: 2 }}>
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {menuItems.map((item) => {
            const isActive = activeItem === item.name
            return (
              <Box component="li" key={item.name}>
                <Button
                  onClick={() => onItemClick(item.name)}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    borderRadius: '12px',
                    color: isActive ? '#4f46e5' : '#475569',
                    bgcolor: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                    fontSize: '14px',
                    fontWeight: 600,
                    textTransform: 'none',
                    justifyContent: 'flex-start',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: isActive ? 'rgba(79, 70, 229, 0.08)' : 'rgba(79, 70, 229, 0.03)',
                      color: '#4f46e5',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>{item.icon}</Box>
                  <Box component="span" sx={{ fontSize: '14px' }}>
                    {item.name}
                  </Box>
                </Button>
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* Footer / Logout */}
      <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
        <Button
          onClick={onLogout}
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: 2,
            py: 1.5,
            borderRadius: '12px',
            color: '#ef4444',
            fontSize: '14px',
            fontWeight: 600,
            textTransform: 'none',
            justifyContent: 'flex-start',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(239, 68, 68, 0.08)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}><LogOut size={20} /></Box>
          <Box component="span" sx={{ fontSize: '14px' }}>
            Logout
          </Box>
        </Button>
      </Box>
    </Box>
  )
}
