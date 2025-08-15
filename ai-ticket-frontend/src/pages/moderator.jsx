import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ModeratorDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedTicket, setDraggedTicket] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const statusColumns = [
    {
      id: "TODO",
      title: "Pending",
      color: "bg-yellow-500/20 border-yellow-500/30",
    },
    {
      id: "IN_PROGRESS",
      title: "In Progress",
      color: "bg-blue-500/20 border-blue-500/30",
    },
    {
      id: "DONE",
      title: "Resolved",
      color: "bg-green-500/20 border-green-500/30",
    },
  ];

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
      toast.error("Failed to load tickets. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  console.log(tickets);

  useEffect(() => {
    fetchTickets();
  }, []);

  const getTicketsByStatus = (status) => {
    return tickets.filter((ticket) => ticket.status === status);
  };

  const handleDragStart = (e, ticket) => {
    setDraggedTicket(ticket);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = (ticket) => {
    navigate(`/tickets/${ticket._id}`);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!draggedTicket || draggedTicket.status === newStatus) {
      setDraggedTicket(null);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/tickets/${draggedTicket._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        // Update local state
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === draggedTicket._id
              ? { ...ticket, status: newStatus }
              : ticket
          )
        );

        const statusText =
          statusColumns.find((col) => col.id === newStatus)?.title || newStatus;
        toast.success(`Ticket status updated to ${statusText}`);
      } else {
        toast.error("Failed to update ticket status. Please try again.");
        console.error("Failed to update ticket status");
      }
    } catch (err) {
      toast.error(
        "Error updating ticket status. Please check your connection."
      );
      console.error("Error updating ticket status:", err);
    }

    setDraggedTicket(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="page-title mb-4">Moderator Dashboard</h1>

      {/* Kanban Board */}
      <div className="grid gap-6 lg:grid-cols-3">
        {statusColumns.map((column) => (
          <div
            key={column.id}
            className={`rounded-lg border-2 border-dashed ${column.color} p-4 min-h-[600px]`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-neutral-200">{column.title}</h3>
              <span className="badge">
                {getTicketsByStatus(column.id).length}
              </span>
            </div>

            <div className="space-y-3">
              {getTicketsByStatus(column.id).map((ticket) => (
                <div
                  key={ticket._id}
                  className="card p-3 cursor-move hover:shadow-lg transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, ticket)}
                >
                  <div
                    className="flex items-start justify-between gap-2 mb-2 cursor-pointer hover:underline"
                    onClick={() => handleClick(ticket)}
                  >
                    <h4 className="font-medium text-neutral-100 text-sm line-clamp-2">
                      {ticket.title}
                    </h4>
                    {ticket.priority && (
                      <span className="badge text-xs">{ticket.priority}</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 mb-2">
                    {ticket.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>#{ticket._id.slice(-6)}</span>
                    <span>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {ticket.helpfulNotes && (
                    <div className="mt-2 p-2 bg-neutral-800/50 rounded text-xs text-neutral-300">
                      <div className="font-medium mb-1">AI Notes:</div>
                      <div className="line-clamp-2">{ticket.helpfulNotes}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {getTicketsByStatus(column.id).length === 0 && (
              <div className="empty-state text-center py-8">
                <p className="text-sm text-neutral-400">No tickets</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {tickets.length === 0 && (
        <div className="empty-state text-center py-12">
          <p className="mb-4">No tickets assigned to you yet.</p>
          <p className="text-sm text-neutral-400">
            Tickets will appear here once they are assigned to you.
          </p>
        </div>
      )}
    </div>
  );
}
