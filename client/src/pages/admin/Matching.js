import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminMatching() {
  const [unmatched,    setUnmatched]    = useState([]);
  const [mentors,      setMentors]      = useState([]);
  const [running,      setRunning]      = useState(false);
  const [results,      setResults]      = useState([]);
  const [selected,     setSelected]     = useState(null);
  const [suggestions,  setSuggestions]  = useState([]);
  const [loadingSugg,  setLoadingSugg]  = useState(false);
  const [manualMentor, setManualMentor] = useState('');
  const [assigning,    setAssigning]    = useState(false);
  const [loading,      setLoading]      = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [unmRes, menRes] = await Promise.all([
        api.get('/admin/users?role=mentee&isMatched=false'),
        api.get('/admin/users?role=mentor'),
      ]);
      setUnmatched(unmRes.data.users);
      setMentors(menRes.data.users);
    } catch { toast.error('Failed to load data'); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAutoMatch = async () => {
    setRunning(true);
    try {
      const r = await api.post('/admin/auto-match');
      toast.success(r.data.message);
      setResults(r.data.results);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Auto-match failed');
    }
    setRunning(false);
  };

  const handleSelectMentee = async (mentee) => {
    setSelected(mentee);
    setManualMentor('');
    setSuggestions([]);
    setLoadingSugg(true);
    try {
      const r = await api.get(`/admin/match-suggestions/${mentee._id}`);
      setSuggestions(r.data.suggestions);
    } catch { setSuggestions([]); }
    setLoadingSugg(false);
  };

  const handleManualMatch = async () => {
    if (!selected || !manualMentor) { toast.error('Select both mentee and mentor'); return; }
    setAssigning(true);
    try {
      const r = await api.post('/admin/manual-match', { menteeId: selected._id, mentorId: manualMentor });
      toast.success(r.data.message);
      fetchData();
      setSelected(null);
      setSuggestions([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Manual match failed');
    }
    setAssigning(false);
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="text-3xl font-bold" style={{fontFamily:'Poppins,sans-serif'}}>Mentor-Mentee Matching</h1>
        <p>Admin &gt; Matching Algorithm</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-red-600">{unmatched.length}</p>
            <p className="text-xs text-red-700 mt-1">Unmatched Mentees</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-blue-600">{mentors.length}</p>
            <p className="text-xs text-blue-700 mt-1">Available Mentors</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-green-600">{results.length}</p>
            <p className="text-xs text-green-700 mt-1">Matched This Session</p>
          </div>
        </div>

        {/* Auto match */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 text-lg mb-2">Automated Matching</h2>
          <p className="text-sm text-gray-500 mb-4">
            The algorithm scores mentor-mentee pairs based on language compatibility (30pts),
            domain expertise match (40pts), mentor workload (20pts), and experience (10pts).
            It assigns each unmatched mentee to the highest-scoring available mentor.
          </p>
          <button onClick={handleAutoMatch} disabled={running || unmatched.length === 0}
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-8 py-3 rounded-xl transition disabled:opacity-60">
            {running ? '⚙️ Running algorithm...' : `🔗 Run Auto-Match (${unmatched.length} unmatched)`}
          </button>
        </div>

        {/* Match results */}
        {results.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h3 className="font-bold text-green-800 mb-3">✅ Matching Results</h3>
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-green-100">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{i+1}</span>
                  <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
                    <span className="font-semibold text-gray-700">{r.mentee.name}</span>
                    <span className="text-center text-gray-400">→</span>
                    <span className="font-semibold text-indigo-700">{r.mentor.name}</span>
                  </div>
                  <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded-full">
                    Score: {r.score}/100
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual matching */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 text-lg mb-4">Manual Matching</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unmatched mentees */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">Select Unmatched Mentee</p>
              {loading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
              ) : unmatched.length === 0 ? (
                <p className="text-green-600 text-sm font-semibold">✅ All mentees are matched!</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {unmatched.map(m => (
                    <div key={m._id} onClick={() => handleSelectMentee(m)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition ${selected?._id===m._id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <p className="font-semibold text-gray-800 text-sm">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.college} · {m.year}</p>
                      <p className="text-xs text-gray-400">{m.email}</p>
                      {!m.needAnalysisCompleted && (
                        <p className="text-xs text-orange-500 mt-0.5">⚠ Need analysis not submitted</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div>
              {selected ? (
                <>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Top Mentor Suggestions for <span className="text-indigo-700">{selected.name}</span>
                  </p>
                  {loadingSugg ? (
                    <p className="text-gray-400 text-sm">Calculating scores...</p>
                  ) : suggestions.length === 0 ? (
                    <p className="text-gray-400 text-sm">No need analysis found. Cannot calculate scores.</p>
                  ) : (
                    <div className="space-y-2">
                      {suggestions.map((s, i) => (
                        <div key={i} onClick={() => setManualMentor(s.mentor._id)}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition ${manualMentor===s.mentor._id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">{s.mentor.name}</p>
                              <p className="text-xs text-gray-500">{s.mentor.organization}</p>
                              <p className="text-xs text-gray-400">{s.mentor.languagesKnown?.join(', ')}</p>
                              <p className="text-xs text-gray-400">Current mentees: {s.mentor.currentMentees}/3</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-black text-indigo-700">{s.score}</p>
                              <p className="text-xs text-gray-400">/ 100</p>
                            </div>
                          </div>
                          {/* Score breakdown */}
                          <div className="mt-2 flex gap-1 flex-wrap">
                            {Object.entries(s.details || {}).map(([k, d]) => (
                              <span key={k} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                                {k}: {d.score}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Manual select from full list */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-1">Or choose from all mentors:</p>
                    <select value={manualMentor} onChange={e => setManualMentor(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                      <option value="">Select mentor</option>
                      {mentors.map(m => <option key={m._id} value={m._id}>{m.name} ({m.organization || '—'})</option>)}
                    </select>
                  </div>

                  <button onClick={handleManualMatch} disabled={assigning || !manualMentor}
                    className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-lg transition disabled:opacity-60 text-sm">
                    {assigning ? 'Assigning...' : `Assign Mentor to ${selected.name}`}
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 text-center py-10">
                  <div>
                    <div className="text-4xl mb-2">👈</div>
                    <p>Select a mentee to see mentor suggestions</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
