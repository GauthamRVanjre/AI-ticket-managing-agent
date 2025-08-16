import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateTicket() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

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
        toast.success(
          "Ticket created successfully! A moderator will be assigned to your ticket shortly."
        );
        navigate("/my-tickets");
      } else {
        toast.error(
          data.message || "Ticket creation failed. Please try again."
        );
      }
    } catch (err) {
      toast.error(
        "Error creating ticket. Please check your connection and try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="page-title mb-4">Create New Ticket</h1>

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
          <button
            type="button"
            className="secondary"
            onClick={() => navigate("/my-tickets")}
          >
            Cancel
          </button>
        </div>
        <p className="text-xs text-neutral-400">
          After submission, AI-generated helpful notes and priority will be
          available on the ticket details page.
        </p>
      </form>
    </div>
  );
}
