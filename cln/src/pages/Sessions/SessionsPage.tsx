import { Navigate } from 'react-router-dom'
import { MainLayout } from '../../components/MainLayout'
import SessionStudent from './SessionStudent'
import { useAuth } from '../../context/AuthContext'

export function SessionsPage() {
  const { user } = useAuth()

  // ป้องกันผู้ที่ไม่ใช่ Student (roleId !== 1) แอบเข้าหน้านี้ตรงๆ ผ่าน URL
  if (user?.roleId !== 1) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <MainLayout activeItem="Sessions">
      <SessionStudent userId={user.userId} onSelectExercise={(exerciseId) => console.log('Selected Exercise:', exerciseId)} />
    </MainLayout>
  )
}

export default SessionsPage
