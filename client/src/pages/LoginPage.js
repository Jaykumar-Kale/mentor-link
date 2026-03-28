import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const ROLES = [
  { key: 'donor',      label: 'DONOR',            color: 'bg-amber-500 hover:bg-amber-600' },
  { key: 'mentee',     label: 'STUDENT',           color: 'bg-amber-500 hover:bg-amber-600' },
  { key: 'facilitator',label: 'FACILITATOR',       color: 'bg-amber-500 hover:bg-amber-600' },
  { key: 'alumni',     label: 'ALUMNI',            color: 'bg-amber-500 hover:bg-amber-600' },
  { key: 'mentor',     label: 'MENTOR',            color: 'bg-indigo-700 hover:bg-indigo-800' },
  { key: 'mentee',     label: 'MENTEE (STUDENT)',  color: 'bg-indigo-700 hover:bg-indigo-800' },
];

const ROLE_ICONS = {
  mentor:  { title: 'Mentor Login',   quote: '"A mentor is someone who allows you to see the hope inside yourself."', author: 'Oprah Winfrey',   bg: 'bg-gray-800' },
  mentee:  { title: 'Mentee Login',   quote: '"Education is the most powerful weapon which you can use to change the world."', author: 'Nelson Mandela', bg: 'bg-indigo-900' },
  admin:   { title: 'Admin Login',    quote: '"Leadership is not about being in charge. It\'s about taking care of those in your charge."', author: '', bg: 'bg-gray-900' },
  default: { title: 'Login',          quote: '"Together we rise."', author: '', bg: 'bg-indigo-800' },
};

export default function LoginPage() {
  const [step, setStep]     = useState('role'); // 'role' | 'form'
  const [role, setRole]     = useState('');
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const selectRole = (r) => { setRole(r); setStep('form'); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      const r = res.data.user.role;
      if (r === 'admin')  navigate('/admin/dashboard');
      else if (r === 'mentor') navigate('/mentor/dashboard');
      else navigate('/mentee/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  const info = ROLE_ICONS[role] || ROLE_ICONS.default;

  return (
    <div>
      <Navbar />

      {/* Hero with role buttons */}
      <div className="relative min-h-[92vh] flex flex-col">
        {/* Background image */}
        <div className="absolute inset-0 bg-gray-900 overflow-hidden">
          <img src="/hero-bg.jpg" alt="" className="w-full h-full object-cover opacity-40"
            onError={e => { e.target.style.display = 'none'; }} />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-12">
          {step === 'role' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-lg w-full text-center text-white">
              <h2 className="text-3xl font-bold mb-2">Login</h2>
              <p className="text-gray-300 text-sm mb-6">Select your role to continue</p>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r, i) => (
                  <button key={i} onClick={() => selectRole(r.key)}
                    className={`${r.color} text-white text-sm font-bold py-3 rounded flex items-center justify-center gap-2 transition`}>
                    → {r.label}
                  </button>
                ))}
              </div>
              <p className="mt-6 text-gray-300 text-sm">
                New user? <Link to="/register" className="text-amber-400 hover:underline font-semibold">Register here</Link>
              </p>
            </div>
          )}

          {step === 'form' && (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl flex">
              {/* Left panel */}
              <div className={`hidden sm:flex flex-col justify-end w-64 flex-shrink-0 ${info.bg} p-6 text-white`}>
                <p className="text-sm italic leading-relaxed">"{info.quote}"</p>
                {info.author && <p className="text-xs text-gray-300 mt-2">– {info.author}</p>}
              </div>
              {/* Form */}
              <div className="flex-1 p-8">
                <button onClick={() => setStep('role')} className="text-xs text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">
                  ← Back
                </button>
                <h2 className="text-2xl font-bold text-amber-500 mb-6">{info.title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-indigo-800 mb-1">Email</label>
                    <input type="email" required value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-indigo-800 mb-1">Password</label>
                    <input type="password" required value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div className="text-right">
                    <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline">Forgot password?</Link>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 rounded transition disabled:opacity-60">
                    {loading ? 'Logging in...' : 'Log In'}
                  </button>
                </form>
                <p className="mt-4 text-xs text-gray-500 text-center">
                  Don't have an account? <Link to="/register" className="text-amber-500 font-semibold hover:underline">Register</Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
