import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats,   setStats]   = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(r => setStats(r.data.stats))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  const CARDS = [
    { label:'Total Mentors',       value: stats.totalMentors,   color:'bg-indigo-600',  icon:'👨‍🏫' },
    { label:'Total Mentees',       value: stats.totalMentees,   color:'bg-amber-500',   icon:'🎓' },
    { label:'Matched Pairs',       value: stats.matched,        color:'bg-green-600',   icon:'🤝' },
    { label:'Unmatched Mentees',   value: stats.unmatched,      color:'bg-red-500',     icon:'⚠️' },
    { label:'Need Analysis Done',  value: stats.needDone,       color:'bg-purple-600',  icon:'📋' },
    { label:'Sessions Completed',  value: stats.completedSessions, color:'bg-teal-600', icon:'✅' },
  ];

  const QUICK_LINKS = [
    { to:'/admin/users',    label:'Manage Users',   icon:'👥', desc:'Add, edit, delete mentors & mentees' },
    { to:'/admin/matching', label:'Run Matching',   icon:'🔗', desc:'Auto-match or manually assign pairs' },
    { to:'/admin/sessions', label:'All Sessions',   icon:'📅', desc:'View all scheduled sessions' },
    { to:'/admin/modules',  label:'Manage Modules', icon:'📚', desc:'Upload learning materials' },
  ];

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-400 text-sm mb-1">Admin Panel</p>
          <h1 className="text-3xl font-bold" style={{fontFamily:'Poppins,sans-serif'}}>MentorLink Dashboard</h1>
          <p className="text-gray-300 mt-1">Mudita Alliance – Mentorship Program Management</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {loading ? (
          <div className="text-center py-10 text-gray-400">⏳ Loading stats...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {CARDS.map(c => (
              <div key={c.label} className={`${c.color} text-white rounded-xl p-5`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-3xl font-black">{c.value ?? '—'}</p>
                    <p className="text-xs mt-1 opacity-80">{c.label}</p>
                  </div>
                  <span className="text-3xl opacity-80">{c.icon}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Matching alert */}
        {stats.unmatched > 0 && (
          <div className="bg-orange-50 border border-orange-300 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-orange-800">{stats.unmatched} mentee(s) not yet matched</p>
              <p className="text-sm text-orange-700 mt-0.5">
                Go to the Matching page to run auto-match or assign manually.{' '}
                <Link to="/admin/matching" className="underline font-semibold">Match now →</Link>
              </p>
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_LINKS.map(l => (
            <Link key={l.to} to={l.to}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition flex items-center gap-4">
              <span className="text-4xl">{l.icon}</span>
              <div>
                <p className="font-bold text-gray-800">{l.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{l.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
