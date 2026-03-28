import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/'); };

  const dashLink = !user ? '/login'
    : user.role === 'admin'  ? '/admin/dashboard'
    : user.role === 'mentor' ? '/mentor/dashboard'
    : '/mentee/dashboard';

  const navLink = (to, label) => (
    <Link to={to}
      className={`text-sm font-semibold transition ${pathname === to ? 'text-amber-500' : 'text-gray-600 hover:text-amber-500'}`}
      onClick={() => setOpen(false)}>
      {label}
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
            <img src="/mudita-logo.jpg" alt="Mudita" className="w-full h-full object-contain" onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=M&background=3730a3&color=fff&size=48'; }} />
          </div>
          <div className="hidden sm:block">
            <p className="font-bold text-indigo-800 text-sm leading-tight">MUDITA – AN ALLIANCE FOR GIVING</p>
            <p className="text-xs leading-tight" style={{ color: '#f59e0b' }}>
              Collaborate To Enable Individuals ★ Empower Our Communities
            </p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {navLink('/', 'HOME')}
          <span className="text-sm font-semibold text-gray-600 hover:text-amber-500 cursor-pointer">ABOUT</span>
          <span className="text-sm font-semibold text-gray-600 hover:text-amber-500 cursor-pointer">PROGRAMS</span>
          <span className="text-sm font-semibold text-gray-600 hover:text-amber-500 cursor-pointer">GET INVOLVED</span>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to={dashLink} className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-semibold px-4 py-1.5 rounded transition">
                DASHBOARD
              </Link>
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 transition font-semibold">
                LOGOUT
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-indigo-700 hover:text-amber-500 font-bold text-sm transition">LOGIN</Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setOpen(!open)}>
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4">
          {navLink('/', 'HOME')}
          {user ? (
            <>
              {navLink(dashLink, 'DASHBOARD')}
              <button onClick={handleLogout} className="text-left text-sm text-red-500 font-semibold">LOGOUT</button>
            </>
          ) : (
            navLink('/login', 'LOGIN')
          )}
        </div>
      )}
    </nav>
  );
}
