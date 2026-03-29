import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const ROLES = [
  { key:'donor',       label:'Donor',           icon:'💛', desc:'Support our cause' },
  { key:'mentee',      label:'Student',          icon:'🎓', desc:'Scholarship student' },
  { key:'facilitator', label:'Facilitator',      icon:'🏢', desc:'Programme coordinator' },
  { key:'alumni',      label:'Alumni',           icon:'🌟', desc:'Former Mudita scholar' },
  { key:'mentor',      label:'Mentor',           icon:'🤝', desc:'Volunteer professional' },
  { key:'admin',       label:'Admin',            icon:'⚙️', desc:'Organisation admin' },
];

const QUOTES = {
  mentor:  { text: '"A mentor is someone who allows you to see the hope inside yourself."', author: 'Oprah Winfrey' },
  mentee:  { text: '"Education is the most powerful weapon which you can use to change the world."', author: 'Nelson Mandela' },
  admin:   { text: '"Leadership is about taking care of those in your charge."', author: '' },
  default: { text: '"The two most important days in your life are the day you are born and the day you find out why."', author: 'Mark Twain' },
};

export default function LoginPage() {
  const [step, setStep]     = useState('role');
  const [role, setRole]     = useState('');
  const [form, setForm]     = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const selectRole = (r) => { setRole(r); setStep('form'); };

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}! 🎉`);
      const r = res.data.user.role;
      navigate(r==='admin' ? '/admin/dashboard' : r==='mentor' ? '/mentor/dashboard' : '/mentee/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  const q = QUOTES[role] || QUOTES.default;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex min-h-screen items-center justify-center px-4" style={{paddingTop:'88px',paddingBottom:'40px'}}>
        {step === 'role' ? (
          /* ─── Role selector ─── */
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <img
                src="https://muditaalliance.org/wp-content/uploads/2025/02/Mudita-logo.jpg"
                alt="Mudita"
                className="h-16 w-16 rounded-full mx-auto mb-4 shadow-md object-contain border border-gray-100"
                onError={e=>{e.target.src='https://ui-avatars.com/api/?name=M&background=3730a3&color=fff&size=64';}}
              />
              <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily:'Fraunces,serif'}}>Welcome Back</h1>
              <p className="text-gray-500 mt-2">Select your role to continue to MentorLink</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {ROLES.map(r => (
                <button key={r.key} onClick={() => selectRole(r.key)}
                  className="bg-white border-2 border-gray-100 hover:border-indigo-400 rounded-2xl p-5 text-center transition-all hover:shadow-md hover:-translate-y-0.5 group">
                  <div className="text-3xl mb-2">{r.icon}</div>
                  <p className="font-bold text-gray-800 text-sm group-hover:text-indigo-700 transition">{r.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              New here?{' '}
              <Link to="/register" className="text-indigo-700 font-semibold hover:underline">Create an account</Link>
            </p>
          </div>
        ) : (
          /* ─── Login form ─── */
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden flex">
            {/* Left panel */}
            <div className="hidden sm:flex flex-col justify-end w-64 flex-shrink-0 p-8 text-white"
              style={{background:'linear-gradient(160deg,#1e1b4b 0%,#3730a3 100%)'}}>
              <div className="text-4xl mb-4">{ROLES.find(r=>r.key===role)?.icon}</div>
              <p className="text-sm text-indigo-200 italic leading-relaxed mb-4">
                {q.text}
              </p>
              {q.author && <p className="text-xs text-indigo-300 font-semibold">— {q.author}</p>}
              <div className="mt-8 pt-6 border-t border-white/10">
                <img
                  src="https://muditaalliance.org/wp-content/uploads/2025/02/Mudita-Footer-logo.webp"
                  alt="Mudita"
                  className="h-8 object-contain opacity-80"
                  onError={e=>{e.target.style.display='none';}}
                />
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 p-8 lg:p-10">
              <button onClick={() => setStep('role')}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-6 transition">
                ← Change role
              </button>
              <h2 className="text-2xl font-bold text-amber-500 mb-1" style={{fontFamily:'Fraunces,serif'}}>
                {ROLES.find(r=>r.key===role)?.label} Login
              </h2>
              <p className="text-gray-400 text-sm mb-8">Sign in to your MentorLink account</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input type="email" required value={form.email}
                    onChange={e => setForm({...form,email:e.target.value})}
                    className="form-input" placeholder="you@email.com" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">Password</label>
                    <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} required value={form.password}
                      onChange={e => setForm({...form,password:e.target.value})}
                      className="form-input pr-12" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                      {showPass ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="btn-indigo w-full text-center py-3.5 text-base disabled:opacity-60">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-amber-500 font-semibold hover:underline">Register here</Link>
              </p>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">
                  Mudita Mentoring Programme · mentoring@muditaalliance.org
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
