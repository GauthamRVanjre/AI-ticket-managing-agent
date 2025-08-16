import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
  const [kpis, setKpis] = useState({
    totalTickets: 0,
    recentTickets: 0,
    avgResolutionTime: 0,
    moderatorPerformance: 0,
    ticketsByStatus: {},
  });
  const [pagination, setPagination] = useState({
    total: 0,
    skip: 0,
    take: 10,
    hasMore: false,
  });
  const [loading, setLoading] = useState(false);
  const [moderators, setModerators] = useState([]);
  const [assignModal, setAssignModal] = useState({
    show: false,
    ticketId: null,
    selectedModerator: "",
  });
  const [createUserModal, setCreateUserModal] = useState({
    show: false,
    formData: {
      email: "",
      password: "",
      code: "",
      skills: "",
    },
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "tickets") {
      fetchTickets();
    }
    fetchKPIs();
    fetchModerators();
  }, [activeTab]);

  const fetchModerators = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/moderators`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setModerators(data);
      } else {
        console.error("Error fetching moderators");
        toast.error("Failed to load moderators");
      }
    } catch (err) {
      console.error("Error fetching moderators", err);
      toast.error("Failed to load moderators");
    }
  };

  const fetchKPIs = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/tickets/kpis`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setKpis(data);
      } else {
        console.error("Error fetching KPIs");
        toast.error("Failed to load dashboard data");
      }
    } catch (err) {
      console.error("Error fetching KPIs", err);
      toast.error("Failed to load dashboard data");
    }
  };

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
        toast.error("Failed to load users");
      }
    } catch (err) {
      console.error("Error fetching users", err);
      toast.error("Failed to load users");
    }
  };

  const fetchTickets = async (skip = 0) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/tickets/admin?skip=${skip}&take=${
          pagination.take
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setTickets(data.tickets || []);
        setFilteredTickets(data.tickets || []);
        setPagination(data.pagination);
      } else {
        console.error("Error fetching tickets");
        toast.error("Failed to load tickets");
      }
    } catch (err) {
      console.error("Error fetching tickets", err);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasMore) {
      const newSkip = pagination.skip + pagination.take;
      fetchTickets(newSkip);
    }
  };

  const handlePrevPage = () => {
    if (pagination.skip > 0) {
      const newSkip = Math.max(0, pagination.skip - pagination.take);
      fetchTickets(newSkip);
    }
  };

  const openAssignModal = (ticketId) => {
    setAssignModal({ show: true, ticketId, selectedModerator: "" });
  };

  const openCreateUserModal = () => {
    setCreateUserModal({
      show: true,
      formData: {
        email: "",
        password: "",
        code: "",
        skills: "",
      },
    });
  };

  const handleCreateUser = async () => {
    try {
      const { email, password, code, skills } = createUserModal.formData;

      if (!email || !password) {
        toast.error("Email and password are required");
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            code,
            skills: skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setCreateUserModal({
          show: false,
          formData: { email: "", password: "", code: "", skills: "" },
        });
        fetchUsers(); // Refresh users list
        toast.success(`User ${email} created successfully`);
      } else {
        console.error("Error creating user:", data.error);
        toast.error(data.error || "Failed to create user");
      }
    } catch (err) {
      console.error("Error creating user", err);
      toast.error("Failed to create user. Please try again.");
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
        toast.error(data.error || "Failed to update user");
        return;
      }

      setEditingUser(null);
      setFormData({ role: "", skills: "" });
      fetchUsers();
      toast.success(`User ${editingUser} updated successfully`);
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update user. Please try again.");
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

      {/* Analytics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="kpi-card">
          <div className="kpi-label">Total Tickets</div>
          <div className="kpi-value mt-1">{kpis.totalTickets}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Recent (30 days)</div>
          <div className="kpi-value mt-1">{kpis.recentTickets}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Avg Resolution (days)</div>
          <div className="kpi-value mt-1">{kpis.avgResolutionTime}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Assigned Tickets</div>
          <div className="kpi-value mt-1">{kpis.moderatorPerformance}</div>
        </div>
      </div>

      {/* Status Breakdown */}
      {Object.keys(kpis.ticketsByStatus).length > 0 && (
        <div className="mb-8">
          <h3 className="section-title mb-4">Ticket Status Breakdown</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(kpis.ticketsByStatus).map(([status, count]) => (
              <div key={status} className="card p-4">
                <div className="text-sm text-neutral-400">{status}</div>
                <div className="text-2xl font-bold text-neutral-100">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-title">Manage Users</h2>
            <button className="primary" onClick={openCreateUserModal}>
              Create New User
            </button>
          </div>
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

          {loading && (
            <div className="text-center py-8">
              <div className="text-neutral-400">Loading tickets...</div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTickets?.map((ticket) => (
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
                {ticket.createdBy && (
                  <p className="text-xs text-neutral-500 mt-1">
                    By: {ticket.createdBy.email}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <Link to={`/tickets/${ticket._id}`} className="primary">
                    View
                  </Link>
                  {!ticket.assignedTo && (
                    <button
                      className="secondary"
                      onClick={() => openAssignModal(ticket._id)}
                    >
                      Assign
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredTickets.length === 0 && !loading && (
            <div className="empty-state">No tickets found.</div>
          )}

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-neutral-400">
                Showing {pagination.skip + 1} to{" "}
                {Math.min(pagination.skip + pagination.take, pagination.total)}{" "}
                of {pagination.total} tickets
              </div>
              <div className="flex gap-2">
                <button
                  className="secondary"
                  onClick={handlePrevPage}
                  disabled={pagination.skip === 0}
                >
                  Previous
                </button>
                <button
                  className="secondary"
                  onClick={handleNextPage}
                  disabled={!pagination.hasMore}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create User Modal */}
      {createUserModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 max-w-md w-full mx-4">
            <h3 className="section-title mb-4">Create New User</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm">Email *</label>
                <input
                  type="email"
                  className="w-full"
                  value={createUserModal.formData.email}
                  onChange={(e) =>
                    setCreateUserModal({
                      ...createUserModal,
                      formData: {
                        ...createUserModal.formData,
                        email: e.target.value,
                      },
                    })
                  }
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm">Password *</label>
                <input
                  type="password"
                  className="w-full"
                  value={createUserModal.formData.password}
                  onChange={(e) =>
                    setCreateUserModal({
                      ...createUserModal,
                      formData: {
                        ...createUserModal.formData,
                        password: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm">Referral Code</label>
                <select
                  className="w-full"
                  value={createUserModal.formData.code}
                  onChange={(e) =>
                    setCreateUserModal({
                      ...createUserModal,
                      formData: {
                        ...createUserModal.formData,
                        code: e.target.value,
                      },
                    })
                  }
                >
                  <option value="">Select role...</option>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm">Skills</label>
                <input
                  type="text"
                  className="w-full"
                  value={createUserModal.formData.skills}
                  onChange={(e) =>
                    setCreateUserModal({
                      ...createUserModal,
                      formData: {
                        ...createUserModal.formData,
                        skills: e.target.value,
                      },
                    })
                  }
                  placeholder="Comma-separated skills (e.g., JavaScript, React, Node.js)"
                />
              </div>
              <div className="flex gap-2">
                <button
                  className="primary"
                  onClick={handleCreateUser}
                  disabled={
                    !createUserModal.formData.email ||
                    !createUserModal.formData.password
                  }
                >
                  Create User
                </button>
                <button
                  className="secondary"
                  onClick={() =>
                    setCreateUserModal({
                      show: false,
                      formData: {
                        email: "",
                        password: "",
                        code: "",
                        skills: "",
                      },
                    })
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
