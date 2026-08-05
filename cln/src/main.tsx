import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Login from './pages/Login/Login.tsx'
import Register from './pages/Register/Register.tsx'
import Home from './pages/Home/Home.tsx'
import Dashboard from './pages/Dashboard/Dashboard.tsx'
import SessionsPage from './pages/Sessions/SessionsPage.tsx'
import EditorPage from './pages/Editor/EditorPage.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import ProtectedRoute from './components/Auth/ProtectedRoute.tsx'
import ResultPage from './pages/Result/ResultPage.tsx'
import HistoryPage from './pages/History/HistoryPage.tsx'
import ProfilePage from './pages/Profile/ProfilePage.tsx'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', 'Leelawadee UI', sans-serif",
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/sessions" element={<SessionsPage />} />
              <Route path="/editor/:exerciseId" element={<EditorPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/result/:activityId" element={<ResultPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  </ThemeProvider>
  </StrictMode>,
)
