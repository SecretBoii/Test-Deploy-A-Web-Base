import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { MainLayout } from '../../components/MainLayout'
import { Box } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import StudentDashboard from './components/StudentHome'

export function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeItem, setActiveItem] = useState('Home')

  if (user?.roleId === 2 || user?.roleId === 3) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <MainLayout activeItem={activeItem} onItemClick={setActiveItem}>
      <Box>
        {activeItem === 'Home' ? (
          <StudentDashboard
            username={user?.username || ''}
            onSelectExercise={(exerciseId) => navigate(`/editor/${exerciseId}`)}
          />
        ) : (
          <h2>{activeItem}</h2>
        )}
      </Box>
    </MainLayout>
  )
}

export default Home
