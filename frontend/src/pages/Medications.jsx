import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import API from '../utils/api';

const MED_FORMS = ['tablet', 'capsule', 'liquid', 'injection', 'patch', 'inhaler', 'drops', 'other'];
const MED_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'];

const defaultForm = {
  name: '', genericName: '', dosage: '', form: 'tablet', color: '#6366f1',
  instructions: '', prescribedBy: '', pharmacy: '', totalPills: '', pillsRemaining: '',
  refillDate: '', endDate: '', notes: '', isActive: true
};

export default function Medications() {
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const listRef = useRef(null);

  useEffect(() => { fetchMeds(); }, []);

  const fetchMeds = async () => {
    try {
      const res = await API.get('/medications');
      setMeds(res.data);
      setTimeout(() => {
        gsap.fromTo('.med-card', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power3.out' });
      }, 50);
    } catch { toast.error('Failed to load medications'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (med) => { setEditing(med._id); setForm({ ...med, refillDate: med.refillDate?.slice(0,10) || '', endDate: med.endDate?.slice(0,10) || '' }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.dosage) return toast.error('Name and dosage are required');
    setSaving(true);
    try {
      if (editing) {
        await API.put(`/medications/${editing}`, form);
        toast.success('Medication updated! ✅');
      } else {
        await API.post('/medications', form);
        toast.success('Medication added! 💊');
      }
      setShowModal(false);
      fetchMeds();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/medications/${id}`);
      toast.success(`${name} removed`);
      fetchMeds();
    } catch { toast.error('Delete failed'); }
  };

  const toggleActive = async (med) => {
    try {
      await API.put(`/medications/${med._id}`, { isActive: !med.isActive });
      toast.success(med.isActive ? 'Medication paused' : 'Medication activated');
      fetchMeds();
    } catch { toast.error('Update failed'); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="loading loading-dots loading-lg text-primary" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-base-content">💊 My Medications</h1>
          <p className="text-base-content/40 text-sm mt-1">{meds.length} medication{meds.length !== 1 ? 's' : ''} tracked</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Medication
        </button>
      </div>

      {/* Empty state */}
      {!meds.length && (
        <div className="glass rounded-2xl p-16 text-center">
          <div className="text-6xl mb-4">💊</div>
          <h2 className="font-display font-bold text-xl text-base-content mb-2">No medications yet</h2>
          <p className="text-base-content/40 mb-6">Add your first medication to get started with tracking.</p>
          <button onClick={openAdd} className="btn btn-primary">Add First Medication</button>
        </div>
      )}

      {/* Medications grid */}
      <div ref={listRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meds.map(med => (
          <div key={med._id} className="med-card glass rounded-2xl p-5 hover:border-primary/20 transition-all duration-300">
            <div className="flex items-start gap-3 mb-3">
              {/* Color dot */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 mt-0.5"
                style={{ background: `${med.color}22`, border: `2px solid ${med.color}44` }}>
                {med.form === 'liquid' ? '🧴' : med.form === 'injection' ? '💉' : med.form === 'inhaler' ? '🫁' : '💊'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base-content truncate">{med.name}</h3>
                  <span className={`badge badge-sm ${med.isActive ? 'badge-success' : 'badge-ghost'}`}>
                    {med.isActive ? 'active' : 'paused'}
                  </span>
                </div>
                {med.genericName && <p className="text-xs text-base-content/40">{med.genericName}</p>}
                <p className="text-sm text-primary font-semibold mt-1">{med.dosage} • {med.form}</p>
              </div>
            </div>

            {med.instructions && (
              <p className="text-xs text-base-content/50 bg-base-300/30 rounded-lg px-3 py-2 mb-3">
                ℹ️ {med.instructions}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs text-base-content/40 mb-4">
              {med.prescribedBy && <span>👨‍⚕️ Dr. {med.prescribedBy}</span>}
              {med.pharmacy && <span>🏥 {med.pharmacy}</span>}
              {med.pillsRemaining != null && <span className={med.pillsRemaining < 5 ? 'text-error' : ''}>💊 {med.pillsRemaining} pills left</span>}
              {med.refillDate && <span>📅 Refill: {new Date(med.refillDate).toLocaleDateString()}</span>}
            </div>

            <div className="flex gap-2">
              <button onClick={() => openEdit(med)} className="btn btn-outline btn-xs flex-1">✏️ Edit</button>
              <button onClick={() => toggleActive(med)} className={`btn btn-xs flex-1 ${med.isActive ? 'btn-warning' : 'btn-success'}`}>
                {med.isActive ? '⏸ Pause' : '▶️ Activate'}
              </button>
              <button onClick={() => handleDelete(med._id, med.name)} className="btn btn-error btn-xs btn-outline">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl">{editing ? '✏️ Edit Medication' : '➕ Add Medication'}</h2>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-sm btn-circle">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="form-control col-span-2">
                  <label className="label"><span className="label-text">Medication Name *</span></label>
                  <input className="input input-bordered bg-base-200/50 w-full" placeholder="e.g. Metformin"
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Generic Name</span></label>
                  <input className="input input-bordered bg-base-200/50 w-full" placeholder="Generic name"
                    value={form.genericName} onChange={e => setForm({...form, genericName: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Dosage *</span></label>
                  <input className="input input-bordered bg-base-200/50 w-full" placeholder="e.g. 500mg"
                    value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Form</span></label>
                  <select className="select select-bordered bg-base-200/50 w-full"
                    value={form.form} onChange={e => setForm({...form, form: e.target.value})}>
                    {MED_FORMS.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Color Tag</span></label>
                  <div className="flex gap-2 flex-wrap pt-1">
                    {MED_COLORS.map(c => (
                      <button type="button" key={c}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${form.color === c ? 'scale-125 border-white' : 'border-transparent'}`}
                        style={{ background: c }} onClick={() => setForm({...form, color: c})} />
                    ))}
                  </div>
                </div>
                <div className="form-control col-span-2">
                  <label className="label"><span className="label-text">Instructions</span></label>
                  <input className="input input-bordered bg-base-200/50 w-full" placeholder="e.g. Take with food, avoid alcohol"
                    value={form.instructions} onChange={e => setForm({...form, instructions: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Doctor's Name</span></label>
                  <input className="input input-bordered bg-base-200/50 w-full" placeholder="Dr. Name"
                    value={form.prescribedBy} onChange={e => setForm({...form, prescribedBy: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Pharmacy</span></label>
                  <input className="input input-bordered bg-base-200/50 w-full" placeholder="Pharmacy name"
                    value={form.pharmacy} onChange={e => setForm({...form, pharmacy: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Total Pills</span></label>
                  <input type="number" className="input input-bordered bg-base-200/50 w-full" placeholder="30"
                    value={form.totalPills} onChange={e => setForm({...form, totalPills: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Pills Remaining</span></label>
                  <input type="number" className="input input-bordered bg-base-200/50 w-full" placeholder="30"
                    value={form.pillsRemaining} onChange={e => setForm({...form, pillsRemaining: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Refill Date</span></label>
                  <input type="date" className="input input-bordered bg-base-200/50 w-full"
                    value={form.refillDate} onChange={e => setForm({...form, refillDate: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">End Date</span></label>
                  <input type="date" className="input input-bordered bg-base-200/50 w-full"
                    value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />
                </div>
                <div className="form-control col-span-2">
                  <label className="label"><span className="label-text">Notes</span></label>
                  <textarea className="textarea textarea-bordered bg-base-200/50 w-full" rows={2} placeholder="Any additional notes..."
                    value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost flex-1">Cancel</button>
                <button type="submit" className={`btn btn-primary flex-1 ${saving ? 'loading' : ''}`} disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Medication' : 'Add Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
