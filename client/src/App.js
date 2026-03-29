import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import HomePage        from './pages/HomePage';
import AboutPage       from './pages/public/AboutPage';
import ProgrammesPage  from './pages/public/ProgrammesPage';
import GetInvolvedPage from './pages/public/GetInvolvedPage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import ForgotPassword  from './pages/ForgotPassword';
import ResetPassword   from './pages/ResetPassword';

// Mentee pages
import MenteeDashboard from './pages/mentee/Dashboard';
import MenteeModules   from './pages/mentee/Modules';
import MenteeSessions  from './pages/mentee/Sessions';
import NeedAnalysis    from './pages/mentee/NeedAnalysis';
import MenteeProfile   from './pages/mentee/Profile';

// Mentor pages
import MentorDashboard from './pages/mentor/Dashboard';
import MentorMentees   from './pages/mentor/Mentees';
import MentorSessions  from './pages/mentor/Sessions';
import MentorProfile   from './pages/mentor/Profile';

// Admin pages
import AdminDashboard  from './pages/admin/Dashboard';
import AdminUsers      from './pages/admin/Users';
import AdminMatching   from './pages/admin/Matching';
import AdminSessions   from './pages/admin/Sessions';
import AdminModules    from './pages/admin/Modules';

const PrivateRoute = ({ children, roles }) => {
  const { user, token, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-700 rounded-full animate-spin mx-auto mb-4"/>
        <p className="text-gray-500 text-sm">Loading MentorLink...</p>
      </div>
    </div>
  );
  if (!token || !user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', borderRadius: '12px' },
            success: { iconTheme: { primary: '#3730a3', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/"              element={<HomePage />} />
          <Route path="/about"         element={<AboutPage />} />
          <Route path="/programmes"    element={<ProgrammesPage />} />
          <Route path="/get-involved"  element={<GetInvolvedPage />} />
          <Route path="/login"         element={<LoginPage />} />
          <Route path="/register"      element={<RegisterPage />} />
          <Route path="/forgot-password"      element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Mentee */}
          <Route path="/mentee/dashboard"     element={<PrivateRoute roles={['mentee']}><MenteeDashboard /></PrivateRoute>} />
          <Route path="/mentee/modules"       element={<PrivateRoute roles={['mentee']}><MenteeModules /></PrivateRoute>} />
          <Route path="/mentee/sessions"      element={<PrivateRoute roles={['mentee']}><MenteeSessions /></PrivateRoute>} />
          <Route path="/mentee/need-analysis" element={<PrivateRoute roles={['mentee']}><NeedAnalysis /></PrivateRoute>} />
          <Route path="/mentee/profile"       element={<PrivateRoute roles={['mentee']}><MenteeProfile /></PrivateRoute>} />

          {/* Mentor */}
          <Route path="/mentor/dashboard" element={<PrivateRoute roles={['mentor']}><MentorDashboard /></PrivateRoute>} />
          <Route path="/mentor/mentees"   element={<PrivateRoute roles={['mentor']}><MentorMentees /></PrivateRoute>} />
          <Route path="/mentor/sessions"  element={<PrivateRoute roles={['mentor']}><MentorSessions /></PrivateRoute>} />
          <Route path="/mentor/profile"   element={<PrivateRoute roles={['mentor']}><MentorProfile /></PrivateRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/users"     element={<PrivateRoute roles={['admin']}><AdminUsers /></PrivateRoute>} />
          <Route path="/admin/matching"  element={<PrivateRoute roles={['admin']}><AdminMatching /></PrivateRoute>} />
          <Route path="/admin/sessions"  element={<PrivateRoute roles={['admin']}><AdminSessions /></PrivateRoute>} />
          <Route path="/admin/modules"   element={<PrivateRoute roles={['admin']}><AdminModules /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
