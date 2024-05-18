import React from 'react'
import Room from './Pages/Room'
import Login from './Pages/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import { AuthProvider } from './utils/AuthContext'
import Register from './Pages/Register'

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path='/' element={<Room />} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
