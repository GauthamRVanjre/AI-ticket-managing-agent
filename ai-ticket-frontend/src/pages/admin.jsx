import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [ticketSearchQuery, setTicketSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "tickets") {
      fetchTickets();
    }
  }, [activeTab]);

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

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setTickets(data || []);
        setFilteredTickets(data || []);
      } else {
        console.error("Error fetching tickets");
      }
    } catch (err) {
      console.error("Error fetching tickets", err);
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
        `${import.meta.env.VITE_SERVER_URL}/auth/updateUser`,
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

  const handleTicketSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setTicketSearchQuery(query);
    setFilteredTickets(
      tickets.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query)
      )
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

      {/* Tabs */}
      <div className="mb-6 border-b border-neutral-800">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("users")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "users"
                ? "border-sky-500 text-sky-400"
                : "border-transparent text-neutral-400 hover:text-neutral-300"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("tickets")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "tickets"
                ? "border-sky-500 text-sky-400"
                : "border-transparent text-neutral-400 hover:text-neutral-300"
            }`}
          >
            Tickets
          </button>
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
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
                <span className="text-neutral-400">Current Role:</span>{" "}
                {user.role}
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
      )}

      {/* Tickets Tab */}
      {activeTab === "tickets" && (
        <div>
          <h2 className="section-title mb-2">Manage Tickets</h2>
          <input
            type="text"
            className="mb-6"
            placeholder="Search tickets by title or description"
            value={ticketSearchQuery}
            onChange={handleTicketSearch}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTickets.map((ticket) => (
              <Link to={`/tickets/${ticket._id}`}>
                <div key={ticket._id} className="card p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-neutral-100 line-clamp-2">
                      {ticket.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {ticket.status && (
                        <span className="badge">{ticket.status}</span>
                      )}
                      {ticket.priority && (
                        <span className="badge">{ticket.priority}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-neutral-400 line-clamp-3 mb-3">
                    {ticket.description}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Created: {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                  {ticket.assignedTo && (
                    <p className="text-xs text-neutral-500 mt-1">
                      Assigned: {ticket.assignedTo.email}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          {filteredTickets.length === 0 && (
            <div className="empty-state">No tickets found.</div>
          )}
        </div>
      )}
    </div>
  );
}
