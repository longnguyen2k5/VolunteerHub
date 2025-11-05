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

// Components
import PrivateRoute from "./components/auth/PrivateRoute";
import Layout from "./components/common/Layout";

// Event Pages
import EventBrowse from "./pages/volunteer/EventBrowse";
import EventDetailPage from "./pages/volunteer/EventDetailPage";

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

        {/* Event Routes (Public) */}
        <Route path="events" element={<EventBrowse />} />
        <Route path="events/:id" element={<EventDetailPage />} />

        {/* Protected Routes */}
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
