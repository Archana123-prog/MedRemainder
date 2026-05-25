import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Medications from './pages/Medications';
import Schedules from './pages/Schedules';
import History from './pages/History';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">💊</div>
        <div className="loading loading-dots loading-lg text-primary"></div>
        <p className="text-base-content/60 mt-2 font-body">Loading MedRemind...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/medications" element={<Medications />} />
            <Route path="/schedules" element={<Schedules />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
