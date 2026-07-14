import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box
} from '@mui/material'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Play,
  Award,
  ChevronLeft,
  ChevronRight,
  MousePointer
} from 'lucide-react'

export function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(2) // 3rd dot active by default: < o o • o >

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Logging in with:', { username, password })
    navigate('/home')
  }

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 3))
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev < 3 ? prev + 1 : 0))
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
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: { xs: '32px 24px', md: '48px' },
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
          gap: { xs: '40px', md: '0px' },
          alignItems: { xs: 'center', md: 'stretch' },
          '@media (prefers-color-scheme: dark)': {
            background: 'linear-gradient(135deg, #2e1065 0%, #0f172a 100%)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontWeight: 800,
            fontSize: '22px',
            color: '#0f172a',
            letterSpacing: '0.5px',
            alignSelf: 'flex-start',
            '@media (prefers-color-scheme: dark)': {
              color: '#f3f4f6',
            },
          }}
        >
          {/* Concentric Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '3px solid #4f46e5',
              position: 'relative',
              '&::after': {
                content: '""',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '2px solid #4f46e5',
              },
            }}
          />
          <Box component="span">Python Exercise</Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            gap: { xs: '30px', md: '40px' },
            position: 'relative',
            margin: { xs: '20px 0', md: '40px 0' },
          }}
        >
          {/* Cards Wrapper */}
          <Box
            sx={{
              position: 'relative',
              width: '320px',
              height: '280px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Progress Card */}
            <Box
              sx={{
                bgcolor: '#ffffff',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0px 10px 30px rgba(15, 23, 42, 0.06)',
                border: '1px solid #e2e8f0',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0px 20px 40px rgba(15, 23, 42, 0.1)',
                },
                '@media (prefers-color-scheme: dark)': {
                  bgcolor: '#0f172a',
                  borderColor: '#2e1065',
                  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.4)',
                },
                position: 'absolute',
                top: 0,
                left: 0,
                width: '170px',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  bgcolor: 'rgba(79, 70, 229, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4f46e5',
                }}
              >
                <Award size={20} />
              </Box>
              <Box
                component="span"
                sx={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94a3b8',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                }}
              >
                Exercises Solved
              </Box>
              <Box
                component="h3"
                sx={{
                  fontSize: '26px',
                  fontWeight: 800,
                  color: '#312e81',
                  margin: 0,
                  '@media (prefers-color-scheme: dark)': {
                    color: '#6366f1',
                  },
                }}
              >
                24 / 35
              </Box>
            </Box>

            {/* Donut Chart Card */}
            <Box
              sx={{
                bgcolor: '#ffffff',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: '0px 10px 30px rgba(15, 23, 42, 0.06)',
                border: '1px solid #e2e8f0',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0px 20px 40px rgba(15, 23, 42, 0.1)',
                },
                '@media (prefers-color-scheme: dark)': {
                  bgcolor: '#0f172a',
                  borderColor: '#2e1065',
                  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.4)',
                },
                position: 'absolute',
                top: '40px',
                right: '-10px',
                width: '170px',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '130px',
                  height: '130px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '& circle.track': {
                    stroke: '#f8fafc',
                    '@media (prefers-color-scheme: dark)': {
                      stroke: '#2e1065',
                    },
                  },
                }}
              >
                <svg width="120" height="120" viewBox="0 0 100 100">
                  <circle
                    className="track"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeWidth="12"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="12"
                    strokeDasharray="65.3 251.3"
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#4f46e5"
                    strokeWidth="12"
                    strokeDasharray="85.4 251.3"
                    strokeDashoffset="-65.3"
                    style={{ strokeDasharray: '13.5 3' }}
                    transform="rotate(-90 50 50)"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#ef4444"
                    strokeWidth="12"
                    strokeDasharray="55.3 251.3"
                    strokeDashoffset="-150.7"
                    transform="rotate(-90 50 50)"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeDasharray="45.3 251.3"
                    strokeDashoffset="-206"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <Box
                  sx={{
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#0f172a',
                      lineHeight: 1,
                      '@media (prefers-color-scheme: dark)': {
                        color: '#f3f4f6',
                      },
                    }}
                  >
                    34%
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#64748b',
                      marginTop: '2px',
                    }}
                  >
                    Python
                  </Box>
                </Box>
                {/* Pointer Mouse Icon with floating animation */}
                <Box
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: '25px',
                    right: '25px',
                    zIndex: 30,
                    color: '#0f172a',
                    transform: 'rotate(-15deg)',
                    animation: 'floatPointer 3s ease-in-out infinite',
                    '@keyframes floatPointer': {
                      '0%, 100%': { transform: 'translate(0, 0) rotate(-15deg)' },
                      '50%': { transform: 'translate(-3px, -3px) rotate(-15deg)' },
                    },
                    '@media (prefers-color-scheme: dark)': {
                      color: '#f8fafc',
                    },
                  }}
                >
                  <MousePointer fill="currentColor" size={24} />
                </Box>
              </Box>
            </Box>

            {/* Run Code Card */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                width: '200px',
                bgcolor: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '20px',
                padding: '24px',
                border: '2px dashed rgba(79, 70, 229, 0.2)',
                zIndex: 15,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                boxShadow: '0px 10px 25px rgba(15, 23, 42, 0.04)',
                '@media (prefers-color-scheme: dark)': {
                  bgcolor: 'rgba(30, 41, 59, 0.6)',
                  border: '2px dashed rgba(59, 130, 246, 0.25)',
                },
              }}
            >
              {/* Play Button */}
              <Box
                sx={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  bgcolor: '#4f46e5',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
                  transition: 'transform 0.2s ease, background-color 0.2s ease',
                  cursor: 'pointer',
                  paddingLeft: '3px',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    bgcolor: '#4338ca',
                  },
                }}
              >
                <Play size={18} fill="currentColor" />
              </Box>
              <Box
                component="h4"
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: 0,
                  '@media (prefers-color-scheme: dark)': {
                    color: '#f3f4f6',
                  },
                }}
              >
                Run Python Code
              </Box>
              <Box component="p" sx={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                or drop .py file here
              </Box>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', maxWidth: '340px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box
              component="h2"
              sx={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.25,
                margin: 0,
                letterSpacing: '-0.5px',
                '@media (prefers-color-scheme: dark)': {
                  color: '#f3f4f6',
                },
              }}
            >
              Welcome back!
            </Box>
            <Box component="p" sx={{ fontSize: '14px', color: '#64748b', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
              Elevate your programming skills
              <br />
              through interactive practice
            </Box>
            {/* Carousel Indicators */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, marginTop: 3 }}>
              <Box
                onClick={handlePrevSlide}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  color: '#94a3b8',
                  transition: 'all 0.2s',
                  '&:hover': {
                    color: '#4f46e5',
                    bgcolor: 'rgba(79, 70, 229, 0.06)',
                  },
                }}
              >
                <ChevronLeft size={16} />
              </Box>
              {[0, 1, 2, 3].map((index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  sx={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    bgcolor: '#cbd5e1',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    ...(currentSlide === index && {
                      bgcolor: '#0f172a',
                      width: '16px',
                      borderRadius: '10px',
                      '@media (prefers-color-scheme: dark)': {
                        bgcolor: '#f3f4f6',
                      },
                    }),
                  }}
                />
              ))}
              <Box
                onClick={handleNextSlide}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  color: '#94a3b8',
                  transition: 'all 0.2s',
                  '&:hover': {
                    color: '#4f46e5',
                    bgcolor: 'rgba(79, 70, 229, 0.06)',
                  },
                }}
              >
                <ChevronRight size={16} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Pane - Login Form */}
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

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            noValidate
          >
            {/* Username Field */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" style={{ color: '#94a3b8', marginRight: 12 }}>
                      <User size={20} />
                    </InputAdornment>
                  ),
                  style: {
                    borderRadius: 12,
                    height: 52,
                    fontSize: 15,
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '@media (prefers-color-scheme: dark)': {
                    '& fieldset': { borderColor: '#2e1065' },
                    '&:hover fieldset': { borderColor: '#334155' },
                    color: '#f3f4f6',
                  },
                },
              }}
            />

            {/* Password Field */}
            <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="At least 8 characters"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" style={{ color: '#94a3b8', marginRight: 12 }}>
                        <Lock size={20} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end" style={{ color: '#94a3b8' }}>
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: {
                      borderRadius: 12,
                      height: 52,
                      fontSize: 15,
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '@media (prefers-color-scheme: dark)': {
                      '& fieldset': { borderColor: '#2e1065' },
                      '&:hover fieldset': { borderColor: '#334155' },
                      color: '#f3f4f6',
                    },
                  },
                }}
              />
              <Box
                component="a"
                href="#forgot"
                sx={{
                  alignSelf: 'flex-end',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#4f46e5',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: '#4338ca',
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot password?
              </Box>
            </Box>

            {/* Login CTA */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                height: '50px',
                fontSize: '15px',
                fontWeight: 700,
                borderRadius: '12px',
                textTransform: 'none',
                backgroundColor: '#4f46e5',
                boxShadow: '0px 4px 15px rgba(79, 70, 229, 0.15)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#4338ca',
                  boxShadow: '0px 6px 20px rgba(79, 70, 229, 0.25)',
                },
              }}
            >
              Login
            </Button>

            {/* Divider */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '13px',
                fontWeight: 700,
                margin: '10px 0',
                '&::before, &::after': {
                  content: '""',
                  flex: 1,
                  borderBottom: '1px solid #e2e8f0',
                  '@media (prefers-color-scheme: dark)': {
                    borderColor: '#2e1065',
                  },
                },
                '&::before': { marginRight: '16px' },
                '&::after': { marginLeft: '16px' },
              }}
            >
              or
            </Box>

            {/* Social Logins */}
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <Box
                component="button"
                type="button"
                sx={{
                  flex: 1,
                  height: '48px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  bgcolor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.2,
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                  '&:hover': {
                    bgcolor: '#f8fafc',
                    borderColor: '#cbd5e1',
                    '@media (prefers-color-scheme: dark)': {
                      bgcolor: '#2e1065',
                      borderColor: '#334155',
                    },
                  },
                  '@media (prefers-color-scheme: dark)': {
                    bgcolor: '#0f172a',
                    borderColor: '#2e1065',
                    color: '#f3f4f6',
                  },
                }}
              >
                <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Box>

              <Box
                component="button"
                type="button"
                sx={{
                  flex: 1,
                  height: '48px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  bgcolor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.2,
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                  '&:hover': {
                    bgcolor: '#f8fafc',
                    borderColor: '#cbd5e1',
                    '@media (prefers-color-scheme: dark)': {
                      bgcolor: '#2e1065',
                      borderColor: '#334155',
                    },
                  },
                  '@media (prefers-color-scheme: dark)': {
                    bgcolor: '#0f172a',
                    borderColor: '#2e1065',
                    color: '#f3f4f6',
                  },
                }}
              >
                <svg fill="#1877F2" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Box>
            </Box>

            {/* Signup Link */}
            <Box sx={{ textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#64748b' }}>
              Don't you have an account?{' '}
              <Box
                component="a"
                href="#signup"
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
        </Box>

        <Box
          sx={{
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: '#94a3b8',
            letterSpacing: '0.8px',
          }}
        >
          © 2022 ALL RIGHTS RESERVED
        </Box>
      </Box>
    </Box>
  )
}

export default Login
