import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MySchedulePage from "./pages/MySchedulePage";
import ActiveSessionsPage from "./pages/ActiveSessionsPage";
import LiveSessionPage from "./pages/LiveSessionPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-schedule"
          element={
            <ProtectedRoute>
              <MySchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/active-sessions"
          element={
            <ProtectedRoute>
              <ActiveSessionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/live/:sessionId"
          element={
            <ProtectedRoute>
              <LiveSessionPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
