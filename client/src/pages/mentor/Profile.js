import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function MentorProfile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    organization: user?.organization || "",
    yearsOfExperience: user?.yearsOfExperience || "",
    languagesKnown: user?.languagesKnown?.join(", ") || "",
    branch: user?.branch || "",
    expertise: user?.expertise?.join(", ") || "",
    linkedIn: user?.linkedIn || "",
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        languagesKnown: form.languagesKnown
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        expertise: form.expertise
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean),
        yearsOfExperience: Number(form.yearsOfExperience),
      };
      const res = await api.put("/auth/update-profile", payload);
      updateUser(res.data.user);
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Update failed");
    }
    setSaving(false);
  };

  const avatar =
    user?.profilePhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "M")}&background=3730a3&color=fff&size=128`;

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
  const lbl = (t) => (
    <label className="block text-xs font-semibold text-gray-500 mb-1">
      {t}
    </label>
  );
  const Field = ({ label, value }) => (
    <div className="py-3 border-b border-gray-50 last:border-0">
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="text-gray-800 font-medium">
        {value || <span className="text-gray-300 italic">Not provided</span>}
      </p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "Poppins,sans-serif" }}
        >
          Mentor Profile
        </h1>
        <p>Mentor &gt; Profile</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Avatar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
          <img
            src={avatar}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-amber-100"
          />
          <div>
            <h2 className="text-xl font-bold text-indigo-800">{user?.name}</h2>
            <p className="text-amber-500 font-semibold text-sm">
              Mentor · Volunteer
            </p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <p className="text-gray-400 text-xs mt-0.5">{user?.organization}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700 text-lg">Profile Details</h3>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-sm bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 transition font-semibold"
              >
                Edit Profile
              </button>
            )}
          </div>
          {!editing ? (
            <div>
              <Field label="Full Name" value={user?.name} />
              <Field label="Email" value={user?.email} />
              <Field label="Phone" value={user?.phone} />
              <Field label="Organisation" value={user?.organization} />
              <Field
                label="Experience"
                value={
                  user?.yearsOfExperience
                    ? `${user.yearsOfExperience} years`
                    : null
                }
              />
              <Field label="Branch / Field" value={user?.branch} />
              <Field
                label="Languages Known"
                value={user?.languagesKnown?.join(", ")}
              />
              <Field
                label="Expertise Areas"
                value={user?.expertise?.join(", ")}
              />
              <Field label="LinkedIn" value={user?.linkedIn} />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  {lbl("Full Name")}
                  <input
                    name="name"
                    value={form.name}
                    onChange={handle}
                    className={inputCls}
                  />
                </div>
                <div>
                  {lbl("Phone")}
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handle}
                    className={inputCls}
                  />
                </div>
                <div>
                  {lbl("Organisation")}
                  <input
                    name="organization"
                    value={form.organization}
                    onChange={handle}
                    className={inputCls}
                  />
                </div>
                <div>
                  {lbl("Years of Experience")}
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={form.yearsOfExperience}
                    onChange={handle}
                    className={inputCls}
                  />
                </div>
                <div>
                  {lbl("Branch / Field")}
                  <input
                    name="branch"
                    value={form.branch}
                    onChange={handle}
                    className={inputCls}
                  />
                </div>
                <div>
                  {lbl("Languages (comma separated)")}
                  <input
                    name="languagesKnown"
                    value={form.languagesKnown}
                    onChange={handle}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  {lbl("Expertise Areas (comma separated)")}
                  <input
                    name="expertise"
                    value={form.expertise}
                    onChange={handle}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  {lbl("LinkedIn URL")}
                  <input
                    name="linkedIn"
                    value={form.linkedIn}
                    onChange={handle}
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-semibold text-sm transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Mentees summary */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-bold text-amber-800 mb-1">Assigned Mentees</h3>
          <p className="text-3xl font-black text-amber-600">
            {user?.assignedMentees?.length || 0}
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            mentees currently under your guidance
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
