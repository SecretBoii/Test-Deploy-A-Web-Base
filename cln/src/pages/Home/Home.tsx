import { useNavigate } from 'react-router-dom'
import { MainLayout } from '../../components/Layout/MainLayout'
import { useAuth } from '../../context/AuthContext'
import StudentDashboard from './components/StudentHome'

export function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // ใช้ MainLayout กำหนด activeItem="Home" โดยตรง โดยไม่ต้องมี local state ซ้ำซ้อน
  return (
    <MainLayout activeItem="Home">
      <StudentDashboard
        username={user?.username || ''}
        onSelectExercise={(exerciseId, sessionId) => {
          const url = sessionId ? `/editor/${exerciseId}?sessionId=${sessionId}` : `/editor/${exerciseId}`
          navigate(url)
        }}
      />
    </MainLayout>
  )
}

export default Home
