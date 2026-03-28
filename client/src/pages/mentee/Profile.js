import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function MenteeProfile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    name:         user?.name         || '',
    phone:        user?.phone        || '',
    college:      user?.college      || '',
    year:         user?.year         || '',
    stream:       user?.stream       || '',
    scholarshipId:user?.scholarshipId|| '',
  });

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/update-profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Update failed');
    }
    setSaving(false);
  };

  const avatar = user?.profilePhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'M')}&background=3730a3&color=fff&size=128`;

  const Field = ({ label, value }) => (
    <div className="py-3 border-b border-gray-50 last:border-0">
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-gray-800 font-medium">{value || <span className="text-gray-300 italic">Not provided</span>}</p>
    </div>
  );

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400';
  const lbl = t => <label className="block text-xs font-semibold text-gray-500 mb-1">{t}</label>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="text-3xl font-bold" style={{fontFamily:'Poppins,sans-serif'}}>My Profile</h1>
        <p>Student &gt; Profile</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Avatar card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
          <img src={avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100" />
          <div>
            <h2 className="text-xl font-bold text-indigo-800">{user?.name}</h2>
            <p className="text-amber-500 text-sm font-semibold capitalize">{user?.role}</p>
            <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>
            <div className="flex gap-2 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${user?.needAnalysisCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {user?.needAnalysisCompleted ? '✓ Need Analysis Done' : '⚠ Need Analysis Pending'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${user?.isMatched ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {user?.isMatched ? '✓ Mentor Assigned' : '○ Awaiting Mentor'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile details */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700 text-lg">Profile Details</h3>
            {!editing && (
              <button onClick={() => setEditing(true)}
                className="text-sm bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 transition font-semibold">
                Edit Profile
              </button>
            )}
          </div>

          {!editing ? (
            <div>
              <Field label="Full Name"       value={user?.name} />
              <Field label="Email"           value={user?.email} />
              <Field label="Phone"           value={user?.phone} />
              <Field label="College"         value={user?.college} />
              <Field label="Year of Study"   value={user?.year} />
              <Field label="Stream / Branch" value={user?.stream} />
              <Field label="Scholarship ID"  value={user?.scholarshipId} />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>{lbl('Full Name')}<input name="name" value={form.name} onChange={handle} className={inputCls} /></div>
                <div>{lbl('Phone')}<input name="phone" value={form.phone} onChange={handle} className={inputCls} /></div>
                <div>{lbl('College')}<input name="college" value={form.college} onChange={handle} className={inputCls} /></div>
                <div>{lbl('Year of Study')}<input name="year" value={form.year} onChange={handle} className={inputCls} /></div>
                <div>{lbl('Stream / Branch')}<input name="stream" value={form.stream} onChange={handle} className={inputCls} /></div>
                <div>{lbl('Scholarship ID')}<input name="scholarshipId" value={form.scholarshipId} onChange={handle} className={inputCls} /></div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-semibold hover:bg-gray-50 transition text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-semibold transition text-sm disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Mentor info */}
        {user?.assignedMentor && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <h3 className="font-bold text-indigo-800 mb-3">Assigned Mentor</h3>
            <div className="flex items-center gap-4">
              <img
                src={user.assignedMentor.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.assignedMentor.name)}&background=6366f1&color=fff&size=48`}
                alt="mentor" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-bold text-indigo-800">{user.assignedMentor.name}</p>
                <p className="text-sm text-gray-600">{user.assignedMentor.organization}</p>
                <a href={`mailto:${user.assignedMentor.email}`} className="text-xs text-amber-500 hover:underline">{user.assignedMentor.email}</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
