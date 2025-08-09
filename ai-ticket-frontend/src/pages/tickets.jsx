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
    <div className="space-y-8">
      <section>
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
        </form>
      </section>

      <section>
        <h2 className="section-title mb-4">All Tickets</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <Link
              key={ticket._id}
              className="card p-4 hover:border-sky-700 hover:shadow-sky-900/10 transition"
              to={`/tickets/${ticket._id}`}
            >
              <h3 className="font-semibold text-neutral-100">{ticket.title}</h3>
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
          <p className="text-sm text-neutral-400">No tickets submitted yet.</p>
        )}
      </section>
    </div>
  );
}
