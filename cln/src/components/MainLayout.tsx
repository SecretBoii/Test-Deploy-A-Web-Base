import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Box, Drawer } from '@mui/material'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { useAuth } from '../context/AuthContext'

interface MainLayoutProps {
  children?: React.ReactNode
  activeItem?: string
  onItemClick?: (name: string) => void
}

export function MainLayout({ children, activeItem = 'Home', onItemClick }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />
  }

  const handleLogout = () => {
    console.log('Logging out...')
    logout();
  }

  const handleItemClick = (name: string) => {
    if (onItemClick) {
      onItemClick(name)
    }
    setMobileMenuOpen(false)
  }

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
        <Sidebar
          activeItem={activeItem}
          onItemClick={handleItemClick}
          user={user}
          onLogout={handleLogout}
        />
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
        <Sidebar
          activeItem={activeItem}
          onItemClick={handleItemClick}
          user={user}
          onLogout={handleLogout}
        />
      </Drawer>

      {/* Main Content Layout */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <Navbar onMenuClick={() => setMobileMenuOpen(true)} user={user} />

        {/* Content Area */}
        <Box sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 } }}>
          {children || <Outlet />}
        </Box>
      </Box>
    </Box>
  )
}

export default MainLayout
