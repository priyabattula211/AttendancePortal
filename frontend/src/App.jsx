import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

const roleMatches = (user, expectedRole) => {
  if (!expectedRole) return true;
  const role = String(user?.role || 'student').toLowerCase();
  return expectedRole === 'admin' ? role === 'admin' || role === 'administrator' : role === expectedRole;
};

const PrivateRoute = ({ children, expectedRole }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  if (!user) return <Navigate to={expectedRole === 'admin' ? '/admin-login' : '/student-login'} replace />;
  return roleMatches(user, expectedRole) ? children : <Navigate to={String(user.role).toLowerCase() === 'admin' ? '/admin-portal' : '/student-portal'} replace />;
};

function AppRoutes() {
  const location = useLocation();
  const isDashboard = ['/dashboard', '/student-portal', '/admin-portal'].includes(location.pathname);
  const isHome = location.pathname === '/';

  return (
    <>
      <div className="flex flex-col min-h-screen font-sans">
        {!isDashboard && !isHome && <Navbar />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Navigate to="/student-login" replace />} />
            <Route path="/student-login" element={<Login portal="student" />} />
            <Route path="/admin-login" element={<Login portal="admin" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-register" element={<Register portal="admin" />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/student-portal" element={<PrivateRoute expectedRole="student"><Dashboard /></PrivateRoute>} />
            <Route path="/admin-portal" element={<PrivateRoute expectedRole="admin"><Dashboard /></PrivateRoute>} />
          </Routes>
        </main>
        {!isDashboard && !isHome && <footer className="bg-slate-900 text-slate-400 py-8 text-center border-t border-slate-800 mt-auto">
          <p>© {new Date().getFullYear()} VIT MITRA. Learn. Innovate. Build. Advance.</p>
        </footer>}
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
