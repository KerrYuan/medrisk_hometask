import type { AssessmentDetail } from "@/types/assessment";

export function AuditTrail({ assessment }: { assessment: AssessmentDetail }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Audit trail</h2>
      <div className="mt-4 grid gap-3">
        {assessment.audit_events.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No audit events yet.</p>
        ) : (
          assessment.audit_events.map((event) => (
            <article key={event.id} className="rounded-xl border border-slate-200 p-4 text-sm">
              <div className="font-medium text-slate-900">{event.action.replaceAll("_", " ")}</div>
              <div className="mt-1 text-slate-600">
                {event.previous_status && event.new_status ? `${event.previous_status} → ${event.new_status}` : "Recorded event"}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {event.actor} · {new Date(event.created_at).toLocaleString()}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
