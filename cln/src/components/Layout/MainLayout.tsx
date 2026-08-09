import { useState } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { useAuth } from '../../context/AuthContext'

interface MainLayoutProps {
  children?: React.ReactNode
  activeItem?: string
  onItemClick?: (name: string) => void
}

const MENU_ROUTE_MAP: Record<string, string> = {
  Home: '/home',
  Dashboard: '/dashboard',
  Sessions: '/sessions',
  Exercises: '/exercises',
  History: '/history',
  Profile: '/profile',
}

export function MainLayout({ children, activeItem }: MainLayoutProps) {
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/" replace />
  }

  const handleLogout = () => {
    logout()
  }

  const handleToggleSidebar = () => {
    setDesktopSidebarOpen(!desktopSidebarOpen)
  }

  const handleItemClick = (name: string) => {
    const route = MENU_ROUTE_MAP[name]
    if (route) {
      navigate(route)
    }
  }

  // Determine current active item from URL path if not explicitly provided
  let currentActiveItem = activeItem
  if (!currentActiveItem) {
    if (location.pathname.startsWith('/sessions')) currentActiveItem = 'Sessions'
    else if (location.pathname.startsWith('/dashboard')) currentActiveItem = 'Dashboard'
    else if (location.pathname.startsWith('/exercises')) currentActiveItem = 'Exercises'
    else if (location.pathname.startsWith('/history')) currentActiveItem = 'History'
    else if (location.pathname.startsWith('/profile')) currentActiveItem = 'Profile'
    else currentActiveItem = 'Home'
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#f8fafc',
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
            activeItem={currentActiveItem}
            onItemClick={handleItemClick}
            user={user}
            onLogout={handleLogout}
          />
        </Box>
      </Box>

      {/* Main Content Layout */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <Navbar onMenuClick={handleToggleSidebar} user={user} activeItem={currentActiveItem} />

        {/* Content Area */}
        <Box sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default MainLayout
