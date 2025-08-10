import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });
      const data = await res.json();
      setTickets(data || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="page-title">My Tickets</h1>
        <Link to="/create-ticket" className="primary">
          Create New Ticket
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tickets.map((ticket) => (
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
        <div className="empty-state">
          <div className="text-center">
            <p className="mb-4">No tickets submitted yet.</p>
            <Link to="/create-ticket" className="primary">
              Create Your First Ticket
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
