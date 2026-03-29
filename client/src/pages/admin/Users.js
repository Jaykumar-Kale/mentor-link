import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "mentee",
    phone: "",
    gender: "",
    organization: "",
    college: "",
    year: "",
    stream: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (roleFilter) params.append("role", roleFilter);
      const r = await api.get(`/admin/users?${params}`);
      setUsers(r.data.users);
      setTotal(r.data.total);
    } catch {
      toast.error("Failed to load users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]); // eslint-disable-line

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/admin/users", newUser);
      toast.success("User created!");
      setShowAdd(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "mentee",
        phone: "",
        gender: "",
        organization: "",
        college: "",
        year: "",
        stream: "",
      });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    }
    setSaving(false);
  };

  const toggleActive = async (id, current) => {
    try {
      await api.put(`/admin/users/${id}`, { isActive: !current });
      toast.success("Status updated");
      fetchUsers();
    } catch {
      toast.error("Update failed");
    }
  };

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

  return (
    <DashboardLayout>
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-lg font-bold text-indigo-800">
                Add New User
              </h2>
              <button
                onClick={() => setShowAdd(false)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Name *
                  </label>
                  <input
                    required
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Role *
                  </label>
                  <select
                    required
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className={inputCls}
                  >
                    {[
                      "mentee",
                      "mentor",
                      "admin",
                      "facilitator",
                      "alumni",
                      "donor",
                    ].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Phone
                  </label>
                  <input
                    value={newUser.phone}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Gender
                  </label>
                  <select
                    value={newUser.gender}
                    onChange={(e) =>
                      setNewUser({ ...newUser, gender: e.target.value })
                    }
                    className={inputCls}
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                {newUser.role === "mentor" && (
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">
                      Organisation
                    </label>
                    <input
                      value={newUser.organization}
                      onChange={(e) =>
                        setNewUser({ ...newUser, organization: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>
                )}
                {newUser.role === "mentee" && (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">
                        College
                      </label>
                      <input
                        value={newUser.college}
                        onChange={(e) =>
                          setNewUser({ ...newUser, college: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">
                        Year
                      </label>
                      <input
                        value={newUser.year}
                        onChange={(e) =>
                          setNewUser({ ...newUser, year: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                  </>
                )}
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
                  {saving ? "Creating..." : "Create User"}
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
          Manage Users
        </h1>
        <p>Admin &gt; All Users ({total})</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-3 flex-1">
            <input
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">All Roles</option>
              {[
                "mentor",
                "mentee",
                "admin",
                "facilitator",
                "alumni",
                "donor",
              ].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-5 py-2 rounded-lg transition text-sm"
          >
            + Add User
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">
            ⏳ Loading users...
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {[
                      "Name",
                      "Email",
                      "Role",
                      "Status",
                      "Matched",
                      "Joined",
                      "Actions",
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
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-10 text-center text-gray-400"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr
                        key={u._id}
                        className="border-b border-gray-50 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-semibold text-gray-800">
                          {u.name}
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-xs">
                          {u.email}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              u.role === "admin"
                                ? "bg-gray-200 text-gray-700"
                                : u.role === "mentor"
                                  ? "bg-indigo-100 text-indigo-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleActive(u._id, u.isActive)}
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${u.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"} transition`}
                          >
                            {u.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          {u.role === "mentee" && (
                            <span
                              className={`text-xs font-semibold ${u.isMatched ? "text-green-600" : "text-gray-400"}`}
                            >
                              {u.isMatched ? "✓ Matched" : "Unmatched"}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-400">
                          {new Date(u.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDelete(u._id, u.name)}
                            className="text-xs bg-red-100 text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-200 transition font-semibold"
                          >
                            Delete
                          </button>
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
