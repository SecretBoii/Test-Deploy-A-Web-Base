import { Box } from '@mui/material'
import { LoginFormFields } from './LoginFormFields'
import { useNavigate } from 'react-router-dom'

interface LoginFormProps {
  username: string
  password: string
  error: string
  onChangeUsername: (val: string) => void
  onChangePassword: (val: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function LoginForm({
  username,
  password,
  error,
  onChangeUsername,
  onChangePassword,
  onSubmit,
}: LoginFormProps) {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        flex: 1.1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: { xs: '48px 24px', md: '48px' },
        bgcolor: '#ffffff',
        boxSizing: 'border-box',
        '@media (prefers-color-scheme: dark)': {
          bgcolor: '#0f172a',
        },
      }}
    >
      <div /> {/* Spacer */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flexGrow: 1,
          maxWidth: '400px',
          width: '100%',
          margin: { xs: '40px auto', md: '0 auto' },
          gap: 4.5,
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box
            component="h2"
            sx={{
              fontSize: '32px',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.5px',
              margin: 0,
              '@media (prefers-color-scheme: dark)': {
                color: '#f3f4f6',
              },
            }}
          >
            Welcome back!
          </Box>
          <Box component="p" sx={{ fontSize: '14px', color: '#64748b', fontWeight: 500, margin: 0 }}>
            Elevate your programming skills through interactive practice
          </Box>
        </Box>

        {/* Actual Form Fields */}
        <LoginFormFields
          username={username}
          password={password}
          error={error}
          onChangeUsername={onChangeUsername}
          onChangePassword={onChangePassword}
          onSubmit={onSubmit}
        />

        {/* Signup Link */}
        <Box sx={{ textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#64748b' }}>
          Don't you have an account?{' '}
          <Box
            component="span"
            onClick={() => navigate('/register')}
            sx={{
              color: '#4f46e5',
              textDecoration: 'none',
              fontWeight: 700,
              transition: 'color 0.2s',
              '&:hover': {
                color: '#4338ca',
                textDecoration: 'underline',
              },
            }}
          >
            Sign Up
          </Box>
        </Box>
      </Box>

      <div /> {/* Bottom Spacer */}
    </Box>
  )
}
