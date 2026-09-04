import { MainLayout } from '../../components/Layout/MainLayout'
import { useAuth } from '../../context/AuthContext'
import { Box } from '@mui/material'
import TeacherDashboard from './components/TeacherDashboard'
import AdminDashboard from './components/AdminDashboard'

export function Dashboard() {
  const { user } = useAuth()

  return (
    <MainLayout activeItem="Dashboard">
      <Box sx={{ width: '100%', maxWidth: '1440px', mx: 'auto' }}>
        {user?.roleId === 3 ? <AdminDashboard /> : <TeacherDashboard />}
      </Box>
    </MainLayout>
  )
}

export default Dashboard
 