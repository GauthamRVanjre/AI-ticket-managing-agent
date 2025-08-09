import React from "react";

export default function ModeratorDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="page-title mb-4">Moderator Dashboard</h1>

      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
        <select className="w-44" disabled>
          <option>Filter by status (UI only)</option>
        </select>
        <select className="w-44" disabled>
          <option>Filter by priority (UI only)</option>
        </select>
        <select className="w-44" disabled>
          <option>Sort by (UI only)</option>
        </select>
      </div>

      <div className="card p-6">
        <div className="empty-state">No assigned tickets yet.</div>
      </div>
    </div>
  );
}
