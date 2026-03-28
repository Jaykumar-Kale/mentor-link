import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true); toast.success('Reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending email');
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">🔒</div>
            <h2 className="text-2xl font-bold text-indigo-800">Forgot Password?</h2>
            <p className="text-sm text-gray-500 mt-1">Enter your email to receive a reset link</p>
          </div>
          {sent ? (
            <div className="text-center">
              <div className="text-5xl mb-3">📧</div>
              <p className="text-green-600 font-semibold">Reset email sent!</p>
              <p className="text-sm text-gray-500 mt-2">Check your inbox and click the reset link. It expires in 10 minutes.</p>
              <Link to="/login" className="inline-block mt-4 text-amber-500 hover:underline font-semibold text-sm">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 rounded transition disabled:opacity-60">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <p className="text-center text-sm"><Link to="/login" className="text-gray-400 hover:text-gray-600">← Back to Login</Link></p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function ResetPassword() {
  const { token } = useParams();
  const navigate  = useNavigate();
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.');
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">🔑</div>
            <h2 className="text-2xl font-bold text-indigo-800">Reset Password</h2>
            <p className="text-sm text-gray-500 mt-1">Enter your new password</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">New Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Confirm Password</label>
              <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 rounded transition disabled:opacity-60">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
