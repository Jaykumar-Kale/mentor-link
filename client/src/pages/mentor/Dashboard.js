import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function MentorDashboard() {
  const { user, updateUser } = useAuth();
  const [stats,   setStats]   = useState({ total:0, completed:0, upcoming:0, progress:0 });
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, statsRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/sessions/stats'),
        ]);
        updateUser(meRes.data.user);
        setMentees(meRes.data.user.assignedMentees || []);
        setStats(statsRes.data.stats);
      } catch { toast.error('Failed to load data'); }
      setLoading(false);
    };
    fetchData();
  }, []); // eslint-disable-line

  return (
    <DashboardLayout>
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-indigo-200 text-sm mb-1">Welcome back,</p>
          <h1 className="text-3xl font-bold mb-2" style={{fontFamily:'Poppins,sans-serif'}}>
            {user?.name}
          </h1>
          <p className="text-indigo-200">
            Thank you for volunteering as a mentor. Your guidance makes a difference.
          </p>
          <div className="w-20 h-1 bg-amber-400 rounded mt-4"/>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {!user?.assignedMentees?.length && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-semibold text-amber-800">Awaiting mentee assignment</p>
              <p className="text-sm text-amber-700 mt-0.5">Admin will assign mentees to you based on the matching algorithm soon.</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:'My Mentees',     value: mentees.length,  color:'bg-indigo-600' },
            { label:'Total Sessions', value: stats.total,     color:'bg-amber-500'  },
            { label:'Completed',      value: stats.completed, color:'bg-green-600'  },
            { label:'Upcoming',       value: stats.upcoming,  color:'bg-purple-600' },
          ].map(c => (
            <div key={c.label} className={`${c.color} text-white rounded-xl p-4 text-center`}>
              <p className="text-3xl font-black">{c.value}</p>
              <p className="text-xs mt-1 opacity-80">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/mentor/sessions"
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl p-5 flex items-center gap-4 transition">
            <div className="text-4xl">📅</div>
            <div>
              <p className="font-bold text-lg">Sessions</p>
              <p className="text-sm opacity-80">Schedule & manage meetings with mentees</p>
            </div>
          </Link>
          <Link to="/mentor/mentees"
            className="bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl p-5 flex items-center gap-4 transition">
            <div className="text-4xl">👥</div>
            <div>
              <p className="font-bold text-lg">My Mentees</p>
              <p className="text-sm opacity-80">View mentee profiles and need analysis</p>
            </div>
          </Link>
        </div>

        {/* Mentee list preview */}
        {mentees.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-700 text-lg">Assigned Mentees</h2>
              <Link to="/mentor/mentees" className="text-sm text-amber-500 hover:underline font-semibold">View all →</Link>
            </div>
            <div className="space-y-3">
              {mentees.slice(0,3).map(m => (
                <div key={m._id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                  <img
                    src={m.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=e0e7ff&color=3730a3&size=40`}
                    alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-gray-800">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.college} · {m.year}</p>
                  </div>
                  <a href={`mailto:${m.email}`} className="ml-auto text-xs text-amber-500 hover:underline">{m.email}</a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mentor info card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-700 mb-4">Your Profile Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div><p className="text-xs text-gray-400 mb-0.5">Organisation</p><p className="font-semibold text-gray-700">{user?.organization || '—'}</p></div>
            <div><p className="text-xs text-gray-400 mb-0.5">Experience</p><p className="font-semibold text-gray-700">{user?.yearsOfExperience ? `${user.yearsOfExperience} years` : '—'}</p></div>
            <div><p className="text-xs text-gray-400 mb-0.5">Languages</p><p className="font-semibold text-gray-700">{user?.languagesKnown?.join(', ') || '—'}</p></div>
            <div className="sm:col-span-2"><p className="text-xs text-gray-400 mb-0.5">Expertise</p><p className="font-semibold text-gray-700">{user?.expertise?.join(', ') || '—'}</p></div>
          </div>
          <Link to="/mentor/profile" className="inline-block mt-4 text-sm text-amber-500 hover:underline font-semibold">
            Edit Profile →
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}
