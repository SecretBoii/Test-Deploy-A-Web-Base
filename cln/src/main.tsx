import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Login from './pages/Login/Login.tsx'
import Register from './pages/Register/Register.tsx'
import Home from './pages/Home/Home.tsx'
import Dashboard from './pages/Dashboard/Dashboard.tsx'
import ExercisesPage from './pages/Exercises/ExercisesPage.tsx'
import SessionsPage from './pages/Sessions/SessionsPage.tsx'
import LevelDetailPage from './pages/Sessions/components/student/LevelDetailPage.tsx'
import EditorPage from './pages/Editor/EditorPage.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import ProtectedRoute from './components/Auth/ProtectedRoute.tsx'
import RoleProtectedRoute from './components/Auth/RoleProtectedRoute.tsx'
import ResultPage from './pages/Result/ResultPage.tsx'
import HistoryPage from './pages/History/HistoryPage.tsx'
import ProfilePage from './pages/Profile/ProfilePage.tsx'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import UsersPage from './pages/UsersManagement/UsersPage.tsx'
import ReportsPage from './pages/report/reportsPage.tsx'
import AdminAuditLogPage from './pages/Auditlog/AdminAuditLogPage.tsx'

const theme = createTheme({
  typography: {
    // fontFamily: "'Roboto', 'Leelawadee UI', sans-serif",
    // fontFamily: "'Inter', 'IBM Plex Sans Thai', sans-serif",
    fontFamily: "'Inter', 'Leelawadee UI', sans-serif",
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
              {/* Student-only routes (roleId === 1) */}
              <Route element={<RoleProtectedRoute allowedRoles={[1]} />}>
                <Route path="/home" element={<Home />} />
                <Route path="/sessions/:levelId" element={<LevelDetailPage />} />
                <Route path="/editor/:exerciseId" element={<EditorPage />} />
                <Route path="/result/:activityId" element={<ResultPage />} />
                <Route path="/history" element={<HistoryPage />} />
              </Route>

              {/* Shared Sessions entry route (Student & Teacher) */}
              <Route element={<RoleProtectedRoute allowedRoles={[1, 2]} />}>
                <Route path="/sessions" element={<SessionsPage />} />
              </Route>

              {/* Shared profile route (roles 1, 2, 3) */}
              <Route element={<RoleProtectedRoute allowedRoles={[1, 2, 3]} />}>
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Teacher-only routes (roleId === 2) */}
              <Route element={<RoleProtectedRoute allowedRoles={[2]} />}>
                <Route path="/exercises" element={<ExercisesPage />} />
              </Route>

              {/* Teacher & Admin dashboard routes */}
              <Route element={<RoleProtectedRoute allowedRoles={[2, 3]} />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

               {/* Admin-only routes (roleId === 3) */}
              <Route element={<RoleProtectedRoute allowedRoles={[3]} />}>
                <Route path="/users" element={<UsersPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/audit-logs" element={<AdminAuditLogPage />} />
             </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  </ThemeProvider>
  </StrictMode>,
)
