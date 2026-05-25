import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../utils/api';

const COLORS = { taken: '#10b981', missed: '#ef4444', skipped: '#f59e0b', pending: '#6b7280' };

export default function History() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [days]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);
      const [logsRes, statsRes] = await Promise.all([
        API.get(`/logs?startDate=${since.toISOString()}`),
        API.get(`/logs/stats?days=${days}`)
      ]);
      setLogs(logsRes.data);
      setStats(statsRes.data);
      setTimeout(() => {
        gsap.fromTo('.log-item', { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.04 });
      }, 50);
    } catch { toast.error('Failed to load history'); }
    finally { setLoading(false); }
  };

  const pieData = stats ? [
    { name: 'Taken', value: stats.taken, color: COLORS.taken },
    { name: 'Missed', value: stats.missed, color: COLORS.missed },
    { name: 'Pending', value: stats.total - stats.taken - stats.missed, color: COLORS.pending },
  ].filter(d => d.value > 0) : [];

  // Group logs by date for bar chart
  const barData = (() => {
    const map = {};
    logs.forEach(log => {
      const date = new Date(log.scheduledTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      if (!map[date]) map[date] = { date, taken: 0, missed: 0 };
      if (log.status === 'taken') map[date].taken++;
      else if (log.status === 'missed') map[date].missed++;
    });
    return Object.values(map).slice(-7);
  })();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-3xl text-base-content">📊 Dose History</h1>
          <p className="text-base-content/40 text-sm mt-1">Track your medication adherence over time</p>
        </div>
        <div className="join">
          {[7, 14, 30].map(d => (
            <button key={d} className={`join-item btn btn-sm ${days === d ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setDays(d)}>{d}D</button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-4 text-center">
            <div className="font-display text-3xl font-bold text-primary">{stats.adherenceRate}%</div>
            <div className="text-xs text-base-content/50 mt-1">Adherence Rate</div>
            <div className="w-full bg-base-300 rounded-full h-1.5 mt-2">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${stats.adherenceRate}%` }} />
            </div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="font-display text-3xl font-bold text-success">{stats.taken}</div>
            <div className="text-xs text-base-content/50 mt-1">Doses Taken</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="font-display text-3xl font-bold text-error">{stats.missed}</div>
            <div className="text-xs text-base-content/50 mt-1">Doses Missed</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="font-display text-3xl font-bold text-base-content">{stats.total}</div>
            <div className="text-xs text-base-content/50 mt-1">Total Doses</div>
          </div>
        </div>
      )}

      {/* Charts */}
      {stats && stats.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold text-base-content mb-4">Dose Breakdown</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-1 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-base-content/60">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold text-base-content mb-4">Daily Trend</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData}>
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#e2e8f0' }} />
                <Bar dataKey="taken" fill="#10b981" radius={[4,4,0,0]} name="Taken" />
                <Bar dataKey="missed" fill="#ef4444" radius={[4,4,0,0]} name="Missed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Log list */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display font-semibold text-base-content mb-4">Dose Log</h3>
        {loading ? (
          <div className="flex justify-center py-10"><div className="loading loading-dots loading-md text-primary" /></div>
        ) : !logs.length ? (
          <div className="text-center py-10 text-base-content/40">
            <div className="text-4xl mb-3">📋</div>
            <p>No logs for this period</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {logs.map(log => (
              <div key={log._id} className="log-item flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-base-300/30 transition-colors">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0`} style={{ background: COLORS[log.status] }} />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm text-base-content">{log.medication?.name}</span>
                  <span className="text-xs text-base-content/40 ml-2">{log.medication?.dosage}</span>
                </div>
                <div className="text-xs text-base-content/40 text-right">
                  <div>{new Date(log.scheduledTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</div>
                  <div>{new Date(log.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <span className={`badge badge-sm ${
                  log.status === 'taken' ? 'badge-success' :
                  log.status === 'missed' ? 'badge-error' :
                  log.status === 'skipped' ? 'badge-warning' : 'badge-ghost'
                }`}>{log.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
