// UPDATED: thêm HomeRedirect để tránh redirect loop khi chưa đăng nhập
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppShell from './components/AppShell'
import Login from './pages/Login'
import Notifications from './pages/Notifications'
import AdminDashboard from './pages/AdminDashboard'
import Protected from './components/Protected'

// NEW: Quyết định trang đích dựa theo trạng thái đăng nhập
function HomeRedirect(){
  const token = useSelector(s => s.auth.token)
  return <Navigate to={token ? '/notifications' : '/login'} replace />
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}> 
          {/* UPDATED: thay vì Navigate cố định sang /notifications */}
          <Route index element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />

          {/* Auth required */}
          <Route path="/notifications" element={<Protected><Notifications/></Protected>} />

          {/* Admin required */}
          <Route path="/admin" element={<Protected role="Admin"><AdminDashboard/></Protected>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}