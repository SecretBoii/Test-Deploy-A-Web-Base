import { Navigate } from 'react-router-dom'

export function Home() {
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Home Page</h1>
      <p>สวัสดี, {user.username}</p>
      <button onClick={handleLogout}>ออกจากระบบ</button>
    </div>
  )
}

export default Home
