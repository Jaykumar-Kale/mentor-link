import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../utils/api";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api
      .get("/admin/sessions")
      .then((r) => setSessions(r.data.sessions))
      .catch(() => toast.error("Failed to load sessions"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? sessions.filter((s) => s.status === filter)
    : sessions;

  const counts = {
    all: sessions.length,
    upcoming: sessions.filter((s) => s.status === "upcoming").length,
    completed: sessions.filter((s) => s.status === "completed").length,
    cancelled: sessions.filter((s) => s.status === "cancelled").length,
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "Poppins,sans-serif" }}
        >
          All Sessions
        </h1>
        <p>Admin &gt; Sessions ({sessions.length} total)</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ["All", "all", "bg-gray-700"],
            ["Upcoming", "upcoming", "bg-blue-600"],
            ["Completed", "completed", "bg-green-600"],
            ["Cancelled", "cancelled", "bg-red-500"],
          ].map(([l, k, c]) => (
            <button
              key={k}
              onClick={() => setFilter(k === "all" ? "" : k)}
              className={`${c} text-white rounded-xl p-4 text-center transition ${filter === k || (k === "all" && !filter) ? "ring-4 ring-white ring-offset-2" : "opacity-70 hover:opacity-100"}`}
            >
              <p className="text-2xl font-black">{counts[k]}</p>
              <p className="text-xs mt-0.5 opacity-90">{l}</p>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">
            ⏳ Loading sessions...
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {[
                      "Topic",
                      "Mentor",
                      "Mentee",
                      "Status",
                      "Date",
                      "Time",
                      "Link",
                    ].map((h) => (
                      <th
                        key={h}
                        className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-10 text-center text-gray-400"
                      >
                        No sessions found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s) => (
                      <tr
                        key={s._id}
                        className="border-b border-gray-50 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-sm font-medium text-gray-700 max-w-48 truncate">
                          {s.topic}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {s.mentor?.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {s.mentee?.name}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[s.status]}`}
                          >
                            {s.status.charAt(0).toUpperCase() +
                              s.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(s.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {s.startTime}
                        </td>
                        <td className="py-3 px-4">
                          {s.meetingLink ? (
                            <a
                              href={s.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-indigo-600 hover:underline"
                            >
                              Join
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
