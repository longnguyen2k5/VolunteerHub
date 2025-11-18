import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { CircularProgress, Box } from "@mui/material";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import OAuthCallback from "./pages/OAuthCallback";
import Forbidden from "./pages/Forbidden";

// Components
import PrivateRoute from "./components/auth/PrivateRoute";
import RoleGuard from "./components/auth/RoleGuard";
import Layout from "./components/common/Layout";

// Event Pages
import EventBrowse from "./pages/volunteer/EventBrowse";
import EventDetailPage from "./pages/volunteer/EventDetailPage";

// Organizer Pages
import EventList from "./pages/organizer/EventList";
import CreateEvent from "./pages/organizer/CreateEvent";
import EditEvent from "./pages/organizer/EditEvent";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="register"
          element={!user ? <Register /> : <Navigate to="/dashboard" />}
        />

        {/* OAuth Callback */}
        <Route path="callback" element={<OAuthCallback />} />
        
        {/* Forbidden */}
        <Route path="forbidden" element={<Forbidden />} />

        {/* Event Routes (Public) */}
        <Route path="events" element={<EventBrowse />} />
        <Route path="events/:id" element={<EventDetailPage />} />

        {/* Protected Routes - All authenticated users */}
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        
        {/* EVENT_MANAGER Routes */}
        <Route
          path="events/manage"
          element={
            <RoleGuard allowedRoles={['EVENT_MANAGER', 'ADMIN']}>
              <EventList />
            </RoleGuard>
          }
        />
        
        <Route
          path="events/create"
          element={
            <RoleGuard allowedRoles={['EVENT_MANAGER', 'ADMIN']}>
              <CreateEvent />
            </RoleGuard>
          }
        />
        
        <Route
          path="events/edit/:id"
          element={
            <RoleGuard allowedRoles={['EVENT_MANAGER', 'ADMIN']}>
              <EditEvent />
            </RoleGuard>
          }
        />
        
        {/* ADMIN Routes */}
        <Route
          path="admin/events"
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <div>Admin - Approve Events (TODO: Phase 3)</div>
            </RoleGuard>
          }
        />
        
        <Route
          path="admin/users"
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <div>Admin - Manage Users (TODO: Phase 3)</div>
            </RoleGuard>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
