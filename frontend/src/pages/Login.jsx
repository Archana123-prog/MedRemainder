import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current, { y: 40, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 💊');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div ref={cardRef} className="glass rounded-3xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl block mb-4">💊</Link>
          <h1 className="font-display font-bold text-2xl text-base-content">Welcome back</h1>
          <p className="text-base-content/50 text-sm mt-1">Sign in to your MedRemind account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text text-base-content/70">📧 Email address</span></label>
            <input type="email" placeholder="you@example.com"
              className="input input-bordered bg-base-200/50 focus:input-primary w-full"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text text-base-content/70">🔒 Password</span></label>
            <input type="password" placeholder="Your password"
              className="input input-bordered bg-base-200/50 focus:input-primary w-full"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>

          <button type="submit" className={`btn btn-primary w-full mt-2 ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? 'Signing in...' : '🚀 Sign In'}
          </button>
        </form>

        <div className="divider text-base-content/30 text-xs">NEW TO MEDREMIND?</div>
        <Link to="/register" className="btn btn-outline w-full">Create Free Account</Link>

        <p className="text-center text-xs text-base-content/30 mt-4">
          Your medical data is encrypted and private.
        </p>
      </div>
    </div>
  );
}
