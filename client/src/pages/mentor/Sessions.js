import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const TOPICS = ['Introduction Call','Career Development','Interpersonal Skills','Communication Skills','Etiquette','Problem Solving and Decision Making','Time and Stress Management','Other'];
const DURATIONS = ['30','45','60','90','120'];
const STATUS_COLORS = { upcoming:'bg-blue-100 text-blue-700', completed:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-700' };

export default function MentorSessions() {
  const { user } = useAuth();
  const [sessions, setSessions]   = useState([]);
  const [mentees,  setMentees]    = useState([]);
  const [stats,    setStats]      = useState({ total:0, completed:0, upcoming:0 });
  const [loading,  setLoading]    = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ topic:'', date:'', startTime:'', duration:'60', meetingLink:'', agenda:'', menteeId:'' });
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, stRes, meRes] = await Promise.all([
          api.get('/sessions'),
          api.get('/sessions/stats'),
          api.get('/auth/me'),
        ]);
        setSessions(sRes.data.sessions);
        setStats(stRes.data.stats);
        setMentees(meRes.data.user.assignedMentees || []);
      } catch { toast.error('Failed to load sessions'); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const calcEnd = () => {
    if (!form.startTime || !form.duration) return '';
    const [h,m] = form.startTime.split(':').map(Number);
    const t = h*60 + m + Number(form.duration);
    return `${String(Math.floor(t/60)%24).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
  };

  const handleCreate = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/sessions', form);
      setSessions(p => [res.data.session, ...p]);
      toast.success('Session scheduled!');
      setShowModal(false);
      setForm({ topic:'', date:'', startTime:'', duration:'60', meetingLink:'', agenda:'', menteeId:'' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
    setSaving(false);
  };

  const markComplete = async (id, feedback) => {
    try {
      const res = await api.put(`/sessions/${id}/status`, { status:'completed', mentorFeedback: feedback });
      setSessions(p => p.map(s => s._id===id ? res.data.session : s));
      toast.success('Session marked complete');
    } catch { toast.error('Failed'); }
  };

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400';

  return (
    <DashboardLayout>
      {/* Schedule modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-lg font-bold text-amber-500">Schedule Session</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-indigo-800 mb-1">Select Mentee *</label>
                <select name="menteeId" required value={form.menteeId} onChange={handle} className={inputCls}>
                  <option value="">Select mentee</option>
                  {mentees.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-800 mb-1">Session Topic *</label>
                <select name="topic" required value={form.topic} onChange={handle} className={inputCls}>
                  <option value="">Select topic</option>
                  {TOPICS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-800 mb-1">Date *</label>
                <input type="date" name="date" required value={form.date} onChange={handle} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-indigo-800 mb-1">Start Time *</label>
                  <input type="time" name="startTime" required value={form.startTime} onChange={handle} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-indigo-800 mb-1">Duration (min)</label>
                  <select name="duration" value={form.duration} onChange={handle} className={inputCls}>
                    {DURATIONS.map(d => <option key={d} value={d}>{d} min</option>)}
                  </select>
                </div>
              </div>
              {form.startTime && <p className="text-xs text-gray-400">End time: {calcEnd()}</p>}
              <div>
                <label className="block text-sm font-semibold text-indigo-800 mb-1">Meeting Link</label>
                <input type="url" name="meetingLink" value={form.meetingLink} onChange={handle} placeholder="https://meet.google.com/..." className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-800 mb-1">Agenda / Notes</label>
                <textarea name="agenda" value={form.agenda} onChange={handle} rows={3} className={inputCls} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-semibold text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold text-sm disabled:opacity-60">
                  {saving ? 'Scheduling...' : 'Schedule Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1 className="text-3xl font-bold" style={{fontFamily:'Poppins,sans-serif'}}>Sessions</h1>
        <p>Mentor &gt; All Sessions</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[{ l:'Total', v:stats.total }, { l:'Completed', v:stats.completed }, { l:'Upcoming', v:stats.upcoming }].map(c => (
            <div key={c.l} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-black text-indigo-700">{c.v}</p>
              <p className="text-xs text-gray-500 mt-1">{c.l}</p>
            </div>
          ))}
        </div>

        <button onClick={() => setShowModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition">
          + Schedule New Session
        </button>

        {loading ? <div className="text-center py-10 text-gray-400">⏳ Loading...</div> : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>{['Topic','Mentee','Status','Date','Time','Link','Action'].map(h => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {sessions.length === 0 ? (
                    <tr><td colSpan={7} className="py-10 text-center text-gray-400">No sessions yet. Schedule one!</td></tr>
                  ) : sessions.map(s => (
                    <tr key={s._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-700 max-w-xs">{s.topic}</td>
                      <td className="py-3 px-4 text-sm">{s.mentee?.name}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[s.status]}`}>
                          {s.status.charAt(0).toUpperCase()+s.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(s.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{s.startTime}</td>
                      <td className="py-3 px-4">
                        {s.meetingLink
                          ? <a href={s.meetingLink} target="_blank" rel="noreferrer" className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700 transition">Join</a>
                          : <span className="text-xs text-gray-400">—</span>
                        }
                      </td>
                      <td className="py-3 px-4">
                        {s.status === 'upcoming' && (
                          <button onClick={() => markComplete(s._id, '')}
                            className="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition">
                            Mark Done
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
