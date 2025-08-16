import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/tickets/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setTicket(data);
        } else {
          alert(data.message || "Failed to fetch ticket");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
      </div>
    );
  if (!ticket)
    return (
      <div className="text-center mt-10 text-neutral-400">Ticket not found</div>
    );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="page-title">Ticket Details</h2>
        <div className="flex flex-wrap gap-2">
          {ticket.status && <span className="badge">{ticket.status}</span>}
          {ticket.priority && <span className="badge">{ticket.priority}</span>}
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h3 className="text-xl font-semibold text-neutral-100">
          {ticket.title}
        </h3>
        <p className="text-neutral-300">{ticket.description}</p>

        <div className="pt-4 border-t border-neutral-800 grid gap-4 sm:grid-cols-2">
          {ticket.assignedTo && (
            <p className="text-sm text-neutral-300">
              <span className="text-neutral-400">Assigned To:</span>{" "}
              {ticket.assignedTo?.email}
            </p>
          )}
          {ticket.relatedSkills?.length > 0 && (
            <p className="text-sm text-neutral-300">
              <span className="text-neutral-400">Related Skills:</span>{" "}
              {ticket.relatedSkills.join(", ")}
            </p>
          )}
          {ticket.createdAt && (
            <p className="text-xs text-neutral-500 sm:col-span-2">
              Created: {new Date(ticket.createdAt).toLocaleString()}
            </p>
          )}
        </div>

        {ticket.helpfulNotes && (
          <div className="pt-4 border-t border-neutral-800 space-y-2">
            <div className="text-sm text-neutral-400">
              AI-generated Helpful Notes
            </div>
            <div className="rounded-md border border-neutral-800 bg-neutral-900 p-3 text-sm text-neutral-300">
              <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
