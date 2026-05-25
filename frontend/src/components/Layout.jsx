import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard', desc: 'Overview & today' },
  { path: '/medications', icon: '💊', label: 'Medications', desc: 'Manage prescriptions' },
  { path: '/schedules', icon: '⏰', label: 'Schedules', desc: 'Set reminders' },
  { path: '/history', icon: '📊', label: 'History', desc: 'Track adherence' },
  { path: '/profile', icon: '👤', label: 'Profile', desc: 'Your settings' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(sidebarRef.current,
      { x: -80, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out safely 👋');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-base-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside ref={sidebarRef}
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 glass border-r border-primary/10 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Logo */}
        <div className="p-6 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xl pill-glow">💊</div>
            <div>
              <h1 className="font-display font-bold text-lg text-base-content">MedRemind</h1>
              <p className="text-xs text-base-content/40">Smart Prescription Manager</p>
            </div>
          </div>
        </div>

        {/* User greeting */}
        <div className="px-4 py-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="w-9 rounded-full bg-primary/30 text-primary-content">
                <span className="text-sm font-bold">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-xs text-base-content/40 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/20 pill-glow'
                    : 'text-base-content/60 hover:bg-base-300/50 hover:text-base-content'
                }`
              }>
              <span className="text-xl w-8 text-center">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs opacity-60">{item.desc}</p>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-base-300">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-error/70 hover:bg-error/10 hover:text-error transition-all duration-200">
            <span className="text-xl w-8 text-center">🚪</span>
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden sticky top-0 z-10 glass border-b border-base-300 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="btn btn-ghost btn-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-display font-bold text-primary">💊 MedRemind</span>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
