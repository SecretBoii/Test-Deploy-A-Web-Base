import { useState } from 'react'
import {
  Search,
  Bell,
  Users,
  LayoutDashboard,
  Code2,
  Play,
  Award,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react'
import { Avatar, IconButton, Badge, Box, Drawer, Button, InputBase } from '@mui/material'

export function Home() {
  const [activeItem, setActiveItem] = useState('Dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Exercises', icon: <Code2 size={20} /> },
    { name: 'Sessions', icon: <Play size={20} /> },
    { name: 'Leaderboard', icon: <Award size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> },
  ]

  const handleMenuClick = (itemName: string) => {
    setActiveItem(itemName)
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    console.log('Logging out...')
    window.location.href = '/login'
  }

  // Common Sidebar Nav List
  const SidebarNavContent = () => (
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
                letterSpacing: '0.2px',
              }}
            >
              Your Tier : Premium
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
                  onClick={() => handleMenuClick(item.name)}
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
          onClick={handleLogout}
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

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#f8fafc',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Sidebar - Desktop Layout */}
      <Box
        component="aside"
        sx={{
          width: 280,
          minWidth: 280,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderRight: '1px solid #e2e8f0',
          background: 'linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%)',
        }}
      >
        <SidebarNavContent />
      </Box>

      {/* Sidebar - Mobile Layout using MUI Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%)',
            borderRight: '1px solid #e2e8f0',
          },
        }}
      >
        <SidebarNavContent />
      </Drawer>

      {/* Main Content Layout */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
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
              onClick={() => setMobileMenuOpen(true)}
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
                  }
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
              alt="User Avatar"
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

        {/* Content Area */}
        <Box sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 } }}>
          {/* Main content will go here */}
        </Box>
      </Box>
    </Box>
  )
}

export default Home
