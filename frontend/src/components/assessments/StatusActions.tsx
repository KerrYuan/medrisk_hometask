"use client";

import { getAllowedNextStatuses, STATUS_LABELS } from "@/lib/statusRules";
import type { AssessmentDetail, UserRole } from "@/types/assessment";

export function StatusActions({
  assessment,
  role,
}: {
  assessment: AssessmentDetail;
  role: UserRole;
}) {
  const allowed = getAllowedNextStatuses(assessment.status);
  const disabled = true;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Status actions</h2>
      <p className="mt-2 text-sm text-slate-600">
        Starter placeholder: status transitions are intentionally disabled.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {allowed.map((nextStatus) => (
          <button
            key={nextStatus}
            disabled={disabled}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            type="button"
          >
            Move to {STATUS_LABELS[nextStatus]}
          </button>
        ))}
      </div>
    </section>
  );
}
