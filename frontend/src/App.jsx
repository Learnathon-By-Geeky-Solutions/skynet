import { useState } from 'react'
import Home from './pages/Home.jsx'
import AdminLoginPage from './pages/AdminLogin.jsx'
import UserSignUpPage from './pages/UserSignup.jsx'
import UserLoginPage from './pages/UserLogin.jsx'
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<UserSignUpPage />} />
      <Route path="/login" element={<UserLoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
    </Routes>
)
}
export default App
