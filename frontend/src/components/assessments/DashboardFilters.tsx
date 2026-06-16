"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  isAssessmentStatus,
  isDashboardOrdering,
  isRiskLevel,
} from "@/lib/queryParams";
import type {
  DashboardOrdering,
  DashboardQueryUpdates,
} from "@/types/queryParams";

export function DashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const riskLevelParam = searchParams.get("risk_level") ?? "";
  const statusParam = searchParams.get("status") ?? "";
  const orderingParam = searchParams.get("ordering") ?? "-submitted_at";

  const riskLevel = isRiskLevel(riskLevelParam) ? riskLevelParam : "";
  const status = isAssessmentStatus(statusParam) ? statusParam : "";
  const ordering: DashboardOrdering = isDashboardOrdering(orderingParam) ? orderingParam : "-submitted_at";

  useEffect(() => {
    const nextSearch = searchParams.get("search") ?? "";
    setSearch((prev) => (prev === nextSearch ? prev : nextSearch));
  }, [searchParams]);

  function updateParams(updates: DashboardQueryUpdates, replace = false) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(updates).forEach(([key, value]) => {
      if (value == null || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const query = params.toString();
    const nextUrl = `${pathname}${query ? `?${query}` : ""}`;
    if (replace) {
      router.replace(nextUrl);
      return;
    }
    router.push(nextUrl);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateParams({ search: search || null, page: null }, true);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-4">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Search
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="Candidate, employer, role"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Risk level
          <select
            value={riskLevel}
            onChange={(event) => {
              const value = event.target.value;
              updateParams({ risk_level: isRiskLevel(value) ? value : null, page: null });
            }}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
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
            value={status}
            onChange={(event) => {
              const value = event.target.value;
              updateParams({ status: isAssessmentStatus(value) ? value : null, page: null });
            }}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
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
            value={ordering}
            onChange={(event) => {
              const value = event.target.value;
              updateParams({ ordering: isDashboardOrdering(value) ? value : null, page: null });
            }}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="-submitted_at">Newest first</option>
            <option value="submitted_at">Oldest first</option>
            {/*<option value="risk_level">Risk level</option>*/}
            {/*<option value="status">Status</option>*/}
          </select>
        </label>
      </div>
    </section>
  );
}
