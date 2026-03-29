import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../utils/api";
import toast from "react-hot-toast";

const FILE_ICONS = {
  pdf: "📄",
  ppt: "📊",
  pptx: "📊",
  doc: "📝",
  docx: "📝",
  video: "🎬",
  other: "📎",
};

export default function MenteeModules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api
      .get("/modules")
      .then((r) => setModules(r.data.modules))
      .catch(() => toast.error("Failed to load modules"))
      .finally(() => setLoading(false));
  }, []);

  const MODULE_IMAGES = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80",
    "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=400&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80",
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "Poppins,sans-serif" }}
        >
          Modules
        </h1>
        <p>Student &gt; Modules</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">⏳</div>
            <p>Loading modules...</p>
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📚</div>
            <p className="text-lg font-semibold">No modules available yet</p>
            <p className="text-sm mt-1">
              Check back soon — admin will upload learning materials here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod, idx) => (
              <div
                key={mod._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                {/* Cover image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={
                      mod.coverImage ||
                      MODULE_IMAGES[idx % MODULE_IMAGES.length]
                    }
                    alt={mod.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = MODULE_IMAGES[idx % MODULE_IMAGES.length];
                    }}
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-indigo-800 text-base mb-1">
                    {mod.title}
                  </h3>
                  {mod.description && (
                    <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                      {mod.description}
                    </p>
                  )}

                  <button
                    onClick={() =>
                      setExpanded(expanded === mod._id ? null : mod._id)
                    }
                    className="text-sm font-semibold text-amber-500 hover:text-amber-600 transition flex items-center gap-1"
                  >
                    {expanded === mod._id
                      ? "▲ Hide resources"
                      : "▼ View resources"}
                    <span className="text-xs text-gray-400 ml-1">
                      ({mod.resources?.length || 0} files)
                    </span>
                  </button>

                  {expanded === mod._id && (
                    <div className="mt-3 space-y-2 border-t pt-3">
                      {mod.resources?.length === 0 && (
                        <p className="text-xs text-gray-400 italic">
                          No files uploaded yet.
                        </p>
                      )}
                      {mod.resources?.map((r) => (
                        <a
                          key={r._id}
                          href={r.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 transition text-sm"
                        >
                          <span className="text-lg">
                            {FILE_ICONS[r.fileType] || FILE_ICONS.other}
                          </span>
                          <span className="text-gray-700 hover:text-indigo-700 font-medium truncate">
                            {r.fileName}
                          </span>
                          <span className="ml-auto text-xs text-gray-400 uppercase">
                            {r.fileType}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
