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
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Ticket Details</h2>

      <div className="card p-6 space-y-4">
        <h3 className="text-xl font-semibold text-neutral-100">
          {ticket.title}
        </h3>
        <p className="text-neutral-300">{ticket.description}</p>

        {ticket.status && (
          <div className="pt-4 border-t border-neutral-800 space-y-3">
            <h4 className="text-sm font-medium text-neutral-300">Metadata</h4>
            <p className="text-sm text-neutral-300">
              <span className="text-neutral-400">Status:</span> {ticket.status}
            </p>
            {ticket.priority && (
              <p className="text-sm text-neutral-300">
                <span className="text-neutral-400">Priority:</span>{" "}
                {ticket.priority}
              </p>
            )}

            {ticket.relatedSkills?.length > 0 && (
              <p className="text-sm text-neutral-300">
                <span className="text-neutral-400">Related Skills:</span>{" "}
                {ticket.relatedSkills.join(", ")}
              </p>
            )}

            {ticket.helpfulNotes && (
              <div className="text-sm text-neutral-300">
                <div className="text-neutral-400 mb-1">Helpful Notes:</div>
                <div className="rounded-md border border-neutral-800 bg-neutral-900 p-3">
                  <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
                </div>
              </div>
            )}

            {ticket.assignedTo && (
              <p className="text-sm text-neutral-300">
                <span className="text-neutral-400">Assigned To:</span>{" "}
                {ticket.assignedTo?.email}
              </p>
            )}

            {ticket.createdAt && (
              <p className="text-xs text-neutral-500">
                Created: {new Date(ticket.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
