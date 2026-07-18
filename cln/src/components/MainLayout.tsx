import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { useAuth } from '../context/AuthContext'

interface MainLayoutProps {
  children?: React.ReactNode
  activeItem?: string
  onItemClick?: (name: string) => void
}

export function MainLayout({ children, activeItem = 'Home', onItemClick }: MainLayoutProps) {
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)

  // Auth session check
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  if (!user) {
    return <Navigate to="/" replace />
  }

  const handleLogout = () => {
    console.log('Logging out...')
    logout();
  }

  const handleToggleSidebar = () => {
    setDesktopSidebarOpen(!desktopSidebarOpen)
  }

  const handleItemClick = (name: string) => {
    if (onItemClick) {
      onItemClick(name)
    }
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
      {/* Sidebar - Web Layout */}
      <Box
        component="aside"
        sx={{
          width: desktopSidebarOpen ? 280 : 0,
          minWidth: desktopSidebarOpen ? 280 : 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderRight: desktopSidebarOpen ? '1px solid #e2e8f0' : 'none',
          background: 'linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%)',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Sidebar
            activeItem={activeItem}
            onItemClick={handleItemClick}
            user={user}
            onLogout={handleLogout}
          />
        </Box>
      </Box>

      {/* Main Content Layout */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <Navbar onMenuClick={handleToggleSidebar} user={user} />

        {/* Content Area */}
        <Box sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 } }}>
          {children || <Outlet />}
        </Box>
      </Box>
    </Box>
  )
}

export default MainLayout

