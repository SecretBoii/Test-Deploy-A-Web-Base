import { Search, Bell, Users, Menu } from 'lucide-react'
import { Avatar, IconButton, Badge, Box, InputBase } from '@mui/material'

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
      {/* Left search & menu toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, maxWidth: 480 }}>
        <IconButton
          onClick={onMenuClick}
          aria-label="Open menu"
          sx={{
            color: '#475569',
            mr: 1,
            display: { xs: 'inline-flex', md: 'none' },
          }}
        >
          <Menu size={22} />
        </IconButton>

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#f1f5f9',
            borderRadius: '10px',
            px: 2,
            py: 0.5,
            border: '1px solid transparent',
            transition: 'all 0.2s ease',
            '&:focus-within': {
              bgcolor: '#ffffff',
              borderColor: '#4f46e5',
              boxShadow: '0 0 0 4px rgba(79, 70, 229, 0.1)',
            },
          }}
        >
          <Search style={{ color: '#94a3b8', marginRight: 10 }} size={18} />
          <InputBase
            placeholder="Search..."
            fullWidth
            sx={{
              fontSize: '14px',
              color: '#0f172a',
              input: {
                padding: '8px 0',
              },
            }}
          />
        </Box>
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
