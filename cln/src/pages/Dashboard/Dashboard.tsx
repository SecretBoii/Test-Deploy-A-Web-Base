import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { MainLayout } from '../../components/MainLayout'
import { Box } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import TeacherDashboard from './components/TeacherDashboard'

export function Dashboard() {
  const { user } = useAuth()
  const [activeItem, setActiveItem] = useState('Dashboard')

  if (user?.roleId === 1) {
    return <Navigate to="/home" replace />
  }

  return (
    <MainLayout activeItem={activeItem} onItemClick={setActiveItem}>
      {/* Main content will go here */}
      <Box>
        {activeItem === 'Dashboard' ? (
          <TeacherDashboard />
        ) : (
          <h2>{activeItem}</h2>
        )}
      </Box>
    </MainLayout>
  )
}

export default Dashboard
