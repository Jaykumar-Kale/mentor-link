import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../utils/api";
import toast from "react-hot-toast";

const TOPICS = [
  "Introduction Call",
  "Career Development",
  "Interpersonal Skills",
  "Communication Skills",
  "Etiquette",
  "Problem Solving and Decision Making",
  "Time and Stress Management",
  "Other",
];
const DURATIONS = [
  { label: "30 minutes", value: "30" },
  { label: "45 minutes", value: "45" },
  { label: "1 hour", value: "60" },
  { label: "1.5 hours", value: "90" },
  { label: "2 hours", value: "120" },
];
const STATUS_COLOR = {
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function ScheduleModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    topic: "",
    date: "",
    startTime: "",
    duration: "60",
    meetingLink: "",
    agenda: "",
  });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const calcEnd = () => {
    if (!form.startTime || !form.duration) return "—";
    const [h, m] = form.startTime.split(":").map(Number);
    const t = h * 60 + m + Number(form.duration);
    return `${String(Math.floor(t / 60) % 24).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
  };
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/sessions", form);
      toast.success("Session scheduled!");
      onCreated(res.data.session);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to schedule");
    }
    setLoading(false);
  };
  const inp =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white";
  const lbl = (t) => (
    <label className="block text-sm font-semibold text-indigo-800 mb-1">
      {t}
    </label>
  );
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-amber-500">
            Create New Session
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div>
            {lbl("Session Agenda *")}
            <select
              required
              value={form.topic}
              onChange={(e) => set("topic", e.target.value)}
              className={inp}
            >
              <option value="">Select topic</option>
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            {lbl("Select Date *")}
            <input
              type="date"
              required
              value={form.date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => set("date", e.target.value)}
              className={inp}
            />
          </div>
          <div>
            {lbl("Select Start Time *")}
            <input
              type="time"
              required
              value={form.startTime}
              onChange={(e) => set("startTime", e.target.value)}
              className={inp}
            />
          </div>
          <div>
            {lbl("Select Duration")}
            <select
              value={form.duration}
              onChange={(e) => set("duration", e.target.value)}
              className={inp}
            >
              {DURATIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            {lbl("End Time (auto-calculated)")}
            <input
              readOnly
              value={calcEnd()}
              className="w-full border border-gray-100 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            {lbl("Meeting Link (Google Meet / Zoom)")}
            <input
              type="url"
              value={form.meetingLink}
              placeholder="https://meet.google.com/..."
              onChange={(e) => set("meetingLink", e.target.value)}
              className={inp}
            />
          </div>
          <div>
            {lbl("Session Description / Notes")}
            <textarea
              value={form.agenda}
              onChange={(e) => set("agenda", e.target.value)}
              rows={3}
              placeholder="What will you discuss?"
              className={`${inp} resize-none`}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition disabled:opacity-60"
            >
              {loading ? "Scheduling..." : "Create Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FeedbackModal({ session, onClose, onUpdated }) {
  const [rating, setRating] = useState(5);
  const [summary, setSummary] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put(`/sessions/${session._id}/status`, {
        status: "completed",
        menteeRating: rating,
        summary,
        menteeFeedback: feedback,
      });
      toast.success("Feedback submitted!");
      onUpdated(res.data.session);
      onClose();
    } catch {
      toast.error("Failed to submit feedback");
    }
    setLoading(false);
  };
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-indigo-800">
            Session Feedback
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg font-medium">
            {session.topic} —{" "}
            {new Date(session.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rate this session
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`w-11 h-11 rounded-full font-bold text-lg transition ${rating >= n ? "bg-amber-500 text-white shadow" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Session Summary
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              placeholder="What was discussed?"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Your Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder="How was your experience?"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-semibold text-sm transition disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MenteeSessions() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    upcoming: 0,
    cancelled: 0,
    progress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const load = async () => {
    try {
      const [sR, stR] = await Promise.all([
        api.get("/sessions"),
        api.get("/sessions/stats"),
      ]);
      setSessions(sR.data.sessions);
      setStats(stR.data.stats);
    } catch {
      toast.error("Failed to load sessions");
    }
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);
  const onCreated = (s) => setSessions((p) => [s, ...p]);
  const onUpdated = (s) =>
    setSessions((p) => p.map((x) => (x._id === s._id ? s : x)));

  return (
    <DashboardLayout>
      {showModal && (
        <ScheduleModal
          onClose={() => setShowModal(false)}
          onCreated={onCreated}
        />
      )}
      {feedback && (
        <FeedbackModal
          session={feedback}
          onClose={() => setFeedback(null)}
          onUpdated={onUpdated}
        />
      )}

      <div className="page-header">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "Poppins,sans-serif" }}
        >
          Sessions
        </h1>
        <p className="mt-1 text-white/80 text-sm">Student &gt; All Sessions</p>
      </div>
      {/* Icons = 🏆,✅,📅,📊   */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Sessions Created", value: stats.total },
            {
              label: "Completed / Cancelled",
              value: `${stats.completed} / ${stats.cancelled || 0}`,
            },
            { label: "Upcoming", value: stats.upcoming },
            { label: "Progress", value: `${stats.progress}%` },
          ].map((c) => (
            <div
              key={c.label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center"
            >
              <p className="text-2xl font-black text-indigo-700">{c.value}</p>
              <p className="text-xs text-gray-500 mt-1 leading-tight">
                {c.label}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-gray-700 text-sm">
              Program Completion
            </p>
            <p className="font-bold text-indigo-700 text-sm">
              {stats.progress}% Complete
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-700"
              style={{ width: `${stats.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            The status bar shows {stats.progress}%, post completion of 8
            sessions through any 4 modules (2 sessions per module). Any 4
            modules are mandatory to complete the program.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-52">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="font-bold text-gray-700 text-base mb-4">
              Schedule A Meeting
            </h3>
            <button
              onClick={() => setShowModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-lg transition text-sm"
            >
              Schedule A Meeting
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-52">
            <div className="w-20 h-20 rounded-full border-4 border-gray-200 flex items-center justify-center mb-3">
              <span className="text-3xl">📅</span>
            </div>
            <p className="text-4xl font-black text-indigo-700">
              {stats.upcoming}
            </p>
            <p className="font-bold text-gray-600 mt-1">Upcoming Meetings</p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border p-12 text-center text-gray-400">
            <div className="text-4xl mb-2"></div>
            <p>Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
            <div className="text-5xl mb-3"></div>
            <p className="text-lg font-semibold text-gray-600">
              No sessions yet
            </p>
            <p className="text-sm mt-1">
              Schedule your first meeting with your mentor!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {[
                      "Session Topics",
                      "Status",
                      "Date",
                      "Start Time",
                      "End Time",
                      "Link",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr
                      key={s._id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-800 max-w-xs truncate">
                          {s.topic}
                        </p>
                        {s.mentor && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            with {s.mentor.name}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[s.status]}`}
                        >
                          {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(s.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {s.startTime || "—"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {s.endTime || "—"}
                      </td>
                      <td className="py-3 px-4">
                        {s.meetingLink ? (
                          <a
                            href={s.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-full transition font-semibold"
                          >
                            Join
                          </a>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {s.status === "upcoming" ? (
                          <button
                            onClick={() => setFeedback(s)}
                            className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-full transition font-semibold"
                          >
                            Mark Done
                          </button>
                        ) : s.status === "completed" ? (
                          <span className="text-xs text-green-600 font-semibold">
                            ✓ Done
                          </span>
                        ) : (
                          <span className="text-xs text-red-400">
                            Cancelled
                          </span>
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
