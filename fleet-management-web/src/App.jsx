import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import Drivers from './pages/Drivers'
import Logs from './pages/Logs'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="drivers" element={<Drivers />} />
              <Route path="trips" element={<Logs />} />
              <Route path="maintenance" element={<Logs />} />
              <Route path="fuel-logs" element={<Logs />} />
            </Routes>
          </MainLayout>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App