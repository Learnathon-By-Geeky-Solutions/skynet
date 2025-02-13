// import { useState } from 'react'
import Home from './pages/Home.jsx'
import AdminLoginPage from './pages/AdminLogin.jsx'
import UserSignUpPage from './pages/UserSignup.jsx'
import UserLoginPage from './pages/UserLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import UserManagementPage from './pages/AdminUserManagement.jsx'
import RoomManagementPage from './pages/AdminRoomManagement.jsx'
import BookingManagementPage from './pages/AdminBookingManagement.jsx'
import VendorRequestPage from './pages/AdminVendorRequests.jsx'
import AuthSuccess from './components/AuthSuccess.jsx'
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<UserSignUpPage />} />
      <Route path="/login" element={<UserLoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagementPage />} />
      <Route path="/admin/rooms" element={<RoomManagementPage />} />
      <Route path="/admin/bookings" element={<BookingManagementPage />} />
      <Route path="/admin/requests" element={<VendorRequestPage />} />
      <Route path="/auth-success" element={<AuthSuccess />} />
    </Routes>
)
}
export default App
