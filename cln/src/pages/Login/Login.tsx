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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const userData = await login(username.trim(), password)
      console.log('Logging in with:', userData)
      setUser(userData)

      if (userData.roleId === 2 || userData.roleId === 3) {
        navigate('/dashboard')
      } else {
        navigate('/home')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      const errorMsg = err.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      setError(errorMsg)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#ffffff',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
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
        onChangeUsername={setUsername}
        onChangePassword={setPassword}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}

export default Login
