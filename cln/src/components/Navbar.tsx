import { Bell, Users, Menu } from 'lucide-react'
import { Avatar, IconButton, Badge, Box } from '@mui/material'

interface NavbarProps {
  onMenuClick: () => void
  user: {
    username: string
    roleId: number
  }
}

export function Navbar({ onMenuClick, user }: NavbarProps) {
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
      {/* Left menu toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
      </Box>

      {/* Right action items */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 3 }}>
        <IconButton
          aria-label="Users list"
          sx={{
            color: '#475569',
            '&:hover': { bgcolor: '#f1f5f9' },
          }}
        >
          <Users size={20} />
        </IconButton>

        <IconButton
          aria-label="Notifications"
          sx={{
            color: '#475569',
            '&:hover': { bgcolor: '#f1f5f9' },
          }}
        >
          <Badge variant="dot" color="error">
            <Bell size={20} />
          </Badge>
        </IconButton>

        <Avatar
          alt={user.username}
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
          sx={{
            cursor: 'pointer',
            border: '2px solid #e2e8f0',
            width: 36,
            height: 36,
            transition: 'transform 0.2s ease',
            '&:hover': { transform: 'scale(1.05)' },
          }}
        />
      </Box>
    </Box>
  )
}
