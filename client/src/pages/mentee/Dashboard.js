import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function MenteeDashboard() {
  const { user, updateUser } = useAuth();
  const [stats, setStats]   = useState({ total:0, completed:0, upcoming:0, progress:0 });
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, statsRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/sessions/stats'),
        ]);
        updateUser(meRes.data.user);
        if (meRes.data.user.assignedMentor) setMentor(meRes.data.user.assignedMentor);
        setStats(statsRes.data.stats);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      }
      setLoading(false);
    };
    fetchData();
  }, []); // eslint-disable-line

  const MODULES = ['Career Development','Interpersonal Skills','Communication Skills',
                   'Etiquette','Problem Solving & Decision Making','Time and Stress Management'];

  return (
    <DashboardLayout>
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-indigo-200 text-sm mb-1">Welcome To</p>
          <h1 className="text-3xl font-bold mb-2" style={{fontFamily:'Poppins,sans-serif'}}>
            Mudita Mentoring Program
          </h1>
          <p className="text-indigo-200 text-base max-w-xl">
            We hope you will make the most of this opportunity.
            Wishing you all the best on your mentoring journey.
          </p>
          <div className="w-20 h-1 bg-amber-400 rounded mt-4 mb-4"/>
          <p className="text-indigo-300 text-sm">
            Feel free to email us if you have any questions at{' '}
            <a href="mailto:mentoring@muditaalliance.org" className="text-amber-300 hover:underline">
              mentoring@muditaalliance.org
            </a>
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Alerts */}
        {!user?.needAnalysisCompleted && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-semibold text-amber-800">Complete your Need Analysis Form</p>
              <p className="text-sm text-amber-700 mt-0.5">
                This is mandatory to get matched with a mentor.{' '}
                <Link to="/mentee/need-analysis" className="underline font-semibold">Fill it now →</Link>
              </p>
            </div>
          </div>
        )}
        {user?.needAnalysisCompleted && !user?.isMatched && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-semibold text-blue-800">Mentor assignment in progress</p>
              <p className="text-sm text-blue-700 mt-0.5">Your need analysis has been submitted. Admin will assign your mentor soon.</p>
            </div>
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:'Total Sessions',    value: stats.total,     color:'bg-indigo-600' },
            { label:'Completed',         value: stats.completed, color:'bg-green-600'  },
            { label:'Upcoming',          value: stats.upcoming,  color:'bg-amber-500'  },
            { label:'Progress',          value: `${stats.progress}%`, color:'bg-purple-600' },
          ].map(c => (
            <div key={c.label} className={`${c.color} text-white rounded-xl p-4 text-center`}>
              <p className="text-3xl font-black">{c.value}</p>
              <p className="text-xs mt-1 opacity-80">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-gray-700">Program Progress</p>
            <p className="text-sm font-bold text-indigo-700">{stats.progress}%</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.progress}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Complete 8 sessions across any 4 modules to reach 100%
          </p>
        </div>

        {/* Mentor card */}
        {mentor && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-700 mb-4 text-lg">Your Mentor</h2>
            <div className="flex items-center gap-4">
              <img
                src={mentor.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=3730a3&color=fff&size=64`}
                alt={mentor.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
              />
              <div>
                <p className="font-bold text-indigo-800 text-lg">{mentor.name}</p>
                <p className="text-gray-500 text-sm">{mentor.organization || 'Volunteer Mentor'}</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {mentor.languagesKnown?.join(', ')} · {mentor.expertise?.slice(0,2).join(', ')}
                </p>
                <a href={`mailto:${mentor.email}`}
                  className="text-amber-500 text-xs hover:underline mt-1 block">{mentor.email}</a>
              </div>
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/mentee/sessions"
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl p-5 text-center transition group">
            <div className="text-3xl mb-2">📅</div>
            <p className="font-bold">Sessions</p>
            <p className="text-xs opacity-80 mt-1">Schedule &amp; manage meetings</p>
          </Link>
          <Link to="/mentee/modules"
            className="bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl p-5 text-center transition">
            <div className="text-3xl mb-2">📚</div>
            <p className="font-bold">Modules</p>
            <p className="text-xs opacity-80 mt-1">Learning resources &amp; materials</p>
          </Link>
          <Link to="/mentee/need-analysis"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-5 text-center transition">
            <div className="text-3xl mb-2">📋</div>
            <p className="font-bold">Need Analysis</p>
            <p className="text-xs opacity-80 mt-1">{user?.needAnalysisCompleted ? 'View submitted form' : 'Submit your form'}</p>
          </Link>
        </div>

        {/* Module progress */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-700 mb-4 text-lg">Program Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MODULES.map(m => {
              const done = (stats.completedTopics || []).includes(m);
              return (
                <div key={m} className={`flex items-center gap-3 p-3 rounded-lg border ${done ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {done ? '✓' : '○'}
                  </span>
                  <p className={`text-sm ${done ? 'text-green-700 font-semibold' : 'text-gray-600'}`}>{m}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
