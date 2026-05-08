import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import FirebaseWarning from './components/FirebaseWarning';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ModulePage from './pages/ModulePage';
import UnitPage from './pages/UnitPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const { currentUser } = useAuth();

  return (
    <div className="app-shell">
      <Navbar />
      <FirebaseWarning />
      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={currentUser ? '/dashboard' : '/login'} replace />}
          />
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={currentUser ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modules/:moduleId"
            element={
              <ProtectedRoute>
                <ModulePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modules/:moduleId/units/:unitId"
            element={
              <ProtectedRoute>
                <UnitPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>
          🌿 GreenMOOC · Prototype edition · Built with React, Vite &amp; Firebase
        </p>
      </footer>
    </div>
  );
}
