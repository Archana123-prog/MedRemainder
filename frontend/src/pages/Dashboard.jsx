import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../utils/api';
import { useUser } from '@clerk/clerk-react';

const StatCard = ({ icon, label, value, sub, color = 'primary' }) => (
  <div className={`glass rounded-2xl p-5 border border-${color}/20 hover:border-${color}/40 transition-all duration-300 stat-card`}>
    <div className={`w-10 h-10 rounded-xl bg-${color}/15 flex items-center justify-center text-xl mb-3`}>{icon}</div>
    <div className="font-display text-3xl font-bold text-base-content">{value}</div>
    <div className="text-sm font-medium text-base-content/70 mt-1">{label}</div>
    {sub && <div className="text-xs text-base-content/40 mt-1">{sub}</div>}
  </div>
);

export default function Dashboard() {
  const { user } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo('.stat-card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' });
      gsap.fromTo('.today-item', { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, delay: 0.3 });
    }
  }, [loading]);

  const fetchDashboard = async () => {
    try {
      const res = await API.get('/dashboard');
      setData(res.data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const markDose = async (logId, status) => {
    try {
      await API.patch(`/logs/${logId}`, { status });
      toast.success(status === 'taken' ? '✅ Dose marked as taken!' : '⏭️ Dose skipped');
      fetchDashboard();
    } catch {
      toast.error('Could not update dose status');
    }
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return '🌅 Good morning';
    if (h < 17) return '☀️ Good afternoon';
    return '🌙 Good evening';
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="loading loading-dots loading-lg text-primary" />
    </div>
  );

  return (
    <div ref={pageRef} className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-base-content/50 text-sm">{getGreeting()},</p>
        <h1 className="font-display font-bold text-3xl text-base-content">{user?.fullName} 👋</h1>
        <p className="text-base-content/40 text-sm mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Low pill alerts */}
      {data?.lowPillAlerts?.length > 0 && (
        <div className="alert alert-warning rounded-2xl">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold">Low pill count!</p>
            <p className="text-sm">{data.lowPillAlerts.map(m => `${m.name} (${m.pillsRemaining} left)`).join(', ')} — Time to refill!</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="💊" label="Active Medications" value={data?.activeMeds ?? 0} sub={`of ${data?.totalMeds ?? 0} total`} color="primary" />
        <StatCard icon="✅" label="Taken Today" value={data?.takenToday ?? 0} color="success" />
        <StatCard icon="⏳" label="Pending Today" value={data?.pendingToday ?? 0} color="warning" />
        <StatCard icon="📊" label="7-Day Adherence" value={`${data?.adherence7d ?? 0}%`} sub="this week" color={data?.adherence7d >= 80 ? 'success' : 'error'} />
      </div>

      {/* Today's Schedule */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-xl text-base-content">📅 Today's Doses</h2>
          <Link to="/schedules" className="btn btn-outline btn-xs">Manage Schedules</Link>
        </div>

        {!data?.todayLogs?.length ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-semibold text-base-content">All clear for today!</p>
            <p className="text-base-content/40 text-sm mt-1">No doses scheduled yet.</p>
            <Link to="/medications" className="btn btn-primary btn-sm mt-4">Add a Medication</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {data.todayLogs.map((log) => (
              <div key={log._id} className="today-item flex items-center gap-4 p-4 rounded-xl bg-base-200/40 hover:bg-base-200/70 transition-all">
                {/* Status dot */}
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  log.status === 'taken' ? 'bg-success' :
                  log.status === 'missed' ? 'bg-error' :
                  log.status === 'skipped' ? 'bg-warning' : 'bg-base-content/30'
                }`} />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base-content truncate">{log.medication?.name}</p>
                  <p className="text-sm text-base-content/50">{log.medication?.dosage} • {new Date(log.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  {log.medication?.instructions && <p className="text-xs text-base-content/40 mt-0.5">ℹ️ {log.medication.instructions}</p>}
                </div>

                <div className="flex-shrink-0">
                  {log.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button onClick={() => markDose(log._id, 'taken')} className="btn btn-success btn-xs">✅ Taken</button>
                      <button onClick={() => markDose(log._id, 'skipped')} className="btn btn-ghost btn-xs">Skip</button>
                    </div>
                  ) : (
                    <span className={`badge ${
                      log.status === 'taken' ? 'badge-success' :
                      log.status === 'missed' ? 'badge-error' : 'badge-warning'
                    }`}>{log.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { to: '/medications', icon: '➕', label: 'Add Medication', color: 'primary' },
          { to: '/schedules', icon: '⏰', label: 'Set Schedule', color: 'secondary' },
          { to: '/history', icon: '📊', label: 'View History', color: 'accent' },
          { to: '/profile', icon: '⚙️', label: 'Settings', color: 'neutral' },
        ].map(a => (
          <Link key={a.to} to={a.to}
            className="glass rounded-xl p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-all duration-200 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">{a.icon}</span>
            <span className="text-xs font-medium text-base-content/70 text-center">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
