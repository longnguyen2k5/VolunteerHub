import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

// Components
import PrivateRoute from './components/auth/PrivateRoute'
import Layout from './components/common/Layout'

function App() {
    const { user, loading } = useAuth()

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
                <Route path="register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

                <Route path="dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
            </Route>
        </Routes>
    )
}

export default App