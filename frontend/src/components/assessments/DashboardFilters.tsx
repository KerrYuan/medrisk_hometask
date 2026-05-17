"use client";

export function DashboardFilters() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-amber-700">
        Starter placeholder: Search/filter/sort not wired yet.
      </p>
      <div className="grid gap-3 md:grid-cols-4">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Search
          <input
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="Candidate, employer, role"
            disabled
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Risk level
          <select
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            defaultValue=""
            disabled
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Status
          <select
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            defaultValue=""
            disabled
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="in_review">In review</option>
            <option value="requires_follow_up">Requires follow-up</option>
            <option value="cleared">Cleared</option>
            <option value="not_cleared">Not cleared</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Sort
          <select
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            defaultValue="-submitted_at"
            disabled
          >
            <option value="-submitted_at">Newest first</option>
            <option value="submitted_at">Oldest first</option>
            <option value="risk_level">Risk level</option>
            <option value="status">Status</option>
          </select>
        </label>
      </div>
    </section>
  );
}
