import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api'
import { Box } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { LoginRegisterMockupPane } from '../../components/Shared/LoginRegisterMockupPane'
import { LoginForm } from './components/LoginForm'

export function Login() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  // ป้องกันการกดยืนยันซ้ำซ้อน (Double submit) ระหว่างรอเซิร์ฟเวอร์ประมวลผล เพื่อแก้ปัญหา Audit Log ซ้ำ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const userData = await login(username.trim(), password)
      console.log('Logging in with:', userData)
      sessionStorage.clear()
      setUser(userData)
      setSuccess('เข้าสู่ระบบสำเร็จ! กำลังนำคุณเข้าสู่ระบบ...')

      // หน่วงเวลาเล็กน้อยเพื่อให้ผู้ใช้เห็นการแจ้งเตือนสถานะสำเร็จ ก่อนเปลี่ยนหน้า
      setTimeout(() => {
        if (userData.roleId === 2 || userData.roleId === 3) {
          navigate('/dashboard')
        } else {
          navigate('/home')
        }
      }, 500)
    } catch (err: unknown) {
      console.error('Login error:', err)
      const errorResponse = err as { response?: { data?: { message?: string } } }
      const errorMsg = errorResponse.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      setError(errorMsg)
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#ffffff',
        boxSizing: 'border-box',
        flexDirection: { xs: 'column', md: 'row' },
        '@media (prefers-color-scheme: dark)': {
          bgcolor: '#0f172a',
        },
      }}
    >
      {/* Left Pane - Presentation and Mockup Cards */}
      <LoginRegisterMockupPane />

      {/* Right Pane - Login Form */}
      <LoginForm
        username={username}
        password={password}
        error={error}
        success={success}
        loading={loading}
        onChangeUsername={setUsername}
        onChangePassword={setPassword}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}

export default Login
