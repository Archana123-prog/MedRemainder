import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const CONDITIONS = ['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis', 'Depression', 'Anxiety', 'Thyroid', 'Kidney Disease', 'Cancer'];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: '', age: '', phone: '', conditions: [], reminderMethod: 'email', emergencyContact: { name: '', phone: '', relation: '' } });
  const [saving, setSaving] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '', age: user.age || '', phone: user.phone || '',
        conditions: user.conditions || [], reminderMethod: user.reminderMethod || 'email',
        emergencyContact: user.emergencyContact || { name: '', phone: '', relation: '' }
      });
    }
    gsap.fromTo(pageRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
  }, [user]);

  const toggleCondition = (c) => {
    setForm(f => ({
      ...f,
      conditions: f.conditions.includes(c) ? f.conditions.filter(x => x !== c) : [...f.conditions, c]
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Name is required');
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  return (
    <div ref={pageRef} className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl text-base-content">👤 Profile & Settings</h1>
        <p className="text-base-content/40 text-sm mt-1">Manage your personal info and preferences</p>
      </div>

      {/* Avatar */}
      <div className="glass rounded-2xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-display font-bold text-lg text-base-content">{user?.name}</p>
          <p className="text-base-content/50 text-sm">{user?.email}</p>
          <p className="text-xs text-base-content/30 mt-1">Member since {new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Personal Info */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-base-content">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">👤 Full Name *</span></label>
              <input className="input input-bordered bg-base-200/50 w-full"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">🎂 Age</span></label>
              <input type="number" className="input input-bordered bg-base-200/50 w-full"
                value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
            </div>
            <div className="form-control md:col-span-2">
              <label className="label"><span className="label-text">📱 Phone Number</span></label>
              <input type="tel" className="input input-bordered bg-base-200/50 w-full"
                value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Medical Conditions */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-base-content">🩺 Medical Conditions</h2>
          <p className="text-xs text-base-content/40">Select all that apply — helps personalize your experience</p>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map(c => (
              <button type="button" key={c}
                className={`btn btn-sm rounded-full transition-all ${form.conditions.includes(c) ? 'btn-primary' : 'btn-outline btn-ghost'}`}
                onClick={() => toggleCondition(c)}>{c}</button>
            ))}
          </div>
        </div>

        {/* Reminder Preferences */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-base-content">🔔 Reminder Preferences</h2>
          <div className="form-control">
            <label className="label"><span className="label-text">Receive reminders via</span></label>
            <select className="select select-bordered bg-base-200/50 w-full"
              value={form.reminderMethod} onChange={e => setForm({...form, reminderMethod: e.target.value})}>
              <option value="email">📧 Email only</option>
              <option value="sms">📱 SMS only</option>
              <option value="both">Both Email & SMS</option>
              <option value="none">No reminders</option>
            </select>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-base-content">🆘 Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="form-control">
              <label className="label"><span className="label-text">Name</span></label>
              <input className="input input-bordered bg-base-200/50 w-full" placeholder="Contact name"
                value={form.emergencyContact.name} onChange={e => setForm({...form, emergencyContact: {...form.emergencyContact, name: e.target.value}})} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Phone</span></label>
              <input type="tel" className="input input-bordered bg-base-200/50 w-full" placeholder="Phone number"
                value={form.emergencyContact.phone} onChange={e => setForm({...form, emergencyContact: {...form.emergencyContact, phone: e.target.value}})} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Relation</span></label>
              <input className="input input-bordered bg-base-200/50 w-full" placeholder="e.g. Spouse"
                value={form.emergencyContact.relation} onChange={e => setForm({...form, emergencyContact: {...form.emergencyContact, relation: e.target.value}})} />
            </div>
          </div>
        </div>

        <button type="submit" className={`btn btn-primary w-full ${saving ? 'loading' : ''}`} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save Changes'}
        </button>
      </form>
    </div>
  );
}
