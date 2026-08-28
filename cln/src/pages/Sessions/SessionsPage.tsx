import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MainLayout } from '../../components/Layout/MainLayout'
import SessionStudent from './SessionStudent'
import { useAuth } from '../../context/AuthContext'

export function SessionsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // รองรับการย้อนกลับสำหรับลิงก์เก่าที่ใช้ ?level=X โดย Redirect ไปยัง /sessions/levelX
  useEffect(() => {
    const levelParam = searchParams.get('level')
    if (levelParam) {
      navigate(`/sessions/level${levelParam}`, { replace: true })
    }
  }, [searchParams, navigate])

  if (!user) {
    return null
  }

  return (
    <MainLayout activeItem="Sessions">
      <SessionStudent
        userId={user.userId}
        onSelectLevel={(levelId) => {
          navigate(`/sessions/level${levelId}`)
        }}
      />
    </MainLayout>
  )
}

export default SessionsPage
