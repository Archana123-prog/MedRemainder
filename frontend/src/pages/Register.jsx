import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Name, email and password are required');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to MedRemind 💊');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
      </div>

      <div ref={cardRef} className="glass rounded-3xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl block mb-4">💊</Link>
          <h1 className="font-display font-bold text-2xl text-base-content">Create your account</h1>
          <p className="text-base-content/50 text-sm mt-1">Free forever. No credit card required.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text text-base-content/70">👤 Full Name *</span></label>
            <input type="text" placeholder="John Doe"
              className="input input-bordered bg-base-200/50 focus:input-primary w-full"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text text-base-content/70">📧 Email address *</span></label>
            <input type="email" placeholder="you@example.com"
              className="input input-bordered bg-base-200/50 focus:input-primary w-full"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label"><span className="label-text text-base-content/70">🎂 Age</span></label>
              <input type="number" placeholder="25"
                className="input input-bordered bg-base-200/50 w-full"
                value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text text-base-content/70">📱 Phone</span></label>
              <input type="tel" placeholder="+91 9999..."
                className="input input-bordered bg-base-200/50 w-full"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text text-base-content/70">🔒 Password *</span></label>
            <input type="password" placeholder="Minimum 6 characters"
              className="input input-bordered bg-base-200/50 focus:input-primary w-full"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>

          <button type="submit" className={`btn btn-primary w-full mt-2 ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? 'Creating account...' : '🎉 Create Account'}
          </button>
        </form>

        <div className="divider text-base-content/30 text-xs">ALREADY HAVE AN ACCOUNT?</div>
        <Link to="/login" className="btn btn-outline w-full">Sign In</Link>
      </div>
    </div>
  );
}
