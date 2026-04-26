import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Layout
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ScrollToTop from './components/Layout/ScrollToTop';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VerifyOTP from './pages/Auth/VerifyOTP';
import Companies from './pages/Companies';
import CandidateDashboard from './pages/Candidate/Dashboard';
import CandidateProfile from './pages/Candidate/Profile';
import JobSearch from './pages/Candidate/JobSearch';
import JobDetails from './pages/Candidate/JobDetails';
import RecruiterDashboard from './pages/Recruiter/Dashboard';
import PostJob from './pages/Recruiter/PostJob';
import MyJobs from './pages/Recruiter/MyJobs';
import Applicants from './pages/Recruiter/Applicants';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminJobs from './pages/Admin/Jobs';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Helper function to get dashboard route based on user role
const getDashboardRoute = (user) => {
  if (!user) return '/';
  switch (user.role) {
    case 'candidate':
      return '/candidate/dashboard';
    case 'recruiter':
      return '/recruiter/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/';
  }
};

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <ScrollToTop />
      <Navbar />
      <main className="container mx-auto px-4 py-8 relative">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to={getDashboardRoute(user)} /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to={getDashboardRoute(user)} /> : <Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/jobs" element={<JobSearch />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies" element={<Companies />} />

          {/* Candidate Routes */}
          <Route
            path="/candidate/dashboard"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/profile"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <CandidateProfile />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/post-job"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/my-jobs"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <MyJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/applicants/:jobId"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <Applicants />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminJobs />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
