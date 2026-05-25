import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import API from '../utils/api';

const FREQ_OPTIONS = [
  { value: 'once_daily', label: '1x Daily', times: 1 },
  { value: 'twice_daily', label: '2x Daily', times: 2 },
  { value: 'three_times_daily', label: '3x Daily', times: 3 },
  { value: 'four_times_daily', label: '4x Daily', times: 4 },
  { value: 'weekly', label: 'Weekly', times: 1 },
  { value: 'as_needed', label: 'As Needed', times: 0 },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const defaultForm = {
  medication: '', frequency: 'once_daily', times: ['08:00'],
  daysOfWeek: [], withFood: false, reminderMinutesBefore: 15
};

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([fetchSchedules(), fetchMeds()]).finally(() => setLoading(false));
  }, []);

  const fetchSchedules = async () => {
    const res = await API.get('/schedules');
    setSchedules(res.data);
    setTimeout(() => {
      gsap.fromTo('.sched-card', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.07 });
    }, 50);
  };

  const fetchMeds = async () => {
    const res = await API.get('/medications');
    setMeds(res.data.filter(m => m.isActive));
  };

  const openAdd = () => { setEditing(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (s) => {
    setEditing(s._id);
    setForm({ medication: s.medication?._id || '', frequency: s.frequency, times: s.times, daysOfWeek: s.daysOfWeek || [], withFood: s.withFood, reminderMinutesBefore: s.reminderMinutesBefore });
    setShowModal(true);
  };

  const updateTimes = (freq) => {
    const opt = FREQ_OPTIONS.find(o => o.value === freq);
    if (!opt || opt.times === 0) { setForm(f => ({...f, frequency: freq, times: []})); return; }
    const defaults = ['08:00','13:00','18:00','22:00'].slice(0, opt.times);
    setForm(f => ({...f, frequency: freq, times: defaults}));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.medication) return toast.error('Please select a medication');
    setSaving(true);
    try {
      if (editing) {
        await API.put(`/schedules/${editing}`, form);
        toast.success('Schedule updated! ⏰');
      } else {
        await API.post('/schedules', form);
        toast.success('Schedule created! ⏰');
      }
      setShowModal(false);
      fetchSchedules();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this schedule?')) return;
    try {
      await API.delete(`/schedules/${id}`);
      toast.success('Schedule deleted');
      fetchSchedules();
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="loading loading-dots loading-lg text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-base-content">⏰ Schedules</h1>
          <p className="text-base-content/40 text-sm mt-1">Set when and how often to take each medication</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary gap-2" disabled={!meds.length}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Schedule
        </button>
      </div>

      {!meds.length && (
        <div className="alert alert-info rounded-2xl">
          <span>ℹ️</span>
          <span>Add medications first before creating schedules.</span>
        </div>
      )}

      {!schedules.length && meds.length > 0 && (
        <div className="glass rounded-2xl p-16 text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="font-display font-bold text-xl mb-2">No schedules yet</h2>
          <p className="text-base-content/40 mb-6">Create a schedule to get reminders for your medications.</p>
          <button onClick={openAdd} className="btn btn-primary">Create First Schedule</button>
        </div>
      )}

      <div className="space-y-4">
        {schedules.map(s => (
          <div key={s._id} className="sched-card glass rounded-2xl p-5 hover:border-primary/20 transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">💊</span>
                  <h3 className="font-display font-bold text-base-content">{s.medication?.name || 'Unknown'}</h3>
                  <span className="badge badge-primary badge-sm">{s.medication?.dosage}</span>
                  <span className={`badge badge-sm ${s.isActive ? 'badge-success' : 'badge-ghost'}`}>{s.isActive ? 'active' : 'paused'}</span>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-base-content/60 mt-2">
                  <span>🔄 {FREQ_OPTIONS.find(o => o.value === s.frequency)?.label || s.frequency}</span>
                  {s.times?.length > 0 && <span>🕐 {s.times.join(', ')}</span>}
                  {s.withFood && <span>🍽️ With food</span>}
                  <span>🔔 {s.reminderMinutesBefore} min before</span>
                </div>

                {s.frequency === 'weekly' && s.daysOfWeek?.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {DAYS.map((d, i) => (
                      <span key={i} className={`w-7 h-7 rounded-full text-xs flex items-center justify-center font-medium ${s.daysOfWeek.includes(i) ? 'bg-primary text-white' : 'bg-base-300 text-base-content/40'}`}>{d[0]}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button onClick={() => openEdit(s)} className="btn btn-outline btn-xs">✏️</button>
                <button onClick={() => handleDelete(s._id)} className="btn btn-error btn-outline btn-xs">🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl">{editing ? '✏️ Edit Schedule' : '⏰ New Schedule'}</h2>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-sm btn-circle">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Medication *</span></label>
                <select className="select select-bordered bg-base-200/50 w-full"
                  value={form.medication} onChange={e => setForm({...form, medication: e.target.value})}>
                  <option value="">Select a medication...</option>
                  {meds.map(m => <option key={m._id} value={m._id}>{m.name} ({m.dosage})</option>)}
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Frequency *</span></label>
                <select className="select select-bordered bg-base-200/50 w-full"
                  value={form.frequency} onChange={e => updateTimes(e.target.value)}>
                  {FREQ_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {form.times.length > 0 && (
                <div className="form-control">
                  <label className="label"><span className="label-text">Times</span></label>
                  <div className="space-y-2">
                    {form.times.map((t, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-sm text-base-content/50 w-16">Dose {i+1}</span>
                        <input type="time" className="input input-bordered bg-base-200/50 flex-1"
                          value={t} onChange={e => {
                            const arr = [...form.times]; arr[i] = e.target.value;
                            setForm({...form, times: arr});
                          }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {form.frequency === 'weekly' && (
                <div className="form-control">
                  <label className="label"><span className="label-text">Days of week</span></label>
                  <div className="flex gap-2">
                    {DAYS.map((d, i) => (
                      <button type="button" key={i}
                        className={`w-9 h-9 rounded-full text-xs font-medium transition-all ${form.daysOfWeek.includes(i) ? 'bg-primary text-white' : 'bg-base-300 text-base-content/50'}`}
                        onClick={() => {
                          const days = form.daysOfWeek.includes(i) ? form.daysOfWeek.filter(x => x !== i) : [...form.daysOfWeek, i];
                          setForm({...form, daysOfWeek: days});
                        }}>{d}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" id="withFood"
                  checked={form.withFood} onChange={e => setForm({...form, withFood: e.target.checked})} />
                <label htmlFor="withFood" className="label-text cursor-pointer">🍽️ Take with food</label>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">🔔 Remind me (minutes before)</span></label>
                <select className="select select-bordered bg-base-200/50 w-full"
                  value={form.reminderMinutesBefore} onChange={e => setForm({...form, reminderMinutesBefore: Number(e.target.value)})}>
                  {[5,10,15,20,30,60].map(m => <option key={m} value={m}>{m} minutes</option>)}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost flex-1">Cancel</button>
                <button type="submit" className={`btn btn-primary flex-1 ${saving ? 'loading' : ''}`} disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
