import React, { useState } from 'react'
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
import './Login.css'

export function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(2) // 3rd dot active by default to match image: < o o • o >

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated authentication
    console.log('Logging in with:', { username, password })
  }

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 3))
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev < 3 ? prev + 1 : 0))
  }

  return (
    <div className="login-page-container">
      {/* Left Pane - Presentation and Mockup Cards */}
      <div className="left-pane">
        <div className="logo-container">
          <div className="concentric-logo" />
          <span>Python Exercise</span>
        </div>

        <div className="left-content">
          <div className="cards-wrapper">
            {/* Progress Card */}
            <div className="card-base card-balance">
              <div className="icon-wallet-wrapper">
                <Award size={20} />
              </div>
              <span className="card-balance-title">Exercises Solved</span>
              <h3 className="card-balance-value">24 / 35</h3>
            </div>

            {/* Donut Chart Card */}
            <div className="card-base card-chart">
              <div className="donut-chart-container">
                <svg width="120" height="120" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="12"
                  />
                  {/* Orange Sector (26%) */}
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
                  {/* Blue Sector (34% - segmented / dashed to match image) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#2563eb"
                    strokeWidth="12"
                    strokeDasharray="85.4 251.3"
                    strokeDashoffset="-65.3"
                    // Adding visual dash divisions for the segmented effect in the image
                    style={{ strokeDasharray: '13.5 3' }}
                    transform="rotate(-90 50 50)"
                  />
                  {/* Red Sector (22%) */}
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
                  {/* Green Sector (18%) */}
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
                <div className="donut-center-text">
                  <span className="donut-percentage">34%</span>
                  <span className="donut-label">Python</span>
                </div>
                {/* Pointer Mouse Icon */}
                <MousePointer className="pointer-icon" fill="#0f172a" size={24} />
              </div>
            </div>

            {/* Run Code Card */}
            <div className="card-new-transaction">
              <div className="plus-btn" style={{ paddingLeft: 3 }}>
                <Play size={18} fill="currentColor" />
              </div>
              <h4 className="transaction-title">Run Python Code</h4>
              <p className="transaction-subtitle">or drop .py file here</p>
            </div>
          </div>

          <div className="left-text-section">
            <h2 className="left-title">Welcome back!</h2>
            <p className="left-subtitle">
              Elevate your programming skills
              <br />
              through interactive practice
            </p>
            <div className="carousel-indicators">
              <div className="indicator-arrow" onClick={handlePrevSlide}>
                <ChevronLeft size={16} />
              </div>
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`indicator-dot ${
                    currentSlide === index ? 'active' : ''
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
              <div className="indicator-arrow" onClick={handleNextSlide}>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="right-pane">
        <div /> {/* Spacer to align content */}
        <div className="right-content">
          <div className="login-header">
            <h2 className="login-title">Welcome back!</h2>
            <p className="login-subtitle">
              Elevate your programming skills through interactive practice
            </p>
          </div>

          <Box
            component="form"
            onSubmit={handleSubmit}
            className="login-form"
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
                    fontSize: 15
                  }
                }
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
                      fontSize: 15
                    }
                  }
                }}
              />
              <a href="#forgot" className="forgot-password">
                Forgot password?
              </a>
            </Box>

            {/* Login CTA */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              className="login-btn"
              style={{ backgroundColor: '#2563eb' }}
            >
              Login
            </Button>

            {/* Divider */}
            <div className="or-divider">or</div>

            {/* Social Logins */}
            <div className="social-buttons">
              <button type="button" className="social-btn">
                <svg viewBox="0 0 24 24">
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
              </button>
              <button type="button" className="social-btn">
                <svg fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            {/* Signup Link */}
            <div className="signup-prompt">
              Don't you have an account?{' '}
              <a href="#signup" className="signup-link">
                Sign Up
              </a>
            </div>
          </Box>
        </div>

        <div className="right-footer">© 2022 ALL RIGHTS RESERVED</div>
      </div>
    </div>
  )
}
export default Login
