import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../utils/api";
import toast from "react-hot-toast";

const DEFAULT_MODULES = [
  "Career Development",
  "Interpersonal Skills (work ethics, professionalism, collaboration)",
  "Communication Skills",
  "Time and Stress Management",
  "Etiquette (How to conduct yourself during interviews, while communicating)",
  "Problem Solving and Decision Making",
];

export default function AdminModules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newMod, setNewMod] = useState({
    title: "",
    description: "",
    order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null);
  const fileRef = useRef();

  const fetchModules = () => {
    api
      .get("/modules")
      .then((r) => setModules(r.data.modules))
      .catch(() => toast.error("Failed to load modules"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/modules", newMod);
      toast.success("Module created!");
      setShowAdd(false);
      setNewMod({ title: "", description: "", order: 0 });
      fetchModules();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
    setSaving(false);
  };

  const handleUpload = async (moduleId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(moduleId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post(`/modules/${moduleId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded!");
      fetchModules();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
    setUploading(null);
    e.target.value = "";
  };

  const handleDeleteResource = async (moduleId, resourceId) => {
    if (!window.confirm("Remove this file?")) return;
    try {
      await api.delete(`/modules/${moduleId}/resource/${resourceId}`);
      toast.success("Resource removed");
      fetchModules();
    } catch {
      toast.error("Failed");
    }
  };

  const handleToggle = async (id, current) => {
    try {
      await api.put(`/modules/${id}`, { isActive: !current });
      fetchModules();
    } catch {
      toast.error("Failed");
    }
  };

  const FILE_ICONS = {
    pdf: "📄",
    ppt: "📊",
    pptx: "📊",
    doc: "📝",
    docx: "📝",
    video: "🎬",
    other: "📎",
  };
  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

  return (
    <DashboardLayout>
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-lg font-bold text-indigo-800">
                Create Module
              </h2>
              <button
                onClick={() => setShowAdd(false)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Title *
                </label>
                <input
                  required
                  value={newMod.title}
                  onChange={(e) =>
                    setNewMod({ ...newMod, title: e.target.value })
                  }
                  className={inputCls}
                  placeholder="e.g. Career Development"
                  list="module-suggestions"
                />
                <datalist id="module-suggestions">
                  {DEFAULT_MODULES.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Description
                </label>
                <textarea
                  value={newMod.description}
                  onChange={(e) =>
                    setNewMod({ ...newMod, description: e.target.value })
                  }
                  rows={3}
                  className={inputCls}
                  placeholder="Brief description of this module..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Display Order
                </label>
                <input
                  type="number"
                  value={newMod.order}
                  onChange={(e) =>
                    setNewMod({ ...newMod, order: Number(e.target.value) })
                  }
                  className={inputCls}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-indigo-700 text-white rounded-lg font-semibold text-sm disabled:opacity-60"
                >
                  {saving ? "Creating..." : "Create Module"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "Poppins,sans-serif" }}
        >
          Manage Modules
        </h1>
        <p>Admin &gt; Learning Modules</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">{modules.length} modules</p>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-5 py-2.5 rounded-lg transition text-sm"
          >
            + Create Module
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">⏳ Loading...</div>
        ) : modules.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📚</div>
            <p className="text-lg font-semibold">No modules yet</p>
            <p className="text-sm mt-1">
              Create modules and upload learning materials for mentees.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((mod) => (
              <div
                key={mod._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-indigo-800 text-base">
                          {mod.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${mod.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                        >
                          {mod.isActive ? "Active" : "Hidden"}
                        </span>
                      </div>
                      {mod.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {mod.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {mod.resources?.length || 0} resources uploaded
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggle(mod._id, mod.isActive)}
                        className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                      >
                        {mod.isActive ? "Hide" : "Show"}
                      </button>
                      <label
                        className={`text-xs ${uploading === mod._id ? "bg-gray-400" : "bg-amber-500 hover:bg-amber-600"} text-white px-3 py-1.5 rounded-lg cursor-pointer transition font-semibold`}
                      >
                        {uploading === mod._id
                          ? "Uploading..."
                          : "+ Upload File"}
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.ppt,.pptx,.doc,.docx,.mp4"
                          disabled={uploading === mod._id}
                          onChange={(e) => handleUpload(mod._id, e)}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Resources */}
                  {mod.resources?.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {mod.resources.map((r) => (
                        <div
                          key={r._id}
                          className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <span className="text-xl">
                            {FILE_ICONS[r.fileType] || FILE_ICONS.other}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {r.fileName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {r.fileType?.toUpperCase()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={r.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-indigo-600 hover:underline font-semibold"
                            >
                              View
                            </a>
                            <button
                              onClick={() =>
                                handleDeleteResource(mod._id, r._id)
                              }
                              className="text-xs text-red-500 hover:text-red-700 font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
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
