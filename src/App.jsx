import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import FirebaseWarning from './components/FirebaseWarning';
import SiteFooter from './components/SiteFooter';
import ScrollToTop from './components/ScrollToTop';

import AboutPage from './pages/AboutPage';
import VerifyPage from './pages/VerifyPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ModulePage from './pages/ModulePage';
import UnitPage from './pages/UnitPage';
import CertificatePage from './pages/CertificatePage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const { currentUser, loading } = useAuth();
  // Only a *known* session should bounce a visitor off the auth pages.
  const signedIn = !loading && !!currentUser;

  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />
      <FirebaseWarning />
      <main className="app-main">
        <Routes>
          {/* Public introduction — the platform's front door, and the link
              between this MOOC and the CREDIT project website. */}
          <Route path="/" element={<AboutPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* Pilot activities live in a section on the landing page (PA6
              action 14) rather than on a route of their own. The old /pilots
              link is kept as a redirect so shared links still work. */}
          <Route
            path="/pilots"
            element={<Navigate to="/" state={{ scrollTo: 'pilots' }} replace />}
          />

          {/* Public certificate verification. Anyone holding a printed
              certificate must be able to check it without an account, so this
              stays outside ProtectedRoute. */}
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/verify/:code" element={<VerifyPage />} />

          <Route
            path="/login"
            element={signedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={signedIn ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
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
          <Route
            path="/certificate"
            element={
              <ProtectedRoute>
                <CertificatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}
