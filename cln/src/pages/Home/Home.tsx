import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { MainLayout } from '../../components/MainLayout'
import { Box } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import StudentDashboard from './components/StudentHome'

export function Home() {
  const { user } = useAuth()
  const [activeItem, setActiveItem] = useState('Home')

  if (user?.roleId === 2) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <MainLayout activeItem={activeItem} onItemClick={setActiveItem}>
      {/* Main content will go here */}
      <Box>
        {activeItem === 'Home' ? (
          <StudentDashboard username={user?.username || ''} onSelectExercise={() => {}} />
        ) : (
          <h2>{activeItem}</h2>
        )}
      </Box>
    </MainLayout>
  )
}

export default Home
