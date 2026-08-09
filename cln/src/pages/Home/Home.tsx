import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '../../components/Layout/MainLayout'
import { Box } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import StudentDashboard from './components/StudentHome'

export function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeItem, setActiveItem] = useState('Home')

  return (
    <MainLayout activeItem={activeItem} onItemClick={setActiveItem}>
      <Box>
        {activeItem === 'Home' ? (
          <StudentDashboard
            username={user?.username || ''}
            onSelectExercise={(exerciseId, sessionId) => {
              const url = sessionId ? `/editor/${exerciseId}?sessionId=${sessionId}` : `/editor/${exerciseId}`
              navigate(url)
            }}
          />
        ) : (
          <h2>{activeItem}</h2>
        )}
      </Box>
    </MainLayout>
  )
}

export default Home
