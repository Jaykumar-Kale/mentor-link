import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const RATING_LABELS = { careerDevelopment:'Career Dev', interpersonalSkills:'Interpersonal', communicationSkills:'Communication', etiquette:'Etiquette', problemSolving:'Problem Solving', timeManagement:'Time Mgmt' };

export default function MentorMentees() {
  const { user } = useAuth();
  const [mentees,  setMentees]  = useState([]);
  const [selected, setSelected] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then(r => setMentees(r.data.user.assignedMentees || []))
      .catch(() => toast.error('Failed to load mentees'))
      .finally(() => setLoading(false));
  }, []);

  const viewAnalysis = async (mentee) => {
    setSelected(mentee);
    setAnalysis(null);
    try {
      const r = await api.get(`/need-analysis/${mentee._id}`);
      setAnalysis(r.data.form);
    } catch {
      setAnalysis(null);
    }
  };

  const EMOJIS = ['','😠','😕','😐','😊','😄'];

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="text-3xl font-bold" style={{fontFamily:'Poppins,sans-serif'}}>My Mentees</h1>
        <p>Mentor &gt; Assigned Mentees ({mentees.length})</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400">⏳ Loading...</div>
        ) : mentees.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">👥</div>
            <p className="text-lg font-semibold">No mentees assigned yet</p>
            <p className="text-sm mt-1">Admin will assign mentees based on the matching algorithm.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mentee list */}
            <div className="lg:col-span-1 space-y-3">
              {mentees.map(m => (
                <div key={m._id}
                  onClick={() => viewAnalysis(m)}
                  className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition ${selected?._id===m._id ? 'border-indigo-500 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <img src={m.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=e0e7ff&color=3730a3&size=48`}
                      alt={m.name} className="w-12 h-12 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 truncate">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.college}</p>
                      <p className="text-xs text-gray-400">{m.year} · {m.stream}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <a href={`mailto:${m.email}`} className="text-xs text-amber-500 hover:underline truncate">{m.email}</a>
                  </div>
                </div>
              ))}
            </div>

            {/* Need analysis view */}
            <div className="lg:col-span-2">
              {!selected ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center text-gray-400 h-full flex flex-col items-center justify-center">
                  <div className="text-5xl mb-3">👈</div>
                  <p className="text-lg font-semibold">Select a mentee</p>
                  <p className="text-sm">to view their profile and need analysis</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Mentee header */}
                  <div className="bg-indigo-700 text-white p-5 flex items-center gap-4">
                    <img src={selected.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(selected.name)}&background=fff&color=3730a3&size=56`}
                      alt={selected.name} className="w-14 h-14 rounded-full object-cover border-2 border-white" />
                    <div>
                      <h2 className="text-xl font-bold">{selected.name}</h2>
                      <p className="text-indigo-200 text-sm">{selected.college} · {selected.year}</p>
                      <a href={`mailto:${selected.email}`} className="text-amber-300 text-xs hover:underline">{selected.email}</a>
                    </div>
                  </div>

                  <div className="p-5">
                    {!analysis ? (
                      <div className="text-center py-8 text-gray-400">
                        <div className="text-4xl mb-2">📋</div>
                        <p>Need Analysis form not submitted yet by this mentee.</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Expectations</p>
                          <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm">{analysis.expectations}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Self-Ratings (Weak areas need your focus)</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {Object.entries(analysis.ratings || {}).map(([key, val]) => (
                              <div key={key} className={`p-3 rounded-lg text-center border ${val<=2 ? 'border-red-200 bg-red-50' : val<=3 ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'}`}>
                                <div className="text-2xl">{['','😠','😕','😐','😊','😄'][val]}</div>
                                <p className="text-xs font-semibold mt-1 text-gray-600">{RATING_LABELS[key]}</p>
                                <p className={`text-lg font-black ${val<=2?'text-red-600':val<=3?'text-yellow-600':'text-green-600'}`}>{val}/5</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        {analysis.specificNeeds && (
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Specific Learning Needs</p>
                            <p className="text-gray-700 bg-amber-50 rounded-lg p-3 text-sm border border-amber-200">{analysis.specificNeeds}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><p className="text-xs text-gray-400">Preferred Languages</p><p className="font-semibold text-gray-700">{analysis.preferredLanguage?.join(', ') || '—'}</p></div>
                          <div><p className="text-xs text-gray-400">Will Mentorship Help?</p><p className="font-semibold text-gray-700">{analysis.willMentorshipHelp || '—'}</p></div>
                          <div><p className="text-xs text-gray-400">Willing to Contact 2x/month?</p><p className="font-semibold text-gray-700">{analysis.willingToContact || '—'}</p></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
