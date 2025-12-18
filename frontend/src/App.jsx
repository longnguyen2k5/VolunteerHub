import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { CircularProgress, Box } from "@mui/material";

// Pages
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
import EventChannel from "./pages/volunteer/EventChannel";
import ParticipationHistory from "./pages/volunteer/ParticipationHistory";

// Organizer Pages
import EventList from "./pages/organizer/EventList";
import CreateEvent from "./pages/organizer/CreateEvent";
import EditEvent from "./pages/organizer/EditEvent";
import EventRegistrations from "./pages/organizer/EventRegistrations";

// Admin Pages
import EventApproval from "./pages/admin/EventApproval";
import UserManagement from "./pages/admin/UserManagement";

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
        <Route path="events/:id/channel" element={<EventChannel />} />

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
            <RoleGuard allowedRoles={["EVENT_MANAGER", "ADMIN"]}>
              <EventList />
            </RoleGuard>
          }
        />

        <Route
          path="events/manage/:id/registrations"
          element={
            <RoleGuard allowedRoles={["EVENT_MANAGER", "ADMIN"]}>
              <EventRegistrations />
            </RoleGuard>
          }
        />

        <Route
          path="events/create"
          element={
            <RoleGuard allowedRoles={["EVENT_MANAGER", "ADMIN"]}>
              <CreateEvent />
            </RoleGuard>
          }
        />

        <Route
          path="events/edit/:id"
          element={
            <RoleGuard allowedRoles={["EVENT_MANAGER", "ADMIN"]}>
              <EditEvent />
            </RoleGuard>
          }
        />

        {/* ADMIN Routes */}
        <Route
          path="admin/events"
          element={
            <RoleGuard allowedRoles={["ADMIN"]}>
              <EventApproval />
            </RoleGuard>
          }
        />

        <Route
          path="admin/users"
          element={
            <RoleGuard allowedRoles={["ADMIN"]}>
              <UserManagement />
            </RoleGuard>
          }
        />

        {/* VOLUNTEER Routes */}
        <Route
          path="my-registrations"
          element={
            <RoleGuard allowedRoles={["VOLUNTEER"]}>
              <ParticipationHistory />
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
