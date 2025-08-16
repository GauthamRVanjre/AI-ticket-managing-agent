import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: { Authorization: `Token ${token}` },
        method: "GET",
      });
      const data = await res.json();
      setTickets(data || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets(); // Refresh list
      } else {
        alert(data.message || "Ticket creation failed");
      }
    } catch (err) {
      alert("Error creating ticket");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <section className="lg:col-span-1">
        <h2 className="section-title mb-4">Create Ticket</h2>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Short, descriptive title"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the issue or request with relevant details"
              rows={5}
              required
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="primary" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
          <p className="text-xs text-neutral-400">
            After submission, AI-generated helpful notes and priority will be
            available on the ticket details page.
          </p>
        </form>
      </section>

      <section className="lg:col-span-2">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="section-title">All Tickets</h2>
          <div className="flex items-center gap-2 text-xs">
            <select className="w-40" disabled>
              <option>Filter by status (UI only)</option>
            </select>
            <select className="w-40" disabled>
              <option>Filter by priority (UI only)</option>
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tickets?.map((ticket) => (
            <Link
              key={ticket._id}
              className="card p-4 hover:border-sky-700 hover:shadow-sky-900/10 transition"
              to={`/tickets/${ticket._id}`}
            >
              <div className="flex items-start justify-between gap-3">
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
              <p className="mt-1 line-clamp-3 text-sm text-neutral-400">
                {ticket.description}
              </p>
              <p className="mt-3 text-xs text-neutral-500">
                Created: {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
        {tickets.length === 0 && (
          <div className="empty-state">No tickets submitted yet.</div>
        )}
      </section>
    </div>
  );
}
