import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MENTEE_NAV = [
  { to: '/mentee/dashboard',    label: 'Home' },
  { to: '/mentee/modules',      label: 'Modules' },
  { to: '/mentee/sessions',     label: 'Sessions' },
  { to: '/mentee/need-analysis',label: 'Need Analysis' },
];

const MENTOR_NAV = [
  { to: '/mentor/dashboard', label: 'Home' },
  { to: '/mentor/mentees',   label: 'My Mentees' },
  { to: '/mentor/sessions',  label: 'Sessions' },
];

const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users',     label: 'Users' },
  { to: '/admin/matching',  label: 'Matching' },
  { to: '/admin/sessions',  label: 'Sessions' },
  { to: '/admin/modules',   label: 'Modules' },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const nav = user?.role === 'mentor' ? MENTOR_NAV
            : user?.role === 'admin'  ? ADMIN_NAV
            : MENTEE_NAV;

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/'); };

  const avatar = user?.profilePhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=3730a3&color=fff&size=36`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
              <img src="/mudita-logo.jpg" alt="Mudita"
                className="w-full h-full object-contain"
                onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=M&background=3730a3&color=fff'; }} />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-indigo-800 text-sm leading-tight">MUDITA – AN ALLIANCE FOR GIVING</p>
              <p className="text-xs text-amber-500 leading-tight">Collaborate To Enable Individuals ★ Empower Our Communities</p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {nav.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`text-sm font-semibold transition ${pathname === to ? 'text-indigo-700 border-b-2 border-indigo-700 pb-0.5' : 'text-gray-600 hover:text-amber-500'}`}>
                {label}
              </Link>
            ))}
          </nav>

          {/* User info */}
          <div className="flex items-center gap-3">
            <img src={avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name}</p>
              <p className="text-xs text-amber-500 capitalize">{user?.role}</p>
            </div>
            <button onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-red-500 transition ml-2 font-medium">
              Logout
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex overflow-x-auto gap-4 px-4 pb-2 border-t pt-2">
          {nav.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`text-xs font-semibold whitespace-nowrap transition ${pathname === to ? 'text-indigo-700' : 'text-gray-500 hover:text-amber-500'}`}>
              {label}
            </Link>
          ))}
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
