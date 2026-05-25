import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

export default function Landing() {
  const heroRef = useRef(null);
  const pillRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo('.hero-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' });
      gsap.fromTo('.hero-sub', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: 'power3.out' });
      gsap.fromTo('.hero-cta', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: 'power3.out' });

      // Floating pills
      gsap.to('.float-pill', { y: -20, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.4 });

      // Big pill spin
      gsap.to(pillRef.current, { rotation: 360, duration: 20, repeat: -1, ease: 'none' });

      // Features stagger
      gsap.fromTo('.feature-card',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, delay: 0.8, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, []);

  const features = [
    { icon: '💊', title: 'Smart Pill Tracking', desc: 'Track every medication with dosage, form, and refill dates all in one place.' },
    { icon: '⏰', title: 'Flexible Schedules', desc: 'Set once-daily, multiple-times, or weekly reminders customized to each medication.' },
    { icon: '📧', title: 'Email Reminders', desc: 'Get timely email notifications before each dose so you never miss a pill.' },
    { icon: '📊', title: 'Adherence Analytics', desc: 'See your 7-day and 30-day adherence rate with beautiful charts and insights.' },
    { icon: '⚠️', title: 'Low Pill Alerts', desc: 'Get warned when you\'re running low on a medication so you can refill in time.' },
    { icon: '👨‍⚕️', title: 'Doctor & Pharmacy Info', desc: 'Store your prescriber and pharmacy details alongside each medication.' },
  ];

  return (
    <div className="min-h-screen bg-base-100 overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💊</span>
          <span className="font-display font-bold text-xl text-base-content">MedRemind</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="btn btn-ghost btn-sm text-base-content/70">Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        {/* Floating pills decoration */}
        <div className="absolute inset-0 pointer-events-none">
          {['💊', '🔵', '💙', '🟣', '⬜'].map((p, i) => (
            <span key={i} className={`float-pill absolute text-2xl opacity-20 select-none`}
              style={{ top: `${10 + i * 15}%`, left: `${5 + i * 18}%` }}>{p}</span>
          ))}
        </div>

        {/* Big animated pill */}
        <div ref={pillRef} className="w-20 h-20 mx-auto mb-8 text-6xl filter drop-shadow-2xl">💊</div>

        <h1 className="hero-title font-display text-5xl md:text-7xl font-extrabold text-base-content mb-6 leading-tight">
          Never miss a<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">dose again.</span>
        </h1>
        <p className="hero-sub text-lg md:text-xl text-base-content/60 max-w-2xl mx-auto mb-10 font-body">
          MedRemind helps patients with complex prescriptions manage, track, and remember every medication — with smart schedules, email reminders, and adherence insights.
        </p>
        <div className="hero-cta flex flex-wrap gap-4 justify-center">
          <Link to="/register" className="btn btn-primary btn-lg gap-2 pill-glow">
            Start Managing Meds Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg">Already have an account</Link>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-base-content/40">
          <span>✅ Free to use</span>
          <span>•</span>
          <span>🔒 Secure & private</span>
          <span>•</span>
          <span>📱 Works on any device</span>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-base-content mb-4">
          Everything you need to stay healthy
        </h2>
        <p className="text-center text-base-content/50 mb-12 max-w-xl mx-auto">
          Built for patients with complex, multi-medication prescriptions who need more than just basic reminders.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="feature-card glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 cursor-default group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-display font-semibold text-lg text-base-content mb-2">{f.title}</h3>
              <p className="text-base-content/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="glass rounded-3xl p-10 text-center border border-primary/20 pill-glow">
          <div className="text-4xl mb-4">💊</div>
          <h2 className="font-display text-3xl font-bold text-base-content mb-3">Ready to take control?</h2>
          <p className="text-base-content/60 mb-6">Join thousands of patients managing their medications smarter.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
        </div>
      </section>

      <footer className="text-center py-8 text-base-content/30 text-sm">
        © 2025 MedRemind. Built with ❤️ for patient health.
      </footer>
    </div>
  );
}
