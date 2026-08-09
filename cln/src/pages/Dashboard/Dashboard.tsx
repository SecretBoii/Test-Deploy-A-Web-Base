import { useState } from 'react'
import { MainLayout } from '../../components/Layout/MainLayout'
import { Box } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import TeacherDashboard from './components/TeacherDashboard'
import AdminDashboard from './components/AdminDashboard'

export function Dashboard() {
  const { user } = useAuth()
  const [activeItem, setActiveItem] = useState('Dashboard')

  return (
    <MainLayout activeItem={activeItem} onItemClick={setActiveItem}>
      {/* Main content will go here */}
      <Box>
        {activeItem === 'Dashboard' ? (
          user?.roleId === 3 ? (
            <AdminDashboard />
          ) : (
            <TeacherDashboard />
          )
        ) : (
          <h2>{activeItem}</h2>
        )}
      </Box>
    </MainLayout>
  )
}

export default Dashboard
