import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.email);
    setFormData({
      role: user.role,
      skills: user.skills?.join(", "),
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/update-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: editingUser,
            role: formData.role,
            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error(data.error || "Failed to update user");
        return;
      }

      setEditingUser(null);
      setFormData({ role: "", skills: "" });
      fetchUsers();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter((user) => user.email.toLowerCase().includes(query))
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="page-title mb-4">Admin Dashboard</h1>

      {/* Analytics (UI only) */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="kpi-card">
          <div className="kpi-label">Avg Resolution Time</div>
          <div className="kpi-value mt-1">—</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Ticket Volume</div>
          <div className="kpi-value mt-1">—</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Moderator Performance</div>
          <div className="kpi-value mt-1">—</div>
        </div>
      </div>

      <h2 className="section-title mb-2">Manage Users</h2>
      <input
        type="text"
        className="mb-6"
        placeholder="Search by email"
        value={searchQuery}
        onChange={handleSearch}
      />
      {filteredUsers.map((user) => (
        <div key={user._id} className="card p-4 mb-4">
          <p className="text-sm text-neutral-300">
            <span className="text-neutral-400">Email:</span> {user.email}
          </p>
          <p className="text-sm text-neutral-300 mt-1">
            <span className="text-neutral-400">Current Role:</span> {user.role}
          </p>
          <p className="text-sm text-neutral-300 mt-1">
            <span className="text-neutral-400">Skills:</span>{" "}
            {user.skills && user.skills.length > 0
              ? user.skills.join(", ")
              : "N/A"}
          </p>

          {editingUser === user.email ? (
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-2 block text-sm">Role</label>
                <select
                  className="w-full"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm">
                  Comma-separated skills
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2">
                <button className="primary" onClick={handleUpdate}>
                  Save
                </button>
                <button
                  className="secondary"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className="primary mt-3"
              onClick={() => handleEditClick(user)}
            >
              Edit
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
