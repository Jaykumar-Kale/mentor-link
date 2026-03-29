import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("mentee");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    // mentor
    organization: "",
    yearsOfExperience: "",
    languagesKnown: "",
    branch: "",
    expertise: "",
    linkedIn: "",
    // mentee
    college: "",
    year: "",
    stream: "",
    scholarshipId: "",
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", { ...form, role });
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  const inputCls =
    "w-full border border-gray-200 bg-gray-50 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
  const label = (txt) => (
    <label className="block text-xs font-semibold text-gray-600 mb-1">
      {txt}
    </label>
  );

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1
            className="text-2xl font-bold text-indigo-800 mb-1"
            style={{ fontFamily: "Poppins,sans-serif" }}
          >
            Register
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Create your MentorLink account
          </p>

          {/* Role selector */}
          <div className="flex gap-3 mb-6">
            {["mentee", "mentor"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded font-semibold text-sm transition ${role === r ? "bg-indigo-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {r === "mentee" ? "Student / Mentee" : "Mentor / Volunteer"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {label("Full Name *")}
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handle}
                  className={inputCls}
                  placeholder="Your full name"
                />
              </div>
              <div>
                {label("Email *")}
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handle}
                  className={inputCls}
                  placeholder="you@email.com"
                />
              </div>
              <div>
                {label("Password *")}
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handle}
                  className={inputCls}
                  placeholder="Min 6 characters"
                />
              </div>
              <div>
                {label("Phone Number")}
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handle}
                  className={inputCls}
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                {label("Gender")}
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handle}
                  className={inputCls}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Mentor-specific fields */}
            {role === "mentor" && (
              <div className="border-t pt-4 space-y-4">
                <p className="text-xs font-bold text-amber-500 uppercase tracking-wide">
                  Mentor Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    {label("Organisation / Company *")}
                    <input
                      name="organization"
                      required
                      value={form.organization}
                      onChange={handle}
                      className={inputCls}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    {label("Years of Experience")}
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={form.yearsOfExperience}
                      onChange={handle}
                      className={inputCls}
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div>
                    {label("Branch / Field of Study")}
                    <input
                      name="branch"
                      value={form.branch}
                      onChange={handle}
                      className={inputCls}
                      placeholder="e.g. Computer Engineering"
                    />
                  </div>
                  <div>
                    {label("Languages Known (comma separated)")}
                    <input
                      name="languagesKnown"
                      value={form.languagesKnown}
                      onChange={handle}
                      className={inputCls}
                      placeholder="English, Marathi, Hindi"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    {label("Areas of Expertise (comma separated)")}
                    <input
                      name="expertise"
                      value={form.expertise}
                      onChange={handle}
                      className={inputCls}
                      placeholder="Communication Skills, Career Development"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    {label("LinkedIn Profile URL")}
                    <input
                      name="linkedIn"
                      value={form.linkedIn}
                      onChange={handle}
                      className={inputCls}
                      placeholder="https://linkedin.com/in/yourname"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mentee-specific fields */}
            {role === "mentee" && (
              <div className="border-t pt-4 space-y-4">
                <p className="text-xs font-bold text-amber-500 uppercase tracking-wide">
                  Student Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    {label("College / University *")}
                    <input
                      name="college"
                      required
                      value={form.college}
                      onChange={handle}
                      className={inputCls}
                      placeholder="College name"
                    />
                  </div>
                  <div>
                    {label("Year of Study")}
                    <input
                      name="year"
                      value={form.year}
                      onChange={handle}
                      className={inputCls}
                      placeholder="e.g. FY / SY / TY / Final Year"
                    />
                  </div>
                  <div>
                    {label("Stream / Branch")}
                    <input
                      name="stream"
                      value={form.stream}
                      onChange={handle}
                      className={inputCls}
                      placeholder="e.g. Computer Engineering"
                    />
                  </div>
                  <div>
                    {label("Scholarship ID (if any)")}
                    <input
                      name="scholarshipId"
                      value={form.scholarshipId}
                      onChange={handle}
                      className={inputCls}
                      placeholder="MUD-2024-XXX"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 rounded transition disabled:opacity-60 mt-2"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-500 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
