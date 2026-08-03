import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { MainLayout } from '../../components/Layout/MainLayout'
import SessionStudent from './SessionStudent'
import { useAuth } from '../../context/AuthContext'

export function SessionsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // ป้องกันผู้ที่ไม่ใช่ Student (roleId !== 1) แอบเข้าหน้านี้ตรงๆ ผ่าน URL
  if (user?.roleId !== 1) {
    return <Navigate to="/dashboard" replace />
  }

  const levelParam = searchParams.get('level')
  const initialLevel = levelParam ? parseInt(levelParam, 10) : null

  return (
    <MainLayout activeItem="Sessions">
      <SessionStudent
        userId={user.userId}
        initialLevel={initialLevel}
        onSelectExercise={(exerciseId, sessionId) => {
          navigate(`/editor/${exerciseId}?sessionId=${sessionId}`)
        }}
      />
    </MainLayout>
  )
}

export default SessionsPage
