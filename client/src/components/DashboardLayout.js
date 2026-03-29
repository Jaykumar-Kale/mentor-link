import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const NAV = {
  mentee: [
    { to:'/mentee/dashboard',    label:'Home',          icon:'🏠' },
    { to:'/mentee/modules',      label:'Modules',       icon:'📚' },
    { to:'/mentee/sessions',     label:'Sessions',      icon:'📅' },
    { to:'/mentee/need-analysis',label:'Need Analysis', icon:'📋' },
    { to:'/mentee/profile',      label:'Profile',       icon:'👤' },
  ],
  mentor: [
    { to:'/mentor/dashboard', label:'Home',       icon:'🏠' },
    { to:'/mentor/mentees',   label:'My Mentees', icon:'👥' },
    { to:'/mentor/sessions',  label:'Sessions',   icon:'📅' },
    { to:'/mentor/profile',   label:'Profile',    icon:'👤' },
  ],
  admin: [
    { to:'/admin/dashboard', label:'Dashboard', icon:'📊' },
    { to:'/admin/users',     label:'Users',     icon:'👥' },
    { to:'/admin/matching',  label:'Matching',  icon:'🔗' },
    { to:'/admin/sessions',  label:'Sessions',  icon:'📅' },
    { to:'/admin/modules',   label:'Modules',   icon:'📚' },
  ],
};

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileNav, setMobileNav] = useState(false);

  const navItems = NAV[user?.role] || NAV.mentee;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const avatar = user?.profilePhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'U')}&background=3730a3&color=fff&size=40&bold=true`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Top Header ─── */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="https://muditaalliance.org/wp-content/uploads/2025/02/Mudita-logo.jpg"
              alt="Mudita"
              className="h-10 w-10 rounded-full object-contain border border-gray-100 shadow-sm"
              onError={e=>{e.target.src='https://ui-avatars.com/api/?name=M&background=3730a3&color=fff&size=40';}}
            />
            <div className="hidden sm:block">
              <p className="font-bold text-xs leading-tight" style={{color:'#3730a3',fontFamily:'Plus Jakarta Sans,sans-serif'}}>
                MUDITA – AN ALLIANCE FOR GIVING
              </p>
              <p className="text-xs leading-tight font-medium" style={{color:'#f59e0b'}}>
                MentorLink Portal
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  pathname === to
                    ? 'bg-indigo-700 text-white shadow-sm'
                    : 'text-gray-600 hover:text-indigo-700 hover:bg-indigo-50'
                }`}>
                {label}
              </Link>
            ))}
          </nav>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-gray-800 leading-tight">{user?.name}</p>
              <p className="text-xs font-semibold capitalize" style={{color:'#f59e0b'}}>{user?.role}</p>
            </div>
            <img src={avatar} alt="avatar"
              className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100 shadow-sm"/>
            <button onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-red-500 font-semibold transition hidden sm:block">
              Logout
            </button>
            {/* Mobile hamburger */}
            <button onClick={() => setMobileNav(!mobileNav)}
              className="md:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100">
              {mobileNav ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileNav && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
            {navItems.map(({ to, label, icon }) => (
              <Link key={to} to={to} onClick={() => setMobileNav(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  pathname === to ? 'bg-indigo-700 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}>
                <span>{icon}</span>{label}
              </Link>
            ))}
            <button onClick={handleLogout}
              className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50">
              🚪 Logout
            </button>
          </div>
        )}
      </header>

      {/* ─── Page content ─── */}
      <main>{children}</main>
    </div>
  );
}
